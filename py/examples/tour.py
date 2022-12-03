import collections
import os
import os.path
import re
import shutil
import subprocess
import sys
from pathlib import Path
from string import Template
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse

from h2o_wave import Q, app, main, ui
example_dir = os.path.dirname(os.path.realpath(__file__))
tour_tmp_dir = os.path.join(example_dir, '_tour_apps_tmp')

_base_url = os.environ.get('H2O_WAVE_BASE_URL', '/')
_app_address = urlparse(os.environ.get('H2O_WAVE_APP_ADDRESS', 'http://127.0.0.1:8000'))
_app_host = _app_address.hostname
_app_port = '10102'
default_example_name = 'hello_world'
vsc_extension_path = os.path.join('..', '..', 'tools', 'vscode-extension')


class Example:
    def __init__(self, filename: str, title: str, description: str, source: str):
        self.name = os.path.splitext(filename)[0]
        self.filename = filename
        self.title = title
        self.description = description
        self.source = source
        self.previous_example: Optional[Example] = None
        self.next_example: Optional[Example] = None
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
                f'examples.{filename.replace(".py", "")}:main',
            ], env=env)
        else:
            self.process = subprocess.Popen([sys.executable, os.path.join(example_dir, filename)], env=env)

    async def stop(self):
        if self.process and self.process.returncode is None:
            self.process.terminate()
            self.process.wait()


active_example: Optional[Example] = None


def read_lines(p: str) -> List[str]:
    with open(p, encoding='utf-8') as f:
        return f.readlines()


def read_file(p: str) -> str:
    with open(p, encoding='utf-8') as f:
        return f.read()


def strip_comment(line: str) -> str:
    """Returns the content of a line without '#' and ' ' characters

    remove leading '#', but preserve '#' that is part of a tag
    example:
    >>> '# #hello '.strip('#').strip()
    '#hello'
    """
    return line.strip('#').strip()


def parse_tags(description: str) -> Tuple[str, List[str]]:
    """Creates tags from description.

    Accepts a description containing tags and returns a (new_description, tags) tuple.

    The convention for tags:
    1. Any valid twitter hashtag

    For example, accept a description in any of the following forms

    1. Use a checklist to group a set of related checkboxes. #form #checkbox #checklist

    2. Use a checklist to group a set of related checkboxes.
       #form #checkbox #checklist

    3. Use a #checklist to group a set of related checkboxes.
       #form #checkbox

    and return
    ('Use a checklist to group a set of related checkboxes.', ['checkbox', 'checklist', 'form']). The list of tags will
    be sorted and all tags will be converted to lowercase.

    Args:
        description: Complete description of an example.
    Returns:
        A tuple of new_description and a sorted list of tags. new_description is created by removing the '#' characters
        from the description.
    """
    hashtag_regex_pattern = r"(\s+)#(\w*[a-zA-Z]+\w*)\b"
    pattern = re.compile(hashtag_regex_pattern)
    matches = pattern.findall(' ' + description)

    # Retrieve tags from the matches
    tags = sorted(list(set([x[-1].lower() for x in matches])))

    # Remove the '#' before the tags in description
    new_d = pattern.sub(r'\1\2', ' ' + description)

    # Remove the last line in description if it has only tags
    *lines, last_line = new_d.strip().splitlines()
    last_line_has_tags_only = len(last_line.strip()) > 1 and all([x.strip().lower() in tags for x in last_line.split()])
    if last_line_has_tags_only:
        # Return all lines except the last line
        return '\n'.join(lines), tags

    # Remove the last sentence if it has only tags
    *sentences, last_sentence = last_line.split('. ')
    last_sentence_has_tags_only = len(last_sentence.strip()) > 1 and all(
        [x.strip().lower() in tags for x in last_sentence.split()])
    if last_sentence_has_tags_only:
        # Return all lines and all sentences in the last line except the last sentence
        lines.extend(sentences)
        return '\n'.join(lines) + '.', tags

    # Return the complete description
    lines.append(last_line)
    return '\n'.join(lines), tags


def load_example(filename: str) -> Example:
    contents = read_file(os.path.join(example_dir, filename))
    parts = contents.split('---', maxsplit=1)
    header, source = parts[0].strip().splitlines(), parts[1].strip()
    title, description = strip_comment(header[0]), [strip_comment(x) for x in header[1:]]
    new_description, _ = parse_tags('\n'.join(description))
    return Example(filename, title, new_description, source)


def load_examples(filenames: List[str]) -> Dict[str, Example]:
    examples = collections.OrderedDict()
    for filename in filenames:
        example = load_example(filename)
        examples[example.name] = example
    example_list = [e for e in examples.values()]
    k = len(example_list) - 1
    for i, e in enumerate(example_list):
        if i > 0:
            e.previous_example = example_list[i - 1]
        if i < k:
            e.next_example = example_list[i + 1]
    return examples


app_title = 'H2O Wave Tour'


