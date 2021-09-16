from json import JSONEncoder
import subprocess
import glob
import time
import os
import signal
import re
import json
from typing import Any, List
from pathlib import Path
from playwright.sync_api import sync_playwright
import sys

example_file_path = os.path.join('..', '..', 'py', 'showcase.py')
docs_path = os.path.join('..', '..', 'website')


class CustomEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


class DocFile:
    def __init__(self, path, group, name) -> None:
        self.path = path
        self.group = group
        self.name = name


def get_template_code(code: str):
    return f'''
from h2o_wave import site, ui

page = site['/']
page.drop() # Drop any previous pages.
{code.replace('q.', '')}
page.save()
    '''


def make_snippet_screenshot(code: List[str], screenshot_name: str, browser: Any, group: str):
    code_str = ''.join(code)
    match = re.search('(q.page\\[)(\'|\")([\\w-]+)', code_str)
    if not match:
        raise ValueError(f'Could not extract card name for {screenshot_name}.')
    card_name = match.group(3)
    with open(example_file_path, 'w') as f:
        f.write(get_template_code(code_str))
    with subprocess.Popen(['venv/bin/python', 'showcase.py'], cwd=os.path.join('..', '..', 'py'), stderr=subprocess.PIPE) as p:  # noqa
        _, err = p.communicate()
        if err:
            raise ValueError(f'Could not generate {group} {screenshot_name}\n{err.decode()}')
        page = browser.new_page()
        page.goto('http://localhost:10101')
        path = os.path.join(docs_path, 'docs', 'showcase', group, 'assets', screenshot_name)
        if group:
            os.makedirs(os.path.dirname(path), exist_ok=True)
        sub_selector = ' > *' if 'ui.form_card' in code_str else ''
        page.query_selector(f'[data-test="{card_name}"]{sub_selector}').screenshot(path=path)
        page.close()


def generate_screenshots(browser: Any, files: List[DocFile]):
    for file in files:
        with open(file.path, 'r') as f:
            is_code = False
            code = []
            file_idx = 0
            for line in f.readlines():
                if is_code and not line.startswith('```'):
                    code.append(line)
                if line.startswith('```'):
                    if is_code:
                        screenshot_name = f"{file.name}-{file_idx}.png"
                        print(f'Generating screenshot for {screenshot_name}')
                        make_snippet_screenshot(code, screenshot_name, browser, file.group)
                        file_idx = file_idx + 1
                        code = []
                    is_code = not is_code


def append_images(files: List[DocFile]):
    for file in files:
        img_lines = []
        is_code = False
        with open(file.path, 'r') as f:
            idx = 0
            for line in f.readlines():
                if line.startswith('```'):
                    if not is_code:
                        screenshot_name = f"{file.name}-{idx}"
                        img_lines.append(f'![{screenshot_name}](assets/{screenshot_name}.png)\n\n')
                        idx = idx + 1
                    is_code = not is_code
                img_lines.append(line)
        file_path = os.path.join(docs_path, 'docs', file.path)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.writelines(img_lines)


def generate_showcase_json():
    files = []
    for p in Path('showcase').rglob('*.md'):
        map_to_doc_file(p, files)
    with open(os.path.join(docs_path, 'showcase.js'), 'w') as f:
        f.write(f'module.exports={json.dumps(files, cls=CustomEncoder)}')


def map_to_doc_file(p: Path, files: List[DocFile]):
    _, *groups, _ = p.parts
    if len(groups) > 1:
        raise ValueError(f'Nested folders not supported - {"/".join(groups)}')
    files.append(DocFile(str(p), groups[0] if groups else '', p.stem))


def main():
    qd_server = None
    arg_files = sys.argv[1:]
    files = []
    if not arg_files:
        # Remove old contents first.
        for f in glob.glob(os.path.join(docs_path, 'docs', 'showcase', '*.md')):
            os.remove(f)
        for f in glob.glob(os.path.join(docs_path, 'docs', 'showcase', 'assets', '*.png')):
            os.remove(f)

        for p in Path('showcase').rglob('*.md'):
            map_to_doc_file(p, files)
    else:
        for f in arg_files:
            p = Path(f'showcase/{f}.md')
            map_to_doc_file(p, files)

    try:
        qd_server = subprocess.Popen(
            ['make', 'run'],
            cwd=os.path.join('..', '..'),
            stderr=subprocess.DEVNULL,
            preexec_fn=os.setsid)
        time.sleep(1)  # Wait for server to boot up.
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            generate_screenshots(browser, files)
            browser.close()
        append_images(files)
        generate_showcase_json()
    except Exception as e:
        print(f'Error: {e.args[0]}')
    finally:
        # Cleanup.
        if os.path.exists(example_file_path):
            os.remove(example_file_path)
        if qd_server:
            os.killpg(os.getpgid(qd_server.pid), signal.SIGTERM)


if __name__ == '__main__':
    main()
