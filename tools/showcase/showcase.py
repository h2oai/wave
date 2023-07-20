import argparse
import json
import math
import os
import re
import shutil
import signal
import socket
import subprocess
import time
from contextlib import closing
from json import JSONEncoder
from multiprocessing import Pool
from pathlib import Path
from typing import List

from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

example_file_path = os.path.join('..', '..', 'py', 'showcase')
docs_path = os.path.join('..', '..', 'website')
widgets_docs_path = os.path.join(docs_path, 'widgets')
diff_folder_path = Path(os.path.join('test', 'diff'))


class CustomEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


class DocFile:
    def __init__(self, path, groups, name) -> None:
        self.path = path
        self.groups = groups
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


def generate_diff_view():
    if any(os.scandir(diff_folder_path)):
        with open('template-index.html', 'r') as f:
            content = f.read()
        with open('index.html', 'w+') as f:
            for file in Path(diff_folder_path).rglob('*.png'):
                src = '/'.join(file.parts)
                content += f'''
<h2>{str(file).replace('test/diff', '')}</h2>
<div class='row'>
  <img style="height: fit-content" src='{src.replace('diff', 'base', 1)}' />
  <img style="height: fit-content" src='{src.replace('diff', 'compare', 1)}' />
  <img style="height: fit-content" src='{src}' />
</div>'''
            content += '\n</body>\n</html>'
            f.write(content)


def make_snippet_screenshot(code: List[str], img_name: str, page, groups: List[str], pool_idx: int, is_test: bool, browser: str):
    code_str = ''.join(code)
    match = re.findall('(q.page\\[)(\'|\")([\\w-]+)', code_str)
    if not match:
        raise ValueError(f'Could not extract card name for {img_name}.')
    example_file = f'showcase{pool_idx}.py'
    with open(os.path.join(example_file_path, example_file), 'w+') as f:
        f.write(get_template_code(code_str, pool_idx))
    with subprocess.Popen(['venv/bin/python', f'showcase/{example_file}'], cwd=os.path.join('..', '..', 'py'), stderr=subprocess.PIPE) as p: # noqa
        _, err = p.communicate()
        if err:
            raise ValueError(f'Could not generate {img_name}\n{err.decode()}')
        page.goto(f'http://localhost:10101/{pool_idx}', wait_until='networkidle')

        # Wait for all the resources to be loaded.
        time.sleep(1)

        groups = os.path.join(*groups)
        path = os.path.join(docs_path, 'docs', 'widgets', groups, 'assets', img_name)
        if is_test:
            base_path = os.path.join('test', 'base', browser, groups, img_name)
            is_base = not Path(base_path).exists()
            path = base_path if is_base else os.path.join('test', 'compare', browser, groups, img_name)

        os.makedirs(os.path.dirname(path), exist_ok=True)
        card_name = match[0][2] if match[0][2] != 'meta' else match[1][2]
        selector = f'[data-test="{card_name}"]'
        if 'ui.form_card' in code_str:
            widget_count = len(page.query_selector_all(f'{selector} > :first-child > *'))
            selector = f'{selector} > *' if widget_count > 1 else f'{selector} > :first-child > *'
        page.wait_for_selector(selector)
        print(f'Generating {img_name}')
        page.query_selector(selector).screenshot(path=path)
        if is_test and not is_base:
            img_1 = Image.open(base_path).convert('RGB')
            img_2 = Image.open(os.path.join('test', 'compare', browser, groups, img_name)).convert('RGB')
            img_diff = ImageChops.difference(img_1, img_2)
            if img_diff.getbbox():
                print(f'\033[91mMISMATCH FOUND FOR: {img_name}\033[0m')
                diff_path = os.path.join(diff_folder_path, browser, groups, img_name)
                os.makedirs(os.path.dirname(diff_path), exist_ok=True)
                img_diff.save(diff_path)


