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

import collections
import os
import os.path
import shutil
import subprocess
import sys
import uuid
from asyncio import create_subprocess_exec
from glob import glob
from pathlib import Path
from string import Template
from typing import Dict, List, Optional
from urllib.parse import urlparse

from h2o_wave import Q, app, run_on, main, on, ui

from .utils import natural_keys, read_file, scan_free_port, strip_comment

tmp_dir = '__tmp_apps_dir'
university_dir = 'h2o_wave_university'

_base_url = os.environ.get('H2O_WAVE_BASE_URL', '/')
_app_address = urlparse(os.environ.get('H2O_WAVE_APP_ADDRESS', 'http://127.0.0.1:8000'))
default_lesson = 'lesson1'
vsc_extension_path = os.path.join('..', 'tools', 'vscode-extension')


class Lesson:
    def __init__(self, filename: str, title: str, description: str, source: str):
        self.name = os.path.splitext(filename)[0]
        self.filename = filename
        self.title = title
        self.description = description
        self.source = source
        self.previous_lesson: Optional[Lesson] = None
        self.next_lesson: Optional[Lesson] = None
        self.process: Optional[subprocess.Popen] = None

    async def start(self, filename: str, is_app: bool, q: Q):
        env = os.environ.copy()
        env['H2O_WAVE_BASE_URL'] = _base_url
        env['H2O_WAVE_ADDRESS'] = os.environ.get('H2O_WAVE_ADDRESS', 'http://127.0.0.1:10101')
        # The environment passed into Popen must include SYSTEMROOT, otherwise Popen will fail when called
        # inside python during initialization if %PATH% is configured, but without %SYSTEMROOT%.
        if sys.platform.lower().startswith('win'):
            env['SYSTEMROOT'] = os.environ['SYSTEMROOT']
        if is_app:
            q.app.app_port = scan_free_port(q.app.app_port)
            env['H2O_WAVE_APP_ADDRESS'] = f'http://{_app_address.hostname}:{q.app.app_port}'
            cmd = [
                sys.executable, '-m', 'uvicorn',
                '--host', '0.0.0.0',
                '--port', str(q.app.app_port),
                f'{filename.replace(".py", "")}:main',
            ]
            self.process = await create_subprocess_exec(*cmd, env=env)
        else:
            self.process = await create_subprocess_exec(sys.executable, filename, env=env)

    async def stop(self):
        if self.process and self.process.returncode is None:
            self.process.terminate()
            await self.process.wait()


def load_lesson(filename: str) -> Lesson:
    contents = read_file(os.path.join(university_dir, 'lessons', filename))
    parts = contents.split('---', maxsplit=1)
    header, source = parts[0].strip().splitlines(), parts[1].strip()
    title, description = strip_comment(header[0]), [strip_comment(x) for x in header[1:]]
    return Lesson(filename, title, '\n'.join(description), source)


def load_lessons(filenames: List[str]) -> Dict[str, Lesson]:
    lessons = collections.OrderedDict()
    for filename in filenames:
        filename = filename.split(os.sep)[-1]
        lessons[filename.replace('.py', '')] = load_lesson(filename)
    lesson_list = [e for e in lessons.values()]
    k = len(lesson_list) - 1
    for i, e in enumerate(lesson_list):
        if i > 0:
            e.previous_lesson = lesson_list[i - 1]
        if i < k:
            e.next_lesson = lesson_list[i + 1]
    return lessons


app_title = 'Wave University'


