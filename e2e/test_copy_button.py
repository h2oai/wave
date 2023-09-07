import os
import signal
from utils import start_waved, AppRunner
import pytest

from playwright.sync_api import Page, expect


@pytest.fixture(scope='module', autouse=True)
def setup_teardown():
    waved_p = None
    expect.set_options(timeout=10_000)
    try:
        waved_p = start_waved()
        yield
    finally:
        if waved_p:
            os.killpg(os.getpgid(waved_p.pid), signal.SIGTERM)

def test_show_on_hover_copyable_text(page: Page):
    code = f'''
from h2o_wave import main, app, Q, ui

@app('/')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 3 5', items=[
        ui.copyable_text(label='Multiline Copyable text', value='Sample text.', multiline=True),
    ])
    await q.page.save()

'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        textfield = page.locator('text=Sample text.')
        button = page.locator('button')
        expect(button).to_be_hidden()
        textfield.hover()
        expect(button).to_be_visible()



def test_show_on_hover_markdown_code_block(page: Page):
    code = f'''
from h2o_wave import main, app, Q, ui

@app('/')
async def serve(q: Q):
    q.page['example'] = ui.markdown_card(
            box='1 1 3 5',
            title='I was made using markdown!',
            content=\'\'\'
```py
print('Hello World!')        
\'\'\'
    )
    await q.page.save()

'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        codeblock = page.get_by_role('code').first
        button = page.locator('button')
        expect(button).to_be_hidden()
        codeblock.hover()
        expect(button).to_be_visible()