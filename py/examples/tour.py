import collections
import os
import os.path
import re
import subprocess
import sys
from typing import List, Optional, Dict, Tuple

from pygments import highlight
from pygments.formatters.html import HtmlFormatter
from pygments.lexers import get_lexer_by_name

from h2o_wave import main, app, Q, ui

py_lexer = get_lexer_by_name('python')
html_formatter = HtmlFormatter(full=True, style='xcode')
example_dir = os.path.dirname(os.path.realpath(__file__))

_app_host = '127.0.0.1'
_app_port = '10102'


class Example:
    def __init__(self, filename: str, title: str, description: str, source: str):
        self.name = os.path.splitext(filename)[0]
        self.filename = filename
        self.title = title
        self.description = description
        self.source = source
        self.code = highlight(source, py_lexer, html_formatter)
        self.previous_example: Optional[Example] = None
        self.next_example: Optional[Example] = None
        self.process: Optional[subprocess.Popen] = None
        self.is_app = source.find('@app(') > 0

    async def start(self):
        # The environment passed into Popen must include SYSTEMROOT, otherwise Popen will fail when called
        # inside python during initialization if %PATH% is configured, but without %SYSTEMROOT%.
        env = {'SYSTEMROOT': os.environ['SYSTEMROOT']} if sys.platform.lower().startswith('win') else {}
        if self.is_app:
            self.process = subprocess.Popen(
                [sys.executable, '-m', 'uvicorn', '--port', _app_port, f'examples.{self.name}:main'],
                env=dict(H2O_WAVE_EXTERNAL_ADDRESS=f'http://{_app_host}:{_app_port}', **env))
        else:
            self.process = subprocess.Popen([sys.executable, os.path.join(example_dir, self.filename)], env=env)

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
    q.page['meta'] = ui.meta_card(
        box='',
        title=app_title
    )

    q.page['header'] = ui.header_card(
        box='1 1 2 1',
        title=app_title,
        subtitle=f'{len(catalog)} Interactive Examples',
    )

    q.page['examples'] = ui.nav_card(
        box='1 2 2 -1',
        items=[
            ui.nav_group(
                label='Examples',
                items=[ui.nav_item(name=f'#{e.name}', label=e.title) for e in catalog.values()]
            ),
        ],
    )

    q.page['blurb'] = ui.form_card(
        box='3 1 5 3',
        items=[],
    )

    q.page['code'] = ui.frame_card(
        box='3 4 5 -1',
        title='',
        content='',
    )
    q.page['preview'] = ui.frame_card(
        box='8 1 5 -1',
        title='Preview',
        path='/demo',
    )
    await q.page.save()


def make_blurb(example: Example):
    buttons = []
    if example.previous_example:
        buttons.append(ui.button(name=f'#{example.previous_example.name}', label='Previous'))
    if example.next_example:
        buttons.append(ui.button(name=f'#{example.next_example.name}', label='Next', primary=True))

    return [
        ui.text(example.title, size='l'),
        ui.text(example.description),
        ui.buttons(buttons),
    ]


async def show_example(q: Q, example: Example):
    # Clear demo page
    demo_page = q.site['/demo']
    demo_page.drop()
    await demo_page.save()

    # Stop active example, if any.
    global active_example
    if active_example:
        await active_example.stop()

    # Start new example
    active_example = example
    await active_example.start()

    # Update example blurb
    q.page['blurb'].items = make_blurb(active_example)

    # Update code display
    code_card = q.page['code']
    code_card.title = active_example.filename
    code_card.content = active_example.code

    preview_card = q.page['preview']

    # Update preview title
    preview_card.title = f'Preview of {active_example.filename}'
    # HACK
    # The ?e= appended to the path forces the frame to reload.
    # The url param is not actually used.
    preview_card.path = f'/demo?e={active_example.name}'
    await q.page.save()


@app('/tour')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        await setup_page(q)

    route = q.args['#']
    if not route:
        route = 'hello_world'

    await show_example(q, catalog[route])


example_filenames = [line.strip() for line in read_lines(os.path.join(example_dir, 'tour.conf')) if
                     not line.strip().startswith('#')]
catalog = load_examples(example_filenames)
print('----------------------------------------')
print(' Welcome to the H2O Wave Interactive Tour!')
print('')
print(' Go to http://localhost:10101/tour')
print('----------------------------------------')
