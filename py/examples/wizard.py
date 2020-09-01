# Wizard
# Create a multi-step wizard using form cards.
# ---
import sys
from h2o_q import Q, ui, listen, test, run_tests


async def main(q: Q):
    if not q.client.initialized:  # First visit, create an empty form card for our wizard
        q.page['wizard'] = ui.form_card(box='1 1 2 4', items=[])
        q.client.initialized = True

    wizard = q.page['wizard']  # Get a reference to the wizard form
    if q.args.step1:
        wizard.items = [
            ui.text_xl('Wizard - Step 1'),
            ui.text("What is your name?"),
            ui.textbox(name='nickname', label='My name is...', value='Gandalf'),
            ui.buttons([ui.button(name='step2', label='Next', primary=True)]),
        ]
    elif q.args.step2:
        q.client.nickname = q.args.nickname
        wizard.items = [
            ui.text_xl('Wizard - Step 2'),
            ui.text(f"Hi {q.args.nickname}! How do you feel right now?"),
            ui.textbox(name='feeling', label='I feel...', value='magical'),
            ui.buttons([ui.button(name='step3', label='Next', primary=True)]),
        ]
    elif q.args.step3:
        wizard.items = [
            ui.text_xl('Wizard - Done'),
            ui.text(f"What a coincidence, {q.client.nickname}! I feel {q.args.feeling} too!"),
            ui.buttons([ui.button(name='step1', label='Try Again', primary=True)]),
        ]
    else:
        wizard.items = [
            ui.text_xl('Wizard Example'),
            ui.text("Let's have a conversation, shall we?"),
            ui.buttons([ui.button(name='step1', label='Of course!', primary=True)]),
        ]

    await q.page.save()


@test
def test_wizard(t):
    t.visit('/demo')
    t.locate('step1').click()
    t.locate('text').should('have.text', 'What is your name?')
    t.locate('nickname').type('Fred')
    t.locate('step2').click()
    t.locate('text').should('have.text', 'Hi Fred! How do you feel right now?')
    t.locate('feeling').type('quirky')
    t.locate('step3').click()
    t.locate('text').should('have.text', 'What a coincidence, Fred! I feel quirky too!')


if len(sys.argv) > 1 and sys.argv[1] == 'test':
    run_tests()
else:
    listen('/demo', main)