async def setup_page(q: Q):
    py_content = ''
    curr_dir = os.path.dirname(os.path.realpath(__file__))
    parser_path = os.path.join(curr_dir, 'autocomplete_parser.py')
    utils_path = os.path.join(curr_dir, 'autocomplete_utils.py')
    # In prod.
    if os.path.exists(parser_path) and os.path.exists(utils_path):
        with open(parser_path, 'r') as f:
            py_content = f.read()
        with open(utils_path, 'r') as f:
            py_content += f.read()
    # When run in development from Wave repo.
    elif os.path.exists(vsc_extension_path):
        with open(os.path.join(vsc_extension_path, 'server', 'parser.py'), 'r') as f:
            py_content = f.read()
        with open(os.path.join(vsc_extension_path, 'server', 'utils.py'), 'r') as f:
            py_content += f.read()
    if py_content:
        py_content += '''
def get_wave_completions(line, character, file_content):
    completion_type, leaf_val = get_completion_type(line, character, file_content)
    if completion_type in ['args', 'events', 'zones', 'client', 'app', 'user']:
        completion_items = []
        file_metadata = fill_completion(file_content)
        if completion_type == 'events' and leaf_val:
            completion_items = list(getattr(file_metadata, completion_type).get(leaf_val, []))
        elif completion_type == 'events' and leaf_val is None:
            completion_items = list(getattr(file_metadata, completion_type).keys())
        elif leaf_val is None:
            completion_items = getattr(file_metadata, completion_type)
        return [{'label': label, 'kind': 6, 'sort_text': '0'} for label in completion_items]
    elif completion_type == 'themes':
        return [{'label': theme, 'kind': 13, 'sort_text': '0'} for theme in themes]
    elif completion_type == 'icons':
        return [{'label': icon, 'kind': 13, 'sort_text': '0'} for icon in fluent_icons]
        '''
    js_code = ''
    with open(os.path.join(university_dir, 'static', 'university.js'), 'r') as f:
        js_code = f.read()
    template = Template(js_code).substitute(
        baseURL=_base_url,
        snippets1=q.app.snippets1,
        snippets2=q.app.snippets2,
        py_content=py_content
    )
    q.page['meta'] = ui.meta_card(
        box='',
        title=app_title,
        scripts=[ui.script(f'{_base_url}assets/loader.min.js')],
        script=ui.inline_script(content=template, requires=['require'], targets=['monaco-editor']),
        layouts=[
            ui.layout(breakpoint='xs', zones=[
                ui.zone('mobile_header'),
                ui.zone('main', direction=ui.ZoneDirection.COLUMN, zones=[
                    ui.zone('description'),
                    ui.zone('rhs', size='100vh')
                ]),
                ui.zone('nav'),
            ]),
            ui.layout(breakpoint='l', zones=[
                ui.zone('header'),
                ui.zone('main', size='calc(100vh - 76px)', direction=ui.ZoneDirection.ROW, zones=[
                    ui.zone('description', size='30%'),
                    ui.zone('rhs', size='70%')
                ])
            ])
        ])
    nav_links = [
        ('docs', 'Docs', 'https://wave.h2o.ai/docs/getting-started'),
        ('discussions', 'Forum', 'https://github.com/h2oai/wave/discussions'),
        ('cloud', 'AI Cloud', 'https://h2o.ai/platform/ai-cloud/'),
    ]
    q.page['header'] = ui.header_card(
        box='header',
        title=app_title,
        subtitle='Learn Wave interactively',
        image=f'{_base_url}assets/h2o-logo.svg',
        items=[],
        secondary_items=[
            ui.links(inline=True, items=[ui.link(label=link[1], path=link[2], target='_blank') for link in nav_links])
        ]
    )
    q.page['mobile_header'] = ui.header_card(
        box='mobile_header',
        title=app_title,
        subtitle='Learn Wave interactively',
        image=f'{_base_url}assets/h2o-logo.svg',
        nav=[ui.nav_group('Links', items=[ui.nav_item(name=link[0], label=link[1]) for link in nav_links])]
    )
    q.page['mobile_nav'] = ui.form_card(box='nav', items=[])
    q.page['code'] = ui.markup_card(
        box=ui.box('rhs', height='calc((100vh - 80px - 30px) / 2)'),
        title='',
        content='<div id="monaco-editor" style="position: absolute; top: 45px; bottom: 15px; right: 15px; left: 15px"/>'
    )
    # Put tmp placeholder <div></div> to simulate blank screen.
    q.page['preview'] = ui.frame_card(box='rhs', title='Preview', content='<div></div>')
    q.page['description'] = ui.markdown_card(box='description', title='', content='Dummy content')
    await q.page.save()


def make_blurb(q: Q):
    lesson = q.client.active_lesson
    # HACK: Recreate dropdown every time (by dynamic name) to control value (needed for next / prev btn functionality).
    prev_lesson_name = lesson.previous_lesson.name if lesson.previous_lesson is not None else ''
    next_lesson_name = lesson.next_lesson.name if lesson.next_lesson is not None else ''
    items = [
        ui.dropdown(name=q.args['#'] or default_lesson, width='230px', value=lesson.name, trigger=True,
                    choices=[ui.choice(name=e.name, label=e.title) for e in q.app.catalog.values()]),
        ui.button(name=f'#{prev_lesson_name}', label='Prev', disabled=prev_lesson_name == ''),
        ui.button(name=f'#{next_lesson_name}', label='Next', disabled=next_lesson_name == '')
    ]
    q.page['header'].items = items
    q.page['mobile_nav'].items = [ui.inline(justify='center', items=items)]
    q.page['description'].content = lesson.description


