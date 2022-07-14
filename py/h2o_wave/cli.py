# Copyright 2020 H2O.ai, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import time
import tarfile
import shutil
import sys
import socket
from contextlib import closing
import subprocess
from pathlib import Path
import platform
import uvicorn
import click
import os
from urllib import request
from urllib.parse import urlparse
from .version import __version__
from .metadata import __platform__, __arch__

_localhost = '127.0.0.1'


def _scan_free_port(port: int = 8000):
    while True:
        with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            if sock.connect_ex((_localhost, port)):
                return port
        port += 1


@click.group()
def main():
    pass


@main.command()
@click.argument('app')
@click.option("--no-reload", is_flag=True, default=False, help="Don't restart app when source code is changed.")
@click.option("--no-autostart", is_flag=True, default=False, help="Don't launch the Wave server automatically.")
def run(app: str, no_reload: bool, no_autostart: bool):
    """Run an app.

    \b
    Run app.py with auto reload:
    $ wave run app
    $ wave run app.py

    \b
    Run path/to/app.py with auto reload:
    $ wave run path.to.app
    $ wave run path/to/app.py

    \b
    Run path/to/app.py without auto reload:
    $ wave run --no-reload path.to.app
    $ wave run --no-reload path/to/app.py
    """

    app_address = urlparse(os.environ.get('H2O_WAVE_APP_ADDRESS', f'http://{_localhost}:{_scan_free_port()}'))
    host = app_address.hostname
    port = app_address.port

    addr = f'http://{host}:{port}'
    os.environ['H2O_WAVE_INTERNAL_ADDRESS'] = addr  # TODO deprecated
    os.environ['H2O_WAVE_EXTERNAL_ADDRESS'] = addr  # TODO deprecated
    os.environ['H2O_WAVE_APP_ADDRESS'] = addr

    # Make "python -m h2o_wave run" behave identical to "wave run":
    # Insert cwd into path, otherwise uvicorn fails to locate the app module.
    # uvicorn.main() does this before calling uvicorn.run().
    sys.path.insert(0, '.')

    # DevX: treat foo/bar/baz.py as foo.bar.baz
    app_path, ext = os.path.splitext(app)
    if ext.lower() == '.py':
        app = app_path.replace(os.path.sep, '.')

    # Try to start Wave daemon if not running or turned off.
    server_port = int(os.environ.get('H2O_WAVE_LISTEN', ':10101').split(':')[-1])
    server_not_running = _scan_free_port(server_port) == server_port
    try:
        waved = 'waved.exe' if 'Windows' in platform.system() else './waved'
        waved_process = None
        # OS agnostic wheels do not have waved - needed for HAC.
        is_waved_present = os.path.isfile(os.path.join(sys.exec_prefix, waved))
        autostart = (not no_autostart) or os.environ.get('H2O_WAVE_NO_AUTOSTART', 'false').lower() in ['false', '0', 'f']
        if autostart and is_waved_present and server_not_running:
            waved_process = subprocess.Popen([waved], cwd=sys.exec_prefix, env=os.environ.copy(), shell=True)
            time.sleep(1)
            server_not_running = _scan_free_port(server_port) == server_port
            retries = 3
            while retries > 0 and server_not_running:
                print('Cannot connect to Wave server, retrying...')
                time.sleep(2)
                server_not_running = _scan_free_port(server_port) == server_port
                retries = retries - 1
    finally:
        if not server_not_running:
            try:
                uvicorn.run(f'{app}:main', host=_localhost, port=port, reload=not no_reload)
            except:
                if waved_process:
                    waved_process.kill()
        else:
            print('Wave server not found. Please start the Wave server (waved or waved.exe) prior to running any app.')


@main.command()
def ide():
    uvicorn.run('h2o_wave.ide:ide', host=_localhost, port=10100)


@main.command()
def fetch():
    """Download examples and related files to ./wave.

    \b
    $ wave fetch
    """
    print('Fetching examples and related files. Please wait...')
    tar_name = f'wave-{__version__}-{__platform__}-{__arch__}'
    tar_file = f'{tar_name}.tar.gz'
    tar_url = f'https://github.com/h2oai/wave/releases/download/v{__version__}/{tar_file}'
    tar_path = Path(tar_file)

    if not tar_path.is_file():
        print(f'Downloading {tar_url}')
        request.urlretrieve(tar_url, tar_file)
        tar_path = Path(tar_file)
        if not tar_path.is_file():  # double-check
            raise click.ClickException(f'Failed fetching {tar_file}.')
    else:
        print(f'{tar_file} already exists. Skipping download.')

    print(f'Extracting...')
    with tarfile.open(tar_file) as tar:
        tar.extractall()

    tar_dir = Path(tar_name)
    if not tar_dir.is_dir():
        raise click.ClickException(f'Failed extracting archive.')

    more_dir = 'wave'
    more_path = Path(more_dir)
    if more_path.exists() and more_path.is_dir():
        shutil.rmtree(more_dir)
    tar_dir.rename(more_dir)

    resolved_path = more_path.resolve()

    print('')
    print(f'All additional files downloaded and extracted successfully!')

    everything = (
        ('Examples and tour.............', 'examples'),
        ('Demos and layout samples......', 'demo'),
        ('Automated test harness........', 'test'),
        ('Wave daemon for deployments...', ''),
    )

    for label, location in everything:
        print(f"{label} {resolved_path.joinpath(location)}")
