import collections
import os
import os.path
import subprocess
import sys
from typing import List, Optional, Dict

from pygments import highlight
from pygments.formatters.html import HtmlFormatter
from pygments.lexers import get_lexer_by_name

from telesync import Q, configure, listen, ui

py_lexer = get_lexer_by_name('python')
html_formatter = HtmlFormatter(full=True, style='xcode')
example_dir = os.path.dirname(os.path.realpath(__file__))


class Example:
    def __init__(self, filename: str, title: str, description: str, code: str):
        self.name = os.path.splitext(filename)[0]
        self.filename = filename
        self.title = title
        self.description = description
        self.code = code
        self.previous_example: Optional[Example] = None
        self.next_example: Optional[Example] = None
        self.process: Optional[subprocess.Popen] = None

    def start(self):
        self.process = subprocess.Popen([sys.executable, os.path.join(example_dir, self.filename)])

    def stop(self):
        if self.process:
            self.process.terminate()


active_example: Optional[Example] = None


def read_lines(p: str) -> List[str]:
    with open(p) as f:
        return f.readlines()


def read_file(p: str) -> str:
    with open(p) as f:
        return f.read()


def write_file(p: str, txt: str) -> str:
    with open(p, 'w') as f:
        f.write(txt)
    return txt


def strip_comment(line: str) -> str:
    return line.strip(" #")


def load_example(filename: str) -> Example:
    contents = read_file(os.path.join(example_dir, filename))
    parts = contents.split('---', maxsplit=1)
    header, code = parts[0].strip().splitlines(), parts[1].strip()
    title, description = strip_comment(header[0]), [strip_comment(x) for x in header[1:]]
    return Example(filename, title, '\n'.join(description), highlight(code, py_lexer, html_formatter))


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


async def setup_page(q: Q):
    q.page['meta'] = ui.meta_card(
        box='',
        title='Examples'
    )

    q.page['examples'] = ui.nav_card(
        box='1 1 2 -1',
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
    await q.page.push()


def make_blurb(example: Example):
    buttons = []
    if example.previous_example:
        buttons.append(ui.button(name=f'#{example.previous_example.name}', label='Previous'))
    if example.next_example:
        buttons.append(ui.button(name=f'#{example.next_example.name}', label='Next', primary=True))

    return [
        ui.text(example.title, size='xl'),
        ui.text(example.description),
        ui.buttons(buttons),
    ]


async def show_example(q: Q, example: Example):
    # Clear demo page
    demo_page = q.site['/demo']
    demo_page.drop()
    await demo_page.push()

    # Stop active example, if any.
    global active_example
    if active_example:
        active_example.stop()

    # Start new example
    active_example = example
    active_example.start()

    # Update example blurb
    q.page['blurb'].items = make_blurb(active_example)

    # Update code display
    code_card = q.page['code']
    code_card.title = active_example.filename
    code_card.content = active_example.code

    # Update preview title
    preview_card = q.page['preview']
    preview_card.title = f'Preview of {active_example.filename}'
    # HACK
    # The ?e= appended to the path forces the frame to reload.
    # The url param is not actually used.
    preview_card.path = f'/demo?e={active_example.name}'
    await q.page.push()


async def main(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        await setup_page(q)

    route = q.args['#']
    if not route:
        route = 'hello_world'

    await show_example(q, catalog[route])


if __name__ == '__main__':
    example_filenames = [line.strip() for line in read_lines(os.path.join(example_dir, 'tour.conf')) if
                         not line.strip().startswith('#')]
    catalog = load_examples(example_filenames)
    configure(internal_address='ws://localhost:55554')
    listen('/tour', main)
