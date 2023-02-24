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
import inquirer
import os
from urllib import request
from urllib.parse import urlparse
from .version import __version__
from .metadata import __platform__, __arch__

_localhost = '127.0.0.1'

def read_file(file: str) -> str:
    with open(file, 'r') as f:
        return f.read()

def write_file(file: str, content: str) -> None:
    with open(file, 'w') as f:
        f.write(content)

def _scan_free_port(port: int = 8000):
    while True:
        with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            if sock.connect_ex((_localhost, port)):
                return port
        port += 1


def is_within_directory(directory, target):
    abs_directory = os.path.abspath(directory)
    abs_target = os.path.abspath(target)
    prefix = os.path.commonprefix([abs_directory, abs_target])
    
    return prefix == abs_directory


def safe_extract(tar, path=".", members=None, *, numeric_owner=False):
    for member in tar.getmembers():
        member_path = os.path.join(path, member.name)
        if not is_within_directory(path, member_path):
            raise Exception("Attempted Path Traversal in Tar File")

    tar.extractall(path, members, numeric_owner=numeric_owner) 
    

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
        if no_autostart:
            autostart = False
        else:
            autostart = os.environ.get('H2O_WAVE_NO_AUTOSTART', 'false').lower() in ['false', '0', 'f']
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
        if autostart and server_not_running:
            print('Could not connect to Wave server. Please start the Wave server (waved or waved.exe) prior to running any app.')
            return
        try:
            if not os.environ.get('H2O_WAVE_WAVED_DIR') and is_waved_present:
                os.environ['H2O_WAVE_WAVED_DIR'] = sys.exec_prefix
            uvicorn.run(f'{app}:main', host=host, port=port, reload=not no_reload)
        except Exception as e:
            if waved_process:
                waved_process.kill()
            raise e


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

    print('Extracting...')
    with tarfile.open(tar_file) as tar:
        safe_extract(tar)

    tar_dir = Path(tar_name)
    if not tar_dir.is_dir():
        raise click.ClickException('Failed extracting archive.')

    more_dir = 'wave'
    more_path = Path(more_dir)
    if more_path.exists() and more_path.is_dir():
        shutil.rmtree(more_dir)

    resolved_path = more_path.resolve()
    # Windows sometimes opens the dir in Quick Access, which prevents renaming.
    try:
        tar_dir.rename(more_dir)
    except:
        print(f'Could not rename extracted directory. Using the {tar_name} instead.')
        resolved_path = Path(tar_name).resolve()

    print('')
    print('All additional files downloaded and extracted successfully!')

    everything = (
        ('Examples and tour.............', 'examples'),
        ('Demos and layout samples......', 'demo'),
        ('Automated test harness........', 'test'),
        ('Wave daemon for deployments...', ''),
    )

    for label, location in everything:
        print(f"{label} {resolved_path.joinpath(location)}")


@main.command()
def init():
    """Initial scaffolding for your Wave project.

    \b
    $ wave init
    """
    try:
        theme = inquirer.themes.load_theme_from_dict({"List": {"selection_color": "yellow"}})
        project = inquirer.prompt([inquirer.List('project', message="Choose a starter template",
              choices=[
                  'Hello World app (for beginners)',
                  'App with header',
                  'App with header + navigation',
                  'App with sidebar + navigation',
                  'App with header & sidebar + navigation'
              ]),
        ], theme=theme)['project']
    # Ctrl-C causes TypeError within inquirer, resulting in ugly stacktrace. Catch the error and return early on CTRL-C.
    except (KeyboardInterrupt, TypeError):
        return

    app_content = ''
    base_path = os.path.join(sys.exec_prefix, 'project_templates')
    if 'Hello World' in project:
        app_content = read_file(os.path.join(base_path, 'hello_world.py'))
    elif 'header & sidebar' in project:
        app_content = read_file(os.path.join(base_path, 'header_sidebar_nav.py'))
    elif 'header +' in project:
        app_content = read_file(os.path.join(base_path, 'header_nav.py'))
    elif 'header' in project:
        app_content = read_file(os.path.join(base_path, 'header.py'))
    elif 'sidebar +' in project:
        app_content = read_file(os.path.join(base_path, 'sidebar_nav.py'))

    write_file('app.py', app_content)
    write_file('requirements.txt', f'h2o-wave=={__version__}')
    write_file('README.md', read_file(os.path.join(base_path, 'README.md')))

    print('Run \x1b[7;30;43mwave run app\x1b[0m to start your Wave app at \x1b[7;30;43mhttp://localhost:10101\x1b[0m.')


@main.command()
def learn():
    """Run interactive learning app - Wave university.

    \b
    $ wave learn
    """
    try:
        from h2o_wave_university import cli
        cli.main()
    except ImportError:
        print('You need to run \x1b[7;30;43mpip install h2o_wave_university\x1b[0m first.')