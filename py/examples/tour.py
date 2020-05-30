from typing import List
import os
from telesync import Q, listen, ui, pack
from pygments.formatters.html import HtmlFormatter
from pygments import highlight
from pygments.lexers import get_lexer_by_name

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


async def main(q: Q):
    example = q.args.example
    if example:
        card = q.page['code']
        card.title = example
        card.content = read_example_code(example)
        await q.page.push()
    else:
        q.page['meta'] = ui.meta(
            box='',
            title='Examples'
        )
        group = ui.nav_group(label='Examples', items=[ui.nav_item(name=x, label=x) for x in example_list])
        nav = ui.nav(name='example', items=[group])
        q.page['examples'] = ui.form(
            box='1 1 2 -1',
            items=[nav],
        )
        q.page['code'] = ui.frame(
            box='3 1 5 -1',
            title='Code',
            content=read_example_code(example_list[0]),
        )
        q.page['preview'] = ui.template(
            box='8 1 5 -1',
            title='Preview',
            content='<iframe src="{{url}}" width="100%" height="100%" frameborder="0"/>',
            data=dict(url='/demo'),
        )
        await q.page.push()


if __name__ == '__main__':
    example_list = [line.strip() for line in read_lines(os.path.join(example_dir, 'tour.conf')) if
                    not line.strip().startswith('#')]
    listen('/tour', main)
