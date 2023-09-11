# Wizard
# Create a multi-step #wizard using #form cards.
# ---
from h2o_wave import Q, ui, main, app


@app('/demo')
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
