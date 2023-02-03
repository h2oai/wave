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
import re
import shutil
import subprocess
import sys
from glob import glob
from pathlib import Path
from string import Template
from typing import Dict, List, Optional
from urllib.parse import urlparse

from h2o_wave import Q, app, main, ui

tmp_dir = '__tmp_apps_dir'
university_dir = 'h2o_wave_university'

_base_url = os.environ.get('H2O_WAVE_BASE_URL', '/')
_app_address = urlparse(os.environ.get('H2O_WAVE_APP_ADDRESS', 'http://127.0.0.1:8000'))
_app_host = _app_address.hostname
_app_port = '10102'
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

    async def start(self, filename: str, code: str):
        env = os.environ.copy()
        env['H2O_WAVE_BASE_URL'] = _base_url
        env['H2O_WAVE_ADDRESS'] = os.environ.get('H2O_WAVE_ADDRESS', 'http://127.0.0.1:10101')
        # The environment passed into Popen must include SYSTEMROOT, otherwise Popen will fail when called
        # inside python during initialization if %PATH% is configured, but without %SYSTEMROOT%.
        if sys.platform.lower().startswith('win'):
            env['SYSTEMROOT'] = os.environ['SYSTEMROOT']
        if code.find('@app(') > 0:
            env['H2O_WAVE_APP_ADDRESS'] = f'http://{_app_host}:{_app_port}'
            self.process = subprocess.Popen([
                sys.executable, '-m', 'uvicorn',
                '--host', '0.0.0.0',
                '--port', _app_port,
                f'{filename.replace(".py", "")}:main',
            ], env=env)
        else:
            self.process = subprocess.Popen([sys.executable, filename], env=env)

    async def stop(self):
        if self.process and self.process.returncode is None:
            self.process.terminate()
            self.process.wait()


def read_file(p: str) -> str:
    with open(p, encoding='utf-8') as f:
        return f.read()


def atoi(text):
    return int(text) if text.isdigit() else text


def natural_keys(text):
    return [atoi(c) for c in re.split(r'(\d+)', text)]


def strip_comment(line: str) -> str:
    """Returns the content of a line without '#' and ' ' characters

    remove leading '#', but preserve '#' that is part of a tag
    lesson:
    >>> '# #hello '.strip('#').strip()
    '#hello'
    """
    return line.strip('#').strip()


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


app_title = 'H2O Wave University'


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
    with open(os.path.join(university_dir, 'static','university.js'), 'r') as f:
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
                ui.zone('header'),
                ui.zone('main', size='calc(100vh - 80px)', direction=ui.ZoneDirection.ROW, zones=[
                    ui.zone('description', size='30%'),
                    ui.zone('rhs', size='70%')
                ])
            ])
        ])
    q.page['header'] = ui.header_card(
        box='header',
        title=app_title,
        subtitle='Learn Wave interactively',
        image=f'{_base_url}assets/h2o-logo.svg',
        items=[],
        secondary_items=[
            ui.links(inline=True, items=[
                ui.link(label='Wave docs', path='https://wave.h2o.ai/docs/getting-started', target='_blank'),
                ui.link(label='Discussions', path='https://github.com/h2oai/wave/discussions', target='_blank'),
                ui.link(label='Blog', path='https://wave.h2o.ai/blog', target='_blank'),
                ui.link(label='H2O AI Cloud', path='https://h2o.ai/platform/ai-cloud/', target='_blank'),
                ui.link(label='H2O', path='https://www.h2o.ai/', target='_blank'),
            ])
        ]
    )
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
    lesson = q.user.active_lesson
    # HACK: Recreate dropdown every time (by dynamic name) to control value (needed for next / prev btn functionality).
    prev_lesson_name = lesson.previous_lesson.name if lesson.previous_lesson is not None else ''
    next_lesson_name = lesson.next_lesson.name if lesson.next_lesson is not None else ''
    items = [
        ui.dropdown(name=q.args['#'] or default_lesson, width='300px', value=lesson.name, trigger=True,
                    choices=[ui.choice(name=e.name, label=e.title) for e in q.app.catalog.values()]),
        ui.button(name=f'#{prev_lesson_name}', label='Previous', disabled=prev_lesson_name == ''),
        ui.button(name=f'#{next_lesson_name}', label='Next', disabled=next_lesson_name == '')
    ]
    q.page['header'].items = items
    q.page['description'].content = lesson.description


async def show_lesson(q: Q, lesson: Lesson):
    # Clear demo page
    demo_page = q.site['/demo']
    demo_page.drop()
    await demo_page.save()

    filename = os.path.join(tmp_dir, 'tmp.py')
    code = q.events.editor.change if q.events.editor else lesson.source
    code = code.replace("`", "\\`")
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(code)
    filename = '.'.join([tmp_dir, 'tmp.py']).split(os.sep)[-1] if code.find('@app(') > 0 else filename

    # Stop active lesson, if any.
    active_lesson = q.user.active_lesson
    if active_lesson:
        await active_lesson.stop()

    # Start new lesson
    await lesson.start(filename, code)
    q.user.active_lesson = lesson

    # Update lesson blurb
    make_blurb(q)

    preview_card = q.page['preview']

    # Update preview title
    preview_card.title = f'Preview of {lesson.filename}'
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
            q.page['meta'].script = ui.inline_script('editor.setScrollPosition({ scrollTop: 0 }); editor.focus()', requires=['editor'])

    # HACK
    # The ?e= appended to the path forces the frame to reload.
    # The url param is not actually used.
    preview_card.path = f'{_base_url}demo?e={lesson.name}'
    await q.page.save()


async def on_startup():
    # Clean up previous tmp dir.
    await on_shutdown()
    os.mkdir(tmp_dir)


async def on_shutdown():
    dirpath = Path(tmp_dir)
    if dirpath.exists():
        shutil.rmtree(dirpath)


@app('/', on_startup=on_startup, on_shutdown=on_shutdown)
async def serve(q: Q):
    if not q.app.initialized:
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
        lesson_files = glob(os.path.join(university_dir, 'lessons', '*.py') )
        lesson_files.sort(key=natural_keys)
        q.app.catalog = load_lessons(lesson_files)
        q.app.initialized = True
    if not q.client.initialized:
        q.client.initialized = True
        q.client.is_first_load = True
        await setup_page(q)

    search = q.args[q.args['#'] or default_lesson]
    if search and not q.events.editor:
        q.page['meta'] = ui.meta_card(box='', redirect=f'#{search}')

    await show_lesson(q, q.app.catalog[q.args['#'] or default_lesson])