async def setup_page(q: Q):
    py_content = ''
    parser_path = os.path.join(example_dir, 'tour_autocomplete_parser.py')
    utils_path = os.path.join(example_dir, 'tour_autocomplete_utils.py')
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
    with open(os.path.join(example_dir, 'tour.js'), 'r') as f:
        js_code = f.read()
    template = Template(js_code).substitute(
        tour_assets=q.app.tour_assets,
        base_url=_base_url,
        snippets1=q.app.snippets1,
        snippets2=q.app.snippets2,
        py_content=py_content
    )
    q.page['meta'] = ui.meta_card(
        box='',
        title=app_title,
        scripts=[ui.script(q.app.tour_assets + '/loader.min.js')],
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
        title=app_title,
        subtitle=f'{len(catalog)} Interactive Examples',
        image=f'{q.app.tour_assets}/h2o-logo.svg',
        items=[
            ui.links(inline=True, items=[
                ui.link(label='Wave docs', path='https://wave.h2o.ai/docs/getting-started', target='_blank'),
                ui.link(label='Discussions', path='https://github.com/h2oai/wave/discussions', target='_blank'),
                ui.link(label='Blog', path='https://wave.h2o.ai/blog', target='_blank'),
                ui.link(label='Hybrid Cloud', path='https://www.h2o.ai/hybrid-cloud/', target='_blank'),
                ui.link(label='H2O', path='https://www.h2o.ai/', target='_blank'),
            ])
        ]
    )
    q.page['blurb'] = ui.section_card(box='blurb', title='', subtitle='', items=[])
    q.page['code'] = ui.markup_card(
        box=ui.box('code', height='calc(100vh - 140px)'),
        title='',
        content='<div id="monaco-editor" style="position: absolute; top: 45px; bottom: 15px; right: 15px; left: 15px"/>'
    )
    # Put tmp placeholder <div></div> to simulate blank screen.
    q.page['preview'] = ui.frame_card(box='preview', title='Preview', content='<div></div>')
    await q.page.save()


def make_blurb(q: Q):
    example = q.user.active_example
    blurb_card = q.page['blurb']
    blurb_card.title = example.title
    blurb_card.subtitle = example.description
    # HACK: Recreate dropdown every time (by dynamic name) to control value (needed for next / prev btn functionality).
    items = [ui.dropdown(name=q.args['#'] or default_example_name, width='300px', value=example.name, trigger=True,
                         choices=[ui.choice(name=e.name, label=e.title) for e in catalog.values()])]
    if example.previous_example:
        items.append(ui.button(name=f'#{example.previous_example.name}', label='Previous'))
    if example.next_example:
        items.append(ui.button(name=f'#{example.next_example.name}', label='Next', primary=True))
    blurb_card.items = items


async def show_example(q: Q, example: Example):
    # Clear demo page
    demo_page = q.site['/demo']
    demo_page.drop()
    await demo_page.save()

    filename = os.path.join(tour_tmp_dir, 'tmp.py')
    code = q.events.editor.change if q.events.editor else example.source
    code = code.replace("`", "\\`")
    with open(filename, 'w') as f:
        f.write(code)
    filename = '.'.join([tour_tmp_dir, 'tmp.py']).split(os.sep)[-1] if code.find('@app(') > 0 else filename

    # Stop active example, if any.
    active_example = q.user.active_example
    if active_example:
        await active_example.stop()

    # Start new example
    await example.start(filename, code)
    q.user.active_example = example

    # Update example blurb
    make_blurb(q)

    preview_card = q.page['preview']

    # Update preview title
    preview_card.title = f'Preview of {example.filename}'
    q.page['code'].title = example.filename
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
    preview_card.path = f'{_base_url}demo?e={example.name}'
    await q.page.save()


async def on_startup():
    # Clean up previous tmp dir.
    await on_shutdown()
    os.mkdir(tour_tmp_dir)
    shutil.copyfile(os.path.join(example_dir, 'synth.py'), os.path.join(tour_tmp_dir, 'synth.py'))
    shutil.copyfile(os.path.join(example_dir, 'plot_d3.js'), os.path.join(tour_tmp_dir, 'plot_d3.js'))


async def on_shutdown():
    dirpath = Path(tour_tmp_dir)
    if dirpath.exists():
        shutil.rmtree(dirpath)


@app('/tour', on_startup=on_startup, on_shutdown=on_shutdown)
async def serve(q: Q):
    if not q.app.initialized:
        q.app.tour_assets, = await q.site.upload_dir(os.path.join(example_dir, 'tour-assets'))
        base_snippets_path = os.path.join(example_dir, 'base-snippets.json')
        component_snippets_path = os.path.join(example_dir, 'component-snippets.json')
        # Prod.
        if os.path.exists(base_snippets_path) and os.path.exists(component_snippets_path):
            q.app.snippets1, q.app.snippets2, = await q.site.upload([base_snippets_path, component_snippets_path])
        # When run in development from Wave repo.
        elif os.path.exists(vsc_extension_path):
            q.app.snippets1, q.app.snippets2, = await q.site.upload([
                os.path.join(vsc_extension_path, 'base-snippets.json'),
                os.path.join(vsc_extension_path, 'component-snippets.json')
            ])
        q.app.initialized = True
    if not q.client.initialized:
        q.client.initialized = True
        q.client.is_first_load = True
        await setup_page(q)

    search = q.args[q.args['#'] or default_example_name]
    if search and not q.events.editor:
        q.page['meta'] = ui.meta_card(box='', redirect=f'#{search}')

    await show_example(q, catalog[q.args['#'] or default_example_name])


example_filenames = [line.strip() for line in read_lines(os.path.join(example_dir, 'tour.conf')) if
                     not line.strip().startswith('#')]
catalog = load_examples(example_filenames)
print('----------------------------------------')
print(' Welcome to the H2O Wave Interactive Tour!')
print('')
print(' Go to http://localhost:10101/tour')
print('----------------------------------------')
