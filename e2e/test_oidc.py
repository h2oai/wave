import os
import signal
import subprocess
import time
from utils import AppRunner

import pytest
import requests
from playwright.sync_api import Page, expect
from requests.adapters import HTTPAdapter, Retry

from utils import start_waved

cwd = os.path.join(os.path.dirname(__file__))
python_executable = os.path.join(cwd, 'venv', 'bin', 'python')


# Until https://github.com/microsoft/playwright-pytest/issues/69.
@pytest.fixture(scope='session', autouse=True)
def global_setup_teardown(playwright):
    playwright.selectors.set_test_id_attribute('data-test')
    expect.set_options(timeout=10_000)


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


def test_oidc_flow(page: Page):
    code = '''
from h2o_wave import Q, ui, main, app


@app('/')
async def serve(q: Q):
    q.page['example'] = ui.form_card(
        box='1 1 3 3',
        items=[
            ui.link(label='Logout', path='/_auth/logout'),
            ui.copyable_text(value=q.auth.access_token, label='Access Token', name='access_token'),
        ]
    )
    await q.page.save()
    await q.sleep(6)
    await q.auth.ensure_fresh_token()
    q.page['example'] = ui.form_card(
        box='1 1 3 3',
        items=[
            ui.link(label='Logout', path='/_auth/logout'),
            ui.copyable_text(value=q.auth.access_token, label='Access Token', name='access_token'),
        ]
    )
    await q.page.save()
    await q.sleep(6)
    q.auth.ensure_fresh_token_sync()
    q.page['example'] = ui.form_card(
        box='1 1 3 3',
        items=[
            ui.link(label='Logout', path='/_auth/logout'),
            ui.copyable_text(value=q.auth.access_token, label='Access Token', name='access_token'),
        ]
    )
    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        expect(page).to_have_url('http://localhost:10101/_auth/login?next=%2F')

        # Test login flow.
        page.click("text=Log In")
        page.fill('input[name="username"]', 'admin')
        page.fill('input[name="password"]', 'admin')
        page.click('input[name="login"]')
        expect(page).to_have_url("http://localhost:10101/")

        # Test token refresh.
        initial_access_token = page.get_by_test_id('access_token').input_value()
        time.sleep(8)
        new_access_token = page.get_by_test_id('access_token').input_value()
        assert initial_access_token != new_access_token
        initial_access_token = new_access_token
        # Test sync version as well.
        time.sleep(8)
        new_access_token = page.get_by_test_id('access_token').input_value()
        assert initial_access_token != new_access_token

        # Test logout flow.
        page.get_by_text('Logout').click()
        expect(page).to_have_url('http://localhost:10101/_auth/login?next=%2F')
