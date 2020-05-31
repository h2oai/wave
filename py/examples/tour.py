import os
import subprocess
import sys
from typing import List, Optional

from pygments import highlight
from pygments.formatters.html import HtmlFormatter
from pygments.lexers import get_lexer_by_name

from telesync import Q, listen, ui

py_lexer = get_lexer_by_name('python')
html_formatter = HtmlFormatter(full=True, style='xcode')
example_dir = os.path.dirname(os.path.realpath(__file__))


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


def read_example_code(py_filename: str) -> str:
    py_path = os.path.join(example_dir, py_filename)
    ex_path = os.path.join(example_dir, f'{py_filename}.html')
    exists = os.path.exists(ex_path) and (os.path.getmtime(py_path) <= os.path.getmtime(ex_path))
    if exists:
        return read_file(ex_path)

    code = read_file(py_path)
    result = highlight(code, py_lexer, html_formatter)
    return write_file(ex_path, result)


current_example_process: Optional[subprocess.Popen] = None


def execute_example(py_filename: str):
    global current_example_process
    if current_example_process:
        current_example_process.terminate()
    current_example_process = subprocess.Popen([sys.executable, os.path.join(example_dir, py_filename)])


async def setup_page(q: Q):
    q.page['meta'] = ui.meta(
        box='',
        title='Examples'
    )
    q.page['examples'] = ui.form(
        box='1 1 2 -1',
        items=[
            ui.nav(name='example', items=[
                ui.nav_group(
                    label='Examples',
                    items=[ui.nav_item(name=x, label=x) for x in example_list]
                ),
            ])
        ],
    )
    example = example_list[0]
    q.page['code'] = ui.frame(
        box='3 1 5 -1',
        title=example,
        content=read_example_code(example),
    )
    q.page['preview'] = ui.frame(
        box='8 1 5 -1',
        title='Preview',
        path='/demo',
    )
    await q.page.push()


async def display_example(q: Q, example: str):
    card = q.page['code']
    card.title = example
    card.content = read_example_code(example)
    await q.page.push()

    demo_page = q.site['/demo']
    demo_page.drop()
    await demo_page.push()

    execute_example(example)


async def main(q: Q):
    example = q.args.example
    if example:
        await display_example(q, example)
    else:
        await setup_page(q)


if __name__ == '__main__':
    example_list = [line.strip() for line in read_lines(os.path.join(example_dir, 'tour.conf')) if
                    not line.strip().startswith('#')]
    listen('/tour', main)
