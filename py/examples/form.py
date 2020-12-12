# Form
# Use a form to collect data or show textual information.
# ---

from h2o_wave import main, app, Q, ui

# Forms embed different UI elements on a single card.
# You can choose from static or interactive UI elements.
# There are many more UI elements than the ones shown here. Check out the other examples for more information.

# In interactive elements, pay attention to the name of the element -
# this name will be later used to reference the action taken by the user in q.arg.X


@app('/demo')
async def serve(q: Q):
    q.page.add('static_form', ui.form_card(
        box='1 1 6 -1',
        items=[
            ui.text_xl(content='Form Card Example'),
            ui.text_l(content='Static Elements'),
            ui.separator(label='A separator'),
            ui.progress(label='Display progress'),
            ui.message_bar(type='success', text='Display messages'),
            ui.table(name='table', columns=[
                ui.table_column(name='col1', label='Column 1'),
                ui.table_column(name='col2', label='Column 2'),
            ], rows=[
                ui.table_row(name='row1', cells=['Text A', 'Text B']),
                ui.table_row(name='row2', cells=['Text C', 'Text D']),
                ui.table_row(name='row3', cells=['Text E', 'Text F']),
            ]),
            ui.markup(content='''
                <ol>
                    <li>Spam</li>
                    <li>Ham</li>
                    <li>Eggs</li>
                </ol>
                '''),
            ui.frame(path='https://example.com')
        ],
    ))
    q.page.add('interactive_form', ui.form_card(
        box='7 1 -1 -1',
        items=[
            ui.text_xl(content='Form Card Example'),
            ui.text_l(content='Interactive Elements'),
            ui.separator(label='A separator'),
            ui.textbox(name='textbox', label='Request text input from the user'),
            ui.toggle(name='toggle', label='Toggle'),
            ui.checklist(name='checklist', label='Checklist', choices=[
                ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
            ]),
            ui.dropdown(name='dropdown', label='Select one or more:', values=[], choices=[
                ui.choice(name=x, label=x) for x in ['Egg', 'Bacon', 'Spam']
            ]),
            ui.range_slider(name='range_slider', label='Range slider', max=99),
            ui.date_picker(name='date_picker', label='Date picker'),
            ui.color_picker(name='color_picker', label='Color picker'),
            ui.buttons([
                ui.button(name='primary_button', label='Primary', primary=True),
                ui.button(name='standard_button', label='Standard'),
                ui.button(name='standard_disabled_button', label='Standard', disabled=True),
            ]),
        ]
    ))
    await q.page.save()
