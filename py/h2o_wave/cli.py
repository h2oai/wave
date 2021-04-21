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

import sys
import socket
from contextlib import closing
import uvicorn
import click
import os

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

    port = _scan_free_port()
    addr = f'http://{_localhost}:{port}'
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

    uvicorn.run(f'{app}:main', host=_localhost, port=port, reload=not no_reload)


@main.command()
def ide():
    uvicorn.run(f'h2o_wave.ide:ide', host=_localhost, port=10100)
