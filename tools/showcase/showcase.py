import subprocess
import glob
import time
import os
import signal
import re
import json
from typing import Any, List
from playwright.sync_api import sync_playwright

example_file_path = os.path.join('..', '..', 'py', 'showcase.py')
docs_path = os.path.join('..', '..', 'website')
files = [f.replace('.md', '') for f in glob.glob(os.path.join('showcase', '*.md'))]


def get_template_code(code: str):
    return f'''
from h2o_wave import site, ui

page = site['/']
{code.replace('q.', '')}
page.save()
    '''


def make_snippet_screenshot(code: List[str], screenshot_name: str, browser: Any):
    code_str = ''.join(code)
    match = re.search('(q.page\\[)(\'|\")([\\w-]+)', code_str)
    if not match:
        raise ValueError('Could not extract card name.')
    card_name = match.group(3)
    with open(example_file_path, 'w') as f:
        f.write(get_template_code(code_str))
    with subprocess.Popen(['venv/bin/python', 'showcase.py'], cwd=os.path.join('..', '..', 'py')):
        page = browser.new_page()
        page.goto('http://localhost:10101')
        path = os.path.join(docs_path, 'docs', 'showcase', 'assets', screenshot_name)
        page.query_selector(f'[data-test="{card_name}"]').screenshot(path=path)
        page.close()


def generate_screenshots(browser: Any):
    for file in files:
        with open(f'{file}.md', 'r') as f:
            is_code = False
            code = []
            file_idx = 0
            file = file.replace('showcase/', '')
            for line in f.readlines():
                if is_code and not line.startswith('```'):
                    code.append(line)
                if line.startswith('```'):
                    if is_code:
                        screenshot_name = f"{file}-{file_idx}.png"
                        make_snippet_screenshot(code, screenshot_name, browser)
                        file_idx = file_idx + 1
                        code = []
                    is_code = not is_code


def append_images():
    for file in files:
        img_lines = []
        is_code = False
        with open(f'{file}.md', 'r') as f:
            idx = 0
            file = file.replace('showcase/', '')
            for line in f.readlines():
                if line.startswith('```'):
                    if not is_code:
                        screenshot_name = f"{file}-{idx}"
                        img_lines.append(f'![{screenshot_name}](assets/{screenshot_name}.png)\n\n')
                        idx = idx + 1
                    is_code = not is_code
                img_lines.append(line)
        with open(os.path.join(docs_path, 'docs', 'showcase', f'{file}.md'), 'w') as f:
            f.writelines(img_lines)


def generate_showcase_json():
    with open(os.path.join(docs_path, 'showcase.js'), 'w') as f:
        f.write(f'module.exports={json.dumps(files)}')


def main():
    try:
        # Remove old contents first.
        for f in glob.glob(os.path.join(docs_path, 'docs', 'showcase', '*.md')):
            os.remove(f)
        for f in glob.glob(os.path.join(docs_path, 'docs', 'showcase', 'assets', '*.png')):
            os.remove(f)
        qd_server = subprocess.Popen(['make', 'run'], cwd=os.path.join('..', '..'), preexec_fn=os.setsid)
        time.sleep(1)  # Wait for server to boot up.
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            generate_screenshots(browser)
            browser.close()
        append_images()
        generate_showcase_json()
    finally:
        # Cleanup.
        if os.path.exists(example_file_path):
            os.remove(example_file_path)
        os.killpg(os.getpgid(qd_server.pid), signal.SIGTERM)


if __name__ == '__main__':
    main()
