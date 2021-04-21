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
from pathlib import Path
import traceback
import asyncio
import socket
from contextlib import closing
from typing import Callable, Optional, List
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.background import BackgroundTask
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

_rpcs = {}


def rpc(f: Callable):
    _rpcs[f.__name__] = f
    return f


_localhost = '127.0.0.1'
_python = str(Path(sys.executable).resolve())  # follow venv/bin/python to /usr/bin/pythonX.x
_apps_dir = Path('.').absolute() / '.apps'
_apps_dir.mkdir(exist_ok=True)  # mkdir -p


def _scan_free_port(port: int = 8000):
    while True:
        with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            if sock.connect_ex((_localhost, port)):
                return port
        port += 1


_apps = {}


class App:
    def __init__(self, app_dir: Path):
        self.process: Optional[asyncio.subprocess.Process] = None
        self.dir = app_dir
        # TODO starting, stopping state handling

    async def start(self):
        python = self.dir / 'venv' / 'bin' / 'python'
        port = _scan_free_port()
        logger.info(str(python))
        self.process = await asyncio.create_subprocess_exec(
            str(python), '-m', 'uvicorn',
            '--port', str(port),
            '--app-dir', str(self.dir),
            '--reload',
            f'app:main',
            env=dict(H2O_WAVE_APP_ADDRESS=f'http://{_localhost}:{port}')
        )

    async def stop(self):
        if self.is_running():
            self.process.kill()

    def is_running(self):
        return self.process and self.process.returncode is None


def _make_app_py(app_name: str):
    return f'''from h2o_wave import main, app, Q, ui
@app('/{app_name}')
async def serve(q: Q):
    q.page['example'] = ui.form_card(
        box='1 1 12 10', items=[
            ui.text('Hello!'),
        ]
    )
    await q.page.save()
'''


def _write_file(p: Path, content: str):
    with open(str(p), 'w', encoding='utf-8') as f:
        f.write(content)


def _read_file(p: Path) -> str:
    with open(str(p), 'r', encoding='utf-8') as f:
        return f.read()


def _load_app(app_name: str):
    app_dir = _apps_dir / app_name
    _apps[app_name] = App(app_dir=app_dir)


def _rmdir(p: Path):
    for f in p.iterdir():
        if f.is_symlink():
            f.unlink()
        else:
            if f.is_dir():
                _rmdir(f)
            else:
                f.unlink()
    p.rmdir()


def _guard_app_name(app_name: str):
    if not app_name.isidentifier():
        raise ValueError('app name must be an identifier')


def _get_app(app_name: str) -> App:
    _guard_app_name(app_name)
    app = _apps.get(app_name)
    if not app:
        raise ValueError('app not found')
    return app


def _list_apps() -> List[str]:
    return [app_dir.name for app_dir in _apps_dir.iterdir() if app_dir.is_dir()]


def _file_path_of(app_name: str, file_name: str) -> Path:
    _guard_app_name(app_name)
    app_dir = _apps_dir / app_name
    file_path = (_apps_dir / app_name / file_name).resolve()
    if file_path.parent != app_dir:  # malicious?
        raise ValueError('file_name does not resolve to app directory')
    return file_path


#
# Public APIs
#

@rpc
async def create_app(app_name: str):
    _guard_app_name(app_name)
    if app_name in _apps:
        raise ValueError('an app by that name already exists')
    app_dir = _apps_dir / app_name
    _apps[app_name] = App(app_dir=app_dir)
    app_dir.mkdir(exist_ok=True)
    app_file = app_dir / 'app.py'
    _write_file(app_file, _make_app_py(app_name))
    venv = app_dir / 'venv'
    pip_install = await asyncio.create_subprocess_exec(_python, '-m', 'venv', str(venv))
    await pip_install.wait()
    # TODO collect and report output
    pip = venv / 'bin' / 'pip'
    wave_install = await asyncio.create_subprocess_exec(str(pip), 'install', '--upgrade', 'h2o-wave')
    # TODO collect and report output
    await wave_install.wait()


@rpc
async def delete_app(app_name: str):
    app = _get_app(app_name)
    if app.is_running():
        raise ValueError('app is currently running; stop before deleting')
    _rmdir(app.dir)
    del _apps[app_name]


@rpc
async def start_app(app_name: str):
    app = _get_app(app_name)
    if app.is_running():
        raise ValueError('app is already started')
    await app.start()


@rpc
async def stop_app(app_name: str):
    app = _get_app(app_name)
    if not app.is_running():
        raise ValueError('app is already stopped')
    await app.stop()


@rpc
async def list_apps() -> List[str]:
    return _list_apps()


@rpc
async def read_file(app_name: str, file_name: str) -> str:
    return _read_file(_file_path_of(app_name, file_name))


@rpc
async def write_file(app_name: str, file_name: str, file_content: str):
    app = _get_app(app_name)
    _write_file(_file_path_of(app_name, file_name), file_content)


@rpc
async def rename_file(app_name: str, file_name: str, new_file_name: str):
    app = _get_app(app_name)
    old_path = _file_path_of(app_name, file_name)
    new_path = _file_path_of(app_name, new_file_name)
    old_path.rename(new_path)
    await app.restart()


@rpc
async def delete_file(app_name: str, file_name: str):
    app = _get_app(app_name)
    _file_path_of(app_name, file_name).unlink()
    await app.restart()


#
# API Server
#

async def serve(request: Request):
    b = await request.json()
    method: str = b[0]
    kwargs: dict = b[1]

    f = _rpcs.get(method)
    if f is None:
        return JSONResponse([None, f'unknown method: {method}'])

    try:
        res = await f(**kwargs)
        return JSONResponse([res, None])
    except ValueError as e:
        return JSONResponse([None, str(e)])
    except:
        # noinspection PyBroadException,PyPep8
        return JSONResponse([None, traceback.format_exc()])


def main():
    for app_name in _list_apps():
        logger.info(f'Found app {app_name}')
        _load_app(app_name)
    return Starlette(routes=[Route('/', endpoint=serve, methods=['POST'])])


ide = main()
