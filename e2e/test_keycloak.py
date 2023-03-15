import os
import subprocess

from playwright.sync_api import Page, expect


python_executable = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'venv', 'bin', 'python')


def test_login_flow(page: Page):
    cwd = os.path.join(os.path.dirname(__file__), '..', 'py', 'examples')
    p = subprocess.Popen([python_executable, 'hello_world.py'], cwd=cwd)
    p.communicate()
    assert p.returncode == 0

    page.goto("http://localhost:10101/demo")
    expect(page).to_have_url("http://localhost:10101/_auth/login?next=%2Fdemo")

    page.click("text=Log In")
    page.fill('input[name="username"]', 'admin')
    page.fill('input[name="password"]', 'admin')
    page.click('input[name="login"]')

    expect(page).to_have_url("http://localhost:10101/demo")
