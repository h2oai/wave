import os
import signal
import time
from utils import start_waved, AppRunner
import pytest

from playwright.sync_api import Page, expect


@pytest.fixture(scope='module', autouse=True)
def setup_teardown():
    waved_p = None
    try:
        waved_p = start_waved()
        yield
    finally:
        if waved_p:
            os.killpg(os.getpgid(waved_p.pid), signal.SIGTERM)


def test_by_name_updates(page: Page):
    code = '''
from h2o_wave import Q, ui, main, app


@app('/')
async def serve(q: Q):
    q.page['wizard'] = ui.form_card(box='1 1 2 4', items=[
        ui.text_xl(name='text_name', content='Wizard'),
        ui.inline(items=[
            ui.button(name='back', label='Back'),
        ]),
    ])
    q.page['wizard'].text_name.content = 'foo1'
    q.page['wizard'].back.label = 'foo2'

    q.page['header'] = ui.header_card(box='4 6 4 1', title='Header', subtitle='Subtitle', secondary_items=[
        ui.button(name='button_name', label='Button'),
    ])
    q.page['header'].button_name.label = 'foo3'

    q.page['example'] = ui.form_card(box='5 1 4 5', items=[
        ui.buttons([
            ui.button(name='primary_button', label='Primary', primary=True),
        ]),
    ])
    q.page['example'].primary_button.label = 'foo4'

    q.page['nav'] = ui.tab_card(
        box='1 6 4 1',
        items=[
            ui.tab(name='#hash', label='Spam'),
            ui.tab(name='plaintext', label='Ham'),
        ],
    )
    q.page['nav']['#hash'].label = 'foo5'
    q.page['nav'].plaintext.label = 'foo6'

    await q.page.save()

'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        expect(page.get_by_text("foo1")).to_be_visible()
        expect(page.get_by_text("foo2")).to_be_visible()
        expect(page.get_by_text("foo3")).to_be_visible()
        expect(page.get_by_text("foo4")).to_be_visible()
        expect(page.get_by_text("foo5")).to_be_visible()
        expect(page.get_by_text("foo6")).to_be_visible()


def test_by_name_updates_dialog_init(page: Page):
    code = '''
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='', dialog=ui.dialog(title='Order Donuts', items=[
        ui.button(name='next_step', label='Next')
    ]))
    q.page['meta'].next_step.label = 'New next'

    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        # Wait for page to load
        time.sleep(1)
        print(page.content())
        expect(page.get_by_text("New next")).to_be_visible()


def test_by_name_updates_dialog(page: Page):
    code = '''
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='')
    q.page['meta'].dialog = ui.dialog(title='Order Donuts', items=[
        ui.button(name='next_step', label='Next')
    ])
    q.page['meta'].next_step.label = 'New next'

    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        # Wait for page to load
        time.sleep(1)
        expect(page.get_by_text("New next")).to_be_visible()


def test_by_name_updates_side_panel_init(page: Page):
    code = '''
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='', side_panel=ui.side_panel(title='Order Donuts', items=[
        ui.button(name='next_step', label='Next')
    ]))
    q.page['meta'].next_step.label = 'New next'

    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        expect(page.get_by_text("New next")).to_be_visible()


def test_by_name_updates_side_panel(page: Page):
    code = '''
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='')
    q.page['meta'].side_panel = ui.side_panel(title='Order Donuts', items=[
        ui.button(name='next_step', label='Next')
    ])
    q.page['meta'].next_step.label = 'New next'

    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        expect(page.get_by_text("New next")).to_be_visible()


def test_by_name_updates_notification_bar_init(page: Page):
    code = '''
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='', notification_bar=ui.notification_bar(
        text='Success notification',
        buttons=[ui.button(name='btn1', label='Button 1')]
    ))
    q.page['meta'].btn1.label = 'New text'

    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        expect(page.get_by_text("New text")).to_be_visible()


def test_by_name_updates_notification_bar(page: Page):
    code = '''
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='')
    q.page['meta'].notification_bar = ui.notification_bar(
        text='Success notification',
        buttons=[ui.button(name='btn1', label='Button 1')]
    )
    q.page['meta'].btn1.label = 'New text'

    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        expect(page.get_by_text("New text")).to_be_visible()


def test_by_name_updates_card_commands(page: Page):
    code = '''
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['form'] = ui.form_card(
        box='1 1 3 3',
        items=[],
        commands=[
            ui.command(name='step1', label='Step 1'),
        ]
    )
    q.page['form'].step1.label = 'New text'
    await q.page.save()
'''
    with AppRunner(code):
        page.goto('http://localhost:10101')
        page.click('[data-test="form"]:nth-child(2) > div')
        expect(page.get_by_text("New text")).to_be_visible()
