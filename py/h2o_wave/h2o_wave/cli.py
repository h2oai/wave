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

import asyncio
import os
import platform
import shutil
import socket
import subprocess
import sys
import tarfile
import time
from contextlib import closing
from pathlib import Path
from urllib import request
from urllib.parse import urlparse
import webbrowser

import click
import httpx
import inquirer
import uvicorn
from click import Choice, option
from h2o_wave.share import listen_on_socket

from .metadata import __arch__, __platform__
from .version import __version__

_localhost = '127.0.0.1'
IS_WINDOWS = 'Windows' in platform.system()


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


def _print_launch_bar(local: str, remote: str):
    logo = ''' _       _____ _    ________   _____ __  _____    ____  ______
| |     / /   | |  / / ____/  / ___// / / /   |  / __ \/ ____/
| | /| / / /| | | / / __/     \__ \/ /_/ / /| | / /_/ / __/
| |/ |/ / ___ | |/ / /___    ___/ / __  / ___ |/ _, _/ /___
|__/|__/_/  |_|___/_____/   /____/_/ /_/_/  |_/_/ |_/_____/
    '''
    message = f'Sharing {local} ==> {remote}'
    bar = "─" * (len(message) + 4)
    print(logo)
    print('┌' + bar + '┐')
    print('│  ' + message + '  │')
    print('└' + bar + '┘\n')
    print('\x1b[7;30;43mDO NOT SHARE IF YOUR APP CONTAINS SENSITIVE INFO\x1b[0m')


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
    os.environ['H2O_WAVE_APP_ADDRESS'] = addr

    # Make "python -m h2o_wave run" behave identical to "wave run":
    # Insert cwd into path, otherwise uvicorn fails to locate the app module.
    # uvicorn.main() does this before calling uvicorn.run().
    sys.path.insert(0, '.')

    # Allow relative paths from bash autocomplete. E.g. wave run ./foo.py
    if app.startswith(f'.{os.path.sep}'):
        app = app[2:]

    # DevX: treat foo/bar/baz.py as foo.bar.baz
    app_path, ext = os.path.splitext(app)
    if ext.lower() == '.py':
        app = app_path.replace(os.path.sep, '.')

    # Try to start Wave daemon if not running or turned off.
    server_port = int(os.environ.get('H2O_WAVE_LISTEN', ':10101').split(':')[-1])
    server_not_running = _scan_free_port(server_port) == server_port

    waved_process = None
    if no_autostart:
        autostart = False
    else:
        autostart = os.environ.get('H2O_WAVE_NO_AUTOSTART', 'false').lower() in ['false', '0', 'f']

    waved_path = os.path.join(sys.exec_prefix, 'waved.exe' if IS_WINDOWS else 'waved')
    # OS agnostic wheels do not include waved - needed for HAC.
    is_waved_present = os.path.isfile(waved_path)
    is_auto_started = server_not_running

    try:
        if autostart and is_waved_present and server_not_running:
            kwargs = {}
            if IS_WINDOWS:
                kwargs['creationflags'] = subprocess.CREATE_NEW_PROCESS_GROUP

            waved_process = subprocess.Popen([waved_path], cwd=sys.exec_prefix, env=os.environ.copy(), **kwargs)
            time.sleep(1)
            server_not_running = _scan_free_port(server_port) == server_port
            retries = 3
            while retries > 0 and server_not_running:
                print('Cannot connect to Wave server, retrying...')
                time.sleep(2)
                server_not_running = _scan_free_port(server_port) == server_port
                retries = retries - 1

        if autostart and server_not_running:
            print('Could not connect to Wave server. Please start the Wave server (waved or waved.exe) prior to running any app.')
            return

        if not os.environ.get('H2O_WAVE_WAVED_DIR') and is_auto_started:
            os.environ['H2O_WAVE_WAVED_DIR'] = sys.exec_prefix
        reload_exclude = os.environ.get('H2O_WAVE_RELOAD_EXCLUDE', None)
        if reload_exclude:
            reload_exclude = reload_exclude.split(os.pathsep)
        uvicorn.run(f'{app}:main', host=host, port=port, reload=not no_reload, reload_excludes=reload_exclude)
    except Exception as e:
        raise e
    finally:
        if waved_process:
            waved_process.kill()


