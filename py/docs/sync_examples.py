import os.path
from typing import List

docs_dir = os.path.realpath(os.path.dirname(__file__))
example_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), os.pardir, 'examples'))


class Example:
    def __init__(self, filename: str, title: str, description: str, code: str):
        self.name = os.path.splitext(filename)[0]
        self.filename = filename
        self.title = title
        self.description = description
        self.code = code


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
    return Example(filename, title, '\n'.join(description), code)


def main():
    filenames = [line.strip() for line in read_lines(os.path.join(example_dir, 'tour.conf')) if
                 not line.strip().startswith('#')]

    examples = [load_example(filename) for filename in filenames]

    md = ['# Examples']
    for e in examples:
        md.extend([
            '',
            '## ' + e.title,
            '',
            e.description,
            '',
            '```py',
            e.code,
            '```',
            '',
        ])

    write_file(os.path.join(docs_dir, 'examples.md'), '\n'.join(md))


if __name__ == '__main__':
    main()
