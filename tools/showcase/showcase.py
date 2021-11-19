import subprocess
import glob
import time
import os
import signal
import re
import json
import math
import sys
import shutil
from json import JSONEncoder
from typing import Any, List
from pathlib import Path
from playwright.sync_api import sync_playwright
from multiprocessing import Pool

example_file_path = os.path.join('..', '..', 'py', 'showcase')
docs_path = os.path.join('..', '..', 'website')
showcase_docs_path = os.path.join(docs_path, 'showcase')


class CustomEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


class DocFile:
    def __init__(self, path, group, name) -> None:
        self.path = path
        self.group = group
        self.name = name


def get_template_code(code: str, pool_idx: int):
    return f'''
from h2o_wave import site, ui

disable_animations = \'\'\'
* {{
    -webkit-animation: none !important;
    -moz-animation: none !important;
    -o-animation: none !important;
    -ms-animation: none !important;
    animation: none !important
}}
\'\'\'
page = site['/{pool_idx}']

page.drop() # Drop any previous pages.
page['meta'] = ui.meta_card(box='', stylesheet=ui.inline_stylesheet(disable_animations))
{code.replace('q.', '')}
page.save()
    '''


def make_snippet_screenshot(code: List[str], screenshot_name: str, page: Any, group: str, pool_idx: int):
    code_str = ''.join(code)
    match = re.findall('(q.page\\[)(\'|\")([\\w-]+)', code_str)
    if not match:
        raise ValueError(f'Could not extract card name for {screenshot_name}.')
    card_name = match[0][2] if match[0][2] != 'meta' else match[1][2]
    example_file = f'showcase{pool_idx}.py'
    with open(os.path.join(example_file_path, example_file), 'w+') as f:
        f.write(get_template_code(code_str, pool_idx))
    with subprocess.Popen(['venv/bin/python', f'showcase/{example_file}'], cwd=os.path.join('..', '..', 'py'), stderr=subprocess.PIPE) as p: # noqa
        _, err = p.communicate()
        if err:
            raise ValueError(f'Could not generate {group} {screenshot_name}\n{err.decode()}')
        page.goto(f'http://localhost:10101/{pool_idx}', wait_until='networkidle')

        if 'frame_card' in code_str:
            time.sleep(1)  # Wait for iframe content to be loaded.

        path = os.path.join(docs_path, 'docs', 'showcase', group, 'assets', screenshot_name)
        if group:
            os.makedirs(os.path.dirname(path), exist_ok=True)
        sub_selector = ' > *' if 'ui.form_card' in code_str else ''
        selector = f'[data-test="{card_name}"]{sub_selector}'
        page.wait_for_selector(selector)
        page.query_selector(selector).screenshot(path=path)


def generate_screenshots(files: List[DocFile], pool_idx: int):
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page()
        for file in files:
            with open(os.path.join(docs_path, file.path), 'r') as f:
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
                            make_snippet_screenshot(code, screenshot_name, page, file.group, pool_idx)
                            file_idx = file_idx + 1
                            code = []
                        is_code = not is_code
        browser.close()


def append_images(files: List[DocFile]):
    for file in files:
        img_lines = []
        is_code = False
        with open(os.path.join(docs_path, file.path), 'r') as f:
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
    for p in Path(showcase_docs_path).rglob('*.md'):
        map_to_doc_file(p, files)
    with open(os.path.join(docs_path, 'showcase.js'), 'w') as f:
        f.write(f'module.exports={json.dumps(files, cls=CustomEncoder)}')


def map_to_doc_file(p: Path, files: List[DocFile]):
    p = p.relative_to(docs_path)
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

        for p in Path(showcase_docs_path).rglob('*.md'):
            map_to_doc_file(p, files)
    else:
        for f in arg_files:
            p = Path(os.path.join(showcase_docs_path, f'{f}.md'))
            map_to_doc_file(p, files)

    try:
        os.makedirs(example_file_path)
        qd_server = subprocess.Popen(
            ['make', 'run'],
            cwd=os.path.join('..', '..'),
            stderr=subprocess.DEVNULL,
            preexec_fn=os.setsid)
        time.sleep(1)  # Wait for server to boot up.
        chunk_size = math.ceil(len(files) / os.cpu_count())
        file_chunks = [files[i:i + chunk_size] for i in range(0, len(files), chunk_size)]
        with Pool(len(file_chunks)) as pool:
            pool.starmap(generate_screenshots, [(chunk, idx) for idx, chunk in enumerate(file_chunks)])
            pool.close()
            pool.join()
        append_images(files)
        generate_showcase_json()
    except Exception as e:
        print(f'Error: {str(e)}')
    finally:
        # Cleanup.
        if os.path.exists(example_file_path):
            shutil.rmtree(example_file_path, ignore_errors=True)
        if qd_server:
            os.killpg(os.getpgid(qd_server.pid), signal.SIGTERM)


if __name__ == '__main__':
    main()