@main.command()
@option('--platform', help='Operating system type.', type=Choice(['linux', 'windows', 'darwin']))
@option('--arch', default=__arch__, help='Processor architecture type.', type=Choice(['amd64', 'arm64']))
def fetch(platform: str, arch: str):
    """Download examples and related files to ./wave.

    \b
    $ wave fetch
    """
    if not platform:
        platform = __platform__

    if platform == 'any':
        print('Platform could not be detected. Please specify manually via --platform param.')
        return

    print('Fetching examples and related files. Please wait...')
    tar_name = f'wave-{__version__}-{platform}-{arch}'
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
        project = inquirer.prompt([
            inquirer.List(
                name='project',
                message="Choose a starter template",
                choices=[
                    ('Hello World app (for beginners)', 'hello_world.py'),
                    ('Chat app', 'chat.py'),
                    ('App with header', 'header.py'),
                    ('App with header + navigation', 'header_nav.py'),
                    ('App with sidebar + navigation', 'sidebar_nav.py'),
                    ('App with header & sidebar + navigation', 'header_sidebar_nav.py'),
                ]
            ),
        ], theme=theme)['project']
    # Ctrl-C causes TypeError within inquirer, resulting in ugly stacktrace. Catch the error and return early on CTRL-C.
    except (KeyboardInterrupt, TypeError):
        return

    base_path = os.path.join(sys.exec_prefix, 'project_templates')
    write_file('app.py', read_file(os.path.join(base_path, project)))
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


@main.command()
@click.option('--port', default=10101, help='Port your app is running on (defaults to 10101).')
@click.option('--subdomain', default='my-app', help='Subdomain to use. If not available, a random one is generated.')
@click.option('--remote-host', default='h2oai.app', help='Remote host to use (defaults to h2oai.app).')
@click.option('--remote-port', default=443, help='Remote port to use (defaults to 443).')
@click.option('--open', is_flag=True, default=False, help='Open the shared app in your browser automatically.')
def share(port: int, subdomain: str, remote_host: str, remote_port: int, open: bool):
    """Share your locally running app with the world.

    \b
    $ wave share
    """
    if IS_WINDOWS:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    if IS_WINDOWS:

        async def wakeup():
            while True:
                await asyncio.sleep(1)

        # HACK: Enable Ctrl-C on Windows when opening multiple TCP connections.
        # https://stackoverflow.com/questions/27480967/why-does-the-asyncios-event-loop-suppress-the-keyboardinterrupt-on-windows.
        loop.create_task(wakeup())

    try:
        loop.run_until_complete(_share(port, subdomain, remote_host, remote_port, open))
    except KeyboardInterrupt:
        tasks = asyncio.all_tasks(loop)
        for task in tasks:
            task.cancel()
        loop.run_until_complete(asyncio.gather(*tasks, return_exceptions=True))
        loop.close()
        print('Sharing stopped.')


async def _share(port: int, subdomain: str, remote_host: str, remote_port: int, should_open: bool):
    if _scan_free_port(port) == port:
        print(f'Could not connect to localhost:{port}. Please make sure your app is running.')
        exit(1)

    protocol = 'https' if remote_port == 443 else 'http'
    res = httpx.get(f'{protocol}://{remote_host}:{remote_port}/register/{subdomain}')
    if res.status_code != 200:
        print('Could not connect to the remote sharing server.')
        exit(1)

    res = res.json()
    share_id = res['id']

    remote = f'{protocol}://{share_id}.{remote_host}'
    if remote_port != 80 and remote_port != 443:
        remote += f':{remote_port}'

    _print_launch_bar(f'http://localhost:{port}', remote)

    max_conn_count = res['max_conn_count']
    # The server can be configured to either support 10 concurrent connections (default) or more.
    # If more, connect in batches of 100 for better performance.
    step = 100 if max_conn_count > 10 else max_conn_count

    tasks = []
    for _ in range(max_conn_count // step):
        for _ in range(step):
            tasks.append(asyncio.create_task(listen_on_socket('127.0.0.1', port, remote_host, remote_port, share_id)))
        await asyncio.sleep(1)
    # Handle the rest if any.
    for _ in range(max_conn_count % step):
        tasks.append(asyncio.create_task(listen_on_socket('127.0.0.1', port, remote_host, remote_port, share_id)))

    if should_open:
        await asyncio.sleep(1)
        webbrowser.open(remote)

    await asyncio.gather(*tasks)
    print('Could not establish connection with the server.')
