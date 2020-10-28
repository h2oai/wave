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


def _run(app: str, reload: bool):
    port = _scan_free_port()
    addr = f'http://{_localhost}:{port}'
    os.environ['H2O_WAVE_INTERNAL_ADDRESS'] = addr  # TODO deprecated
    os.environ['H2O_WAVE_EXTERNAL_ADDRESS'] = addr  # TODO deprecated
    os.environ['H2O_WAVE_APP_ADDRESS'] = addr
    uvicorn.run(f'{app}:main', host=_localhost, port=port, reload=reload)


@main.command()
@click.argument('app')
def run(app: str):
    """Run an app with live reload (development).

    \b
    Run main() in app.py:
    $ wave run app:main

    \b
    Run main() in path/to/app.py:
    $ wave run path.to.app:main
    """
    _run(app, reload=True)


@main.command()
@click.argument('app')
def start(app: str):
    """Run an app.

    \b
    Run main() in app.py:
    $ wave start app:main

    \b
    Run main() in path/to/app.py:
    $ wave start path.to.app:main
    """
    _run(app, reload=False)
