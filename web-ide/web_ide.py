from collections import namedtuple
import os
import os.path
from random import random
import re
import shutil
import sys
from subprocess import Popen
from pathlib import Path
from string import Template
from typing import Optional
from urllib.parse import urlparse

from h2o_wave import Q, app, main, ui

tmp_dir = 'tmp_project'
_server_adress = os.environ.get('H2O_WAVE_ADDRESS', 'http://127.0.0.1:10101')
_app_host = urlparse(os.environ.get('H2O_WAVE_APP_ADDRESS', 'http://127.0.0.1:8000')).hostname
_app_port = '10102'
vsc_extension_path = os.path.join('..', 'tools', 'vscode-extension')
WaveProcess = namedtuple('WaveProcess', 'process is_app path')


async def start(filename: str, code: str) -> Popen[bytes]:
    env = os.environ.copy()
    env['H2O_WAVE_BASE_URL'] = os.environ.get('H2O_WAVE_BASE_URL', '/')
    env['H2O_WAVE_ADDRESS'] = _server_adress
    # The environment passed into Popen must include SYSTEMROOT, otherwise Popen will fail when called
    # inside python during initialization if %PATH% is configured, but without %SYSTEMROOT%.
    if sys.platform.lower().startswith('win'):
        env['SYSTEMROOT'] = os.environ['SYSTEMROOT']
    if code.find('@app(') > 0:
        env['H2O_WAVE_APP_ADDRESS'] = f'http://{_app_host}:{_app_port}'
        return Popen([
            sys.executable, '-m', 'uvicorn',
            '--host', '0.0.0.0',
            '--port', _app_port,
            f'{filename.replace(".py", "")}:main',
        ], env=env)
    else:
        return Popen([sys.executable, filename], env=env)

async def stop(process: Optional[Popen[bytes]]) -> None:
    if process and process.returncode is None:
        process.terminate()
        process.wait()


def read_file(p: str) -> str:
    with open(p, encoding='utf-8') as f:
        return f.read()


async def setup_page(q: Q):
    py_content = ''
    # In prod.
    if os.path.exists('autocomplete_parser.py') and os.path.exists('autocomplete_utils.py'):
        py_content = read_file('autocomplete_parser.py')
        py_content += read_file('autocomplete_utils.py')
    # When run in development from Wave repo.
    elif os.path.exists(vsc_extension_path):
        py_content = read_file(os.path.join(vsc_extension_path, 'server', 'parser.py'))
        py_content += read_file(os.path.join(vsc_extension_path, 'server', 'utils.py'))
    if py_content:
        py_content += read_file('autocomplete.py')
    template = Template(read_file('web_ide.js')).substitute(snippets1=q.app.snippets1, snippets2=q.app.snippets2, py_content=py_content)
    q.page['meta'] = ui.meta_card(
        box='',
        title='Wave Web IDE',
        scripts=[
            ui.script('https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js'),
            ui.script('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.min.js'),
        ],
        script=ui.inline_script(content=template, requires=['require'], targets=['monaco-editor']),
        layouts=[
            ui.layout(breakpoint='xs', zones=[
                ui.zone('header'),
                ui.zone('blurb'),
                ui.zone('main', size='calc(100vh - 140px)', direction=ui.ZoneDirection.ROW, zones=[
                    ui.zone('code'),
                    ui.zone('preview')
                ])
            ])
        ])
    q.page['header'] = ui.header_card(
        box='header',
        title='Wave Web IDE',
        subtitle='Develop Wave apps completely in browser',
        image='https://wave.h2o.ai/img/h2o-logo.svg',
        items=[
            ui.links(inline=True, items=[
                ui.link(label='Wave docs', path='https://wave.h2o.ai/docs/getting-started', target='_blank'),
                ui.link(label='Discussions', path='https://github.com/h2oai/wave/discussions', target='_blank'),
                ui.link(label='Blog', path='https://wave.h2o.ai/blog', target='_blank'),
                ui.link(label='H2O', path='https://www.h2o.ai/', target='_blank'),
            ])
        ]
    )
    q.page['code'] = ui.markup_card(box='code', title='', content='<div id="monaco-editor" style="position: absolute; top: 45px; bottom: 15px; right: 15px; left: 15px"/>')
    # Put tmp placeholder <div></div> to simulate blank screen.
    q.page['preview'] = ui.frame_card(box='preview', title='Preview', content='<div></div>')
    await q.page.save()


async def render_code(q: Q):
    code = q.events.editor.change if q.events.editor else ''
    if not code:
        return

    code = code.replace("`", "\\`")
    code = code.replace('$', '\\$')

    is_app = '@app(' in code
    filename = os.path.join(tmp_dir, 'app.py')
    with open(filename, 'w') as f:
        f.write(code)

    curr_process = q.client.wave_process
    if not is_app and curr_process and curr_process.path:
        # Clear demo page
        demo_page = q.site[q.client.wave_process.path]
        demo_page.drop()
        await demo_page.save()

    path = ''
    app_match = re.search('\n@app\(.*(\'|\")(.*)(\'|\")', code)
    if app_match:
        path = app_match.group(2)
    else:
        script_match = re.search('site\[(\'|\")(.*)(\'|\")\]', code)
        if script_match:
            path = script_match.group(2)
    if not path:
        return

    if curr_process:
        await stop(curr_process.process)
    if is_app:
        filename = '.'.join([tmp_dir, 'app.py'])
        new_process = await start(filename, code)
        q.client.wave_process = WaveProcess(new_process, is_app, path)
        q.page['preview'].title = f'Preview of {_server_adress}{path}'
    # HACK
    # The ?e= appended to the path forces the frame to reload.
    # The url param is not actually used.
    q.page['preview'].path = f'{_server_adress}{path}?e={random()}'

    await q.page.save()


async def on_startup():
    # Clean up previous tmp dir.
    await on_shutdown()
    os.mkdir(tmp_dir)


async def on_shutdown():
    dirpath = Path(tmp_dir)
    if dirpath.exists():
        shutil.rmtree(dirpath)


@app('/ide', on_startup=on_startup, on_shutdown=on_shutdown)
async def serve(q: Q):
    if not q.app.initialized:
        # Prod.
        if os.path.exists('base-snippets.json') and os.path.exists('component-snippets.json'):
            q.app.snippets1, q.app.snippets2, = await q.site.upload(['base-snippets.json', 'component-snippets.json'])
        # When run in development from Wave repo.
        elif os.path.exists(vsc_extension_path):
            q.app.snippets1, q.app.snippets2, = await q.site.upload([
                os.path.join(vsc_extension_path, 'base-snippets.json'),
                os.path.join(vsc_extension_path, 'component-snippets.json')
            ])
        q.app.initialized = True
    if not q.client.initialized:
        await setup_page(q)
        q.client.initialized = True

    await render_code(q)
