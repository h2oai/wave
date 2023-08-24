import os
import signal
from utils import start_waved, AppRunner
import pytest

from playwright.sync_api import Page, expect


# Until https://github.com/microsoft/playwright-pytest/issues/69.
@pytest.fixture(scope='session', autouse=True)
def global_setup_teardown(playwright):
    playwright.selectors.set_test_id_attribute('data-test')
    expect.set_options(timeout=10_000)


@pytest.fixture(scope='module', autouse=True)
def setup_teardown():
    waved_p = None
    try:
        waved_p = start_waved()
        yield
    finally:
        if waved_p:
            os.killpg(os.getpgid(waved_p.pid), signal.SIGTERM)


def test_interactions(page: Page):
    code = '''
from h2o_wave import Q, ui, main, app


@app('/')
async def serve(q: Q):
    if not q.client.initialized:  # First visit, create an empty form card for our wizard
        q.page['wizard'] = ui.form_card(box='1 1 2 4', items=[])
        q.client.initialized = True

    wizard = q.page['wizard']  # Get a reference to the wizard form
    if q.args.step1:
        wizard.items = [
            ui.text_xl('Wizard - Step 1'),
            ui.text('What is your name?', name='text'),
            ui.textbox(name='nickname', label='My name is...', value='Gandalf'),
            ui.buttons([ui.button(name='step2', label='Next', primary=True)]),
        ]
    elif q.args.step2:
        q.client.nickname = q.args.nickname
        wizard.items = [
            ui.text_xl('Wizard - Step 2'),
            ui.text(f'Hi {q.args.nickname}! How do you feel right now?', name='text'),
            ui.textbox(name='feeling', label='I feel...', value='magical'),
            ui.buttons([ui.button(name='step3', label='Next', primary=True)]),
        ]
    elif q.args.step3:
        wizard.items = [
            ui.text_xl('Wizard - Done'),
            ui.text(
                f'What a coincidence, {q.client.nickname}! I feel {q.args.feeling} too!',
                name='text',
            ),
            ui.buttons([ui.button(name='step1', label='Try Again', primary=True)]),
        ]
    else:
        wizard.items = [
            ui.text_xl('Wizard Example'),
            ui.text("Let's have a conversation, shall we?"),
            ui.buttons([ui.button(name='step1', label='Of course!', primary=True)]),
        ]

    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        expect(page.get_by_text("Wizard Example")).to_be_visible()
        page.get_by_text('Of course!').click()
        expect(page.get_by_text('What is your name?')).to_be_visible()
        page.get_by_test_id('nickname').fill('Fred')
        page.locator('text=Next').click()
        expect(page.locator('text=Hi Fred! How do you feel right now?')).to_be_visible()
        page.get_by_test_id('feeling').fill('happy')
        page.locator('text=Next').click()
        expect(page.locator('text=What a coincidence, Fred! I feel happy too!')).to_be_visible()