def generate_screenshots(files: List[DocFile], pool_idx: int, is_test: bool):
    with sync_playwright() as playwright:
        browsers = ['chromium', 'webkit', 'firefox'] if is_test else ['chromium']
        for b in browsers:
            browser = getattr(playwright, b).launch()
            page = browser.new_page()
            for file in files:
                with open(os.path.join(docs_path, file.path), 'r') as f:
                    is_code = False
                    code = []
                    file_idx = 0
                    for line in f.readlines():
                        if line.startswith('```py') and 'ignore' not in line:
                            is_code = True
                        elif line.replace(' ', '').replace('\n', '') == '```' and is_code:
                            screenshot_name = f"{file.name}-{file_idx}.png"
                            make_snippet_screenshot(code, screenshot_name, page, file.groups, pool_idx, is_test, b)
                            file_idx = file_idx + 1
                            code = []
                            is_code = False
                        elif is_code:
                            code.append(line)
            browser.close()


def append_images(files: List[DocFile]):
    for file in files:
        img_lines = []
        with open(os.path.join(docs_path, file.path), 'r') as f:
            idx = 0
            for line in f.readlines():
                if line.startswith('```py') and 'ignore' not in line:
                    screenshot_name = f"{file.name}-{idx}"
                    img_lines.append(f'![{screenshot_name}](assets/{screenshot_name}.png)\n\n')
                    idx = idx + 1
                img_lines.append(line)
        file_path = os.path.join(docs_path, 'docs', file.path)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            f.writelines(img_lines)


def map_to_doc_file(p: Path) -> DocFile:
    p = p.relative_to(docs_path)
    _, *groups, _ = p.parts
    return DocFile(str(p), groups, p.stem)


def is_port_free(port: int):
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        return sock.connect_ex(('127.0.0.1', port))


def main():
    wave_server = None
    files = []
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', type=str, help='an integer for the accumulator', default=None)
    parser.add_argument('--test', action='store_true', help='Run visual tests')
    args = parser.parse_args()

    if not args.file:
        if args.test:
            with open('index.html', 'w') as f:
                f.truncate(0)
        else:
            for f in Path(os.path.join(docs_path, 'docs', 'widgets')).rglob('*.md'):
                os.remove(f)
            for f in Path(os.path.join(docs_path, 'docs', 'widgets')).rglob('*.png'):
                os.remove(f)
            for f in Path(diff_folder_path).rglob('*.png'):
                os.remove(f)
        for p in Path(widgets_docs_path).rglob('*.md'):
            files.append(map_to_doc_file(p))
    else:
        files = [map_to_doc_file(Path(os.path.join(widgets_docs_path, f'{args.file}.md')))]

    try:
        os.makedirs(example_file_path)
        wave_server = subprocess.Popen(['make', 'run'], cwd=os.path.join('..', '..'), stderr=subprocess.DEVNULL, preexec_fn=os.setsid) # noqa
        time.sleep(1)

        retries = 3
        server_port = 10101
        server_not_running = is_port_free(server_port)
        while retries > 0 and server_not_running:
            print('Cannot connect to Wave server, retrying...')
            time.sleep(2)
            server_not_running = is_port_free(server_port)
            retries = retries - 1
        if server_not_running:
            raise Exception('Could not connect to Wave server.')

        chunk_size = math.ceil(len(files) / os.cpu_count())
        file_chunks = [files[i:i + chunk_size] for i in range(0, len(files), chunk_size)]
        with Pool(len(file_chunks)) as pool:
            pool.starmap(generate_screenshots, [(chunk, idx, args.test) for idx, chunk in enumerate(file_chunks)])
            pool.close()
            pool.join()
        if not args.test:
            append_images(files)
        else:
            generate_diff_view()
            print('Testing finished, run \033[92mmake test-result\033[0m to see the results.')
    finally:
        if os.path.exists(example_file_path):
            shutil.rmtree(example_file_path, ignore_errors=True)
        if wave_server:
            os.killpg(os.getpgid(wave_server.pid), signal.SIGTERM)
        print('Done')


if __name__ == '__main__':
    main()