async def show_lesson(q: Q, lesson: Lesson):
    # Clear demo page
    demo_page = q.site[f'/{q.client.path}']
    demo_page.drop()
    await demo_page.save()

    filename = os.path.join(tmp_dir, f'{q.client.path}.py')
    code = q.events.editor.change if q.events.editor else lesson.source
    code = code.replace("`", "\\`")
    is_app = '@app(' in code
    with open(filename, 'w', encoding='utf-8') as f:
        fixed_path = code
        if is_app:
            fixed_path = fixed_path.replace("@app('/demo')", f"@app('/{q.client.path}')")
        else:
            fixed_path = fixed_path.replace("site['/demo']", f"site['/{q.client.path}']")
        f.write(fixed_path)
    if is_app:
        filename = '.'.join([tmp_dir, f'{q.client.path}.py']).split(os.sep)[-1]

    # Stop active lesson, if any.
    active_lesson = q.client.active_lesson
    if active_lesson:
        await active_lesson.stop()

    # Start new lesson
    await lesson.start(filename, is_app, q)
    q.client.active_lesson = lesson

    # Update lesson blurb
    make_blurb(q)

    # Update preview title
    q.page['preview'].title = f'Preview of {lesson.filename}'
    q.page['code'].title = lesson.filename
    await q.page.save()

    if q.client.is_first_load:
        # Make sure all the JS has loaded properly.
        await q.sleep(1)
        q.client.is_first_load = False

    # Update code display
    if not q.events.editor:
        code = code.replace('$', '\\$')
        q.page['meta'].script = ui.inline_script(f'editor.setValue(`{code}`)', requires=['editor'])
        await q.page.save()
        if q.args['#']:
            q.page['meta'].script = ui.inline_script('editor.setScrollPosition({ scrollTop: 0 }); editor.focus()',
                                                     requires=['editor'])

    # HACK
    # The ?e= appended to the path forces the frame to reload.
    # The url param is not actually used.
    q.page['preview'].path = f'{_base_url}{q.client.path}?e={lesson.name}'
    await q.page.save()


async def on_startup():
    # Clean up previous tmp dir.
    await on_shutdown()
    os.mkdir(tmp_dir)


async def on_shutdown():
    dirpath = Path(tmp_dir)
    if dirpath.exists():
        shutil.rmtree(dirpath)


@on("@system.client_disconnect")
async def client_disconnect(q: Q):
    demo_page = q.site[f'/{q.client.path}']
    demo_page.drop()
    await demo_page.save()

    if q.client.active_lesson:
        await q.client.active_lesson.stop()
    filename = os.path.join(tmp_dir, f'{q.client.path}.py')
    if os.path.exists(filename):
        os.remove(filename)


@app('/', on_startup=on_startup, on_shutdown=on_shutdown)
async def serve(q: Q):
    if not q.app.initialized:
        q.app.app_port = 10102
        base_snippets_path = os.path.join(university_dir, 'static', 'base-snippets.json')
        component_snippets_path = os.path.join(university_dir, 'static', 'component-snippets.json')
        # Prod.
        if os.path.exists(base_snippets_path) and os.path.exists(component_snippets_path):
            q.app.snippets1 = f'{_base_url}assets/base-snippets.json'
            q.app.snippets2 = f'{_base_url}assets/component-snippets.json'
        # When run in development from Wave repo.
        elif os.path.exists(vsc_extension_path):
            q.app.snippets1, q.app.snippets2, = await q.site.upload([
                os.path.join(vsc_extension_path, 'base-snippets.json'),
                os.path.join(vsc_extension_path, 'component-snippets.json')
            ])
        lesson_files = glob(os.path.join(university_dir, 'lessons', '*.py'))
        lesson_files.sort(key=natural_keys)
        q.app.catalog = load_lessons(lesson_files)
        q.app.initialized = True
    if not q.client.initialized:
        q.client.initialized = True
        q.client.is_first_load = True
        q.client.path = uuid.uuid4()
        await setup_page(q)

    search = q.args[q.args['#'] or default_lesson]
    if search and not q.events.editor:
        q.page['meta'] = ui.meta_card(box='', redirect=f'#{search}')

    await show_lesson(q, q.app.catalog[q.args['#'] or default_lesson])
    await run_on(q)
