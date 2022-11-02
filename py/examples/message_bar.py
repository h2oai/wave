# Form / Message Bar
# Use message bars to indicate relevant status information.
# #form #message_bar
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 3 7',
    items=[
        ui.message_bar(type='blocked', text='This action is blocked.'),
        ui.message_bar(type='error', text='This is an error message'),
        ui.message_bar(type='warning', text='This is a warning message.'),
        ui.message_bar(type='info', text='This is an information message.'),
        ui.message_bar(type='success', text='This is a success message.'),
        ui.message_bar(type='danger', text='This is a danger message.'),
        ui.message_bar(type='success', text='This is a **MARKDOWN** _message_.'),
        ui.message_bar(type='success', text='This is an <b>HTML</b> <i>message</i>.'),
        ui.message_bar(type='info', text='With a button.', buttons=[ui.button(name='btn', label='Button')]),
        ui.message_bar(type='info', text='With a button as link.',
                       buttons=[ui.button(name='btn', label='Button', link=True)]),
        ui.message_bar(type='info', text='With multiline text that should hopefully span at least 2 rows',
                       buttons=[ui.button(name='btn', label='Button')]),
    ]
)
page.save()
