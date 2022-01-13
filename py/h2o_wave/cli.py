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
import sys
import socket
from contextlib import closing
import subprocess
import platform
import uvicorn
import click
import os
from urllib.parse import urlparse

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
@click.option("--no-reload", is_flag=True, default=False, help="Disable auto-reload.")
def run(app: str, no_reload: bool):
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
    server_port = int(os.environ.get('H2O_WAVE_LISTEN', 10101))
    server_not_running = _scan_free_port(server_port) == server_port
    try:
        waved = 'waved.exe' if 'Windows' in platform.system() else './waved'
        # OS agnostic wheels do not have waved - needed for HAC.
        is_waved_present = os.path.isfile(os.path.join(sys.exec_prefix, waved))
        is_autostart_off = os.environ.get('H2O_WAVE_NO_AUTOSTART', 'false').lower() in ['false', '0', 'f']
        if is_autostart_off and is_waved_present and server_not_running:
            subprocess.Popen([waved], cwd=sys.exec_prefix, env=os.environ.copy(), shell=True)
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
            uvicorn.run(f'{app}:main', host=_localhost, port=port, reload=not no_reload)
        else:
            print('Wave server (waved) needs to be started first.')


@main.command()
def ide():
    uvicorn.run('h2o_wave.ide:ide', host=_localhost, port=10100)
