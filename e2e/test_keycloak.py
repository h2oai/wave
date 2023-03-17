import os
import signal
import subprocess
import time
import pytest

from playwright.sync_api import Page, expect
import requests
from requests.adapters import HTTPAdapter, Retry


cwd = os.path.join(os.path.dirname(__file__))
python_executable = os.path.join(cwd, 'venv', 'bin', 'python')


@pytest.fixture(scope='session', autouse=True)
def setup_teardown():
    kc_p = subprocess.Popen(['docker', 'build', '-t', 'keycloak', '-f', 'keycloak.dockerfile', '.'], cwd=cwd)
    kc_p.communicate()

    if kc_p.returncode != 0:
        raise Exception('Failed to build keycloak image')

    kc_p = subprocess.Popen(['docker', 'run', '--rm', '-p', '8080:8080', 'keycloak:latest'], cwd=cwd)

    # Wait for keycloak to start
    time.sleep(10)

    waved_p = None
    try:
        s = requests.Session()
        s.mount('http://', HTTPAdapter(max_retries=Retry(total=5, backoff_factor=2)))
        res = s.get('http://localhost:8080/realms/master/.well-known/openid-configuration')

        if res.status_code != 200 and res.status_code != 302:
            raise Exception('Failed to start keycloak')

        # Start waved
        waved_cwd = os.path.join(os.path.dirname(__file__), '..')
        args = ['go', 'run', 'cmd/wave/main.go', '-web-dir', './ui/build', '-public-dir', '/assets/@./assets']
        env = os.environ.copy()
        env['H2O_WAVE_OIDC_PROVIDER_URL'] = 'http://localhost:8080/realms/master'
        env['H2O_WAVE_OIDC_REDIRECT_URL'] = 'http://localhost:10101/_auth/callback'
        env['H2O_WAVE_OIDC_CLIENT_ID'] = 'wave'
        env['H2O_WAVE_OIDC_CLIENT_SECRET'] = 'YBuOaJYbHYkKrtuFglPcBjp9JlwfIaQy'

        waved_p = subprocess.Popen(args=args, cwd=waved_cwd, env=env)

        if waved_p.returncode is not None:
            raise Exception('Failed to start waved')

        res = s.get(f'http://localhost:10101/{os.environ.get("H2O_WAVE_BASE_URL", "/")}')
        if res.status_code != 200:
            raise Exception('Failed to start waved')

        yield
    finally:
        if waved_p:
            # TODO: Use psutil.
            os.kill(int(subprocess.check_output(['lsof', '-i' ':10101', '-t']).strip()), signal.SIGINT)
        if kc_p:
            kc_p.send_signal(signal.SIGINT)


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
