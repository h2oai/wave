import os
import signal
import subprocess
import time

import pytest
import requests
from playwright.sync_api import Page, expect
from requests.adapters import HTTPAdapter, Retry

from utils import start_waved

cwd = os.path.join(os.path.dirname(__file__))
python_executable = os.path.join(cwd, 'venv', 'bin', 'python')


@pytest.fixture(scope='module', autouse=True)
def setup_teardown():
    waved_p = None
    kc_p = None

    if not os.getenv('SKIP_KC', None):
        kc_p = subprocess.Popen(['docker', 'build', '-t', 'keycloak', '-f', 'keycloak.dockerfile', '.'], cwd=cwd)
        kc_p.communicate()

        if kc_p.returncode != 0:
            raise Exception('Failed to build keycloak image')

        kc_p = subprocess.Popen(['docker', 'run', '--rm', '-p', '8080:8080', 'keycloak:latest'], cwd=cwd)

        # Wait for keycloak to start
        time.sleep(int(os.getenv('KC_SLEEP', 15)))

    try:
        s = requests.Session()
        s.mount('http://', HTTPAdapter(max_retries=Retry(total=15, backoff_factor=2)))
        res = s.get('http://localhost:8080/realms/master/.well-known/openid-configuration')

        if res.status_code != 200 and res.status_code != 302:
            raise Exception('Failed to start keycloak')

        env = os.environ.copy()
        env['H2O_WAVE_OIDC_PROVIDER_URL'] = 'http://localhost:8080/realms/master'
        env['H2O_WAVE_OIDC_REDIRECT_URL'] = 'http://localhost:10101/_auth/callback'
        env['H2O_WAVE_OIDC_CLIENT_ID'] = 'wave'
        env['H2O_WAVE_OIDC_CLIENT_SECRET'] = 'YBuOaJYbHYkKrtuFglPcBjp9JlwfIaQy'

        waved_p = start_waved(env)
        yield
    finally:
        if kc_p:
            kc_p.send_signal(signal.SIGINT)
        if waved_p:
            os.killpg(os.getpgid(waved_p.pid), signal.SIGTERM)


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

# TODO: Add logout test.
