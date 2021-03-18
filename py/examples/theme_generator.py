# Theme generator
# Use theme generator to quickly generate custom color schemes for your app.
# #theme_generator
# ---
from h2o_wave import main, app, Q, ui

from pygments import highlight
from pygments.formatters.html import HtmlFormatter
from pygments.lexers import get_lexer_by_name
from pygments.style import Style
from pygments.token import Name, String, Operator, Punctuation

py_lexer = get_lexer_by_name('python')


def get_theme_code(text: str, card: str, page: str, primary: str):
    contents = f'''
ui.theme(
    name='<theme-name>',
    colors=ui.colors(
        text='{text}',
        card='{card}',
        page='{page}',
        primary='{primary}'
    )
)'''

    # Reference: http://svn.python.org/projects/external/Pygments-0.10/docs/build/styles.html
    class CustomStyle(Style):
        styles = {
            Name: text,
            Operator: text,
            Punctuation: text,
            String: primary
        }

    html_formatter = HtmlFormatter(full=True, style=CustomStyle, nobackground=True)
    return highlight(contents, py_lexer, html_formatter)


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.primary = '#000'
        q.client.page = '#e2e2e2'
        q.client.card = '#fff'
        q.client.text = '#000'
        q.page['meta'] = ui.meta_card(box='', theme='custom', layouts=[
            ui.layout(
                breakpoint='xs',
                zones=[
                    ui.zone('header'),
                    ui.zone('content', direction=ui.ZoneDirection.ROW, zones=[
                        ui.zone('colors', size='300px'),
                        ui.zone('preview')
                    ]),
                    ui.zone('footer')
                ]
            )
        ])
        q.page['header'] = ui.header_card(box='header', title='Theme generator', subtitle='Color your app easily',
                                          icon='Color', icon_color='$card')
        q.page['form'] = ui.form_card(box='colors', items=[
            ui.color_picker(name='primary', label='Primary', trigger=True, alpha=False, inline=True,
                            value=q.client.primary),
            ui.color_picker(name='text', label='Text', trigger=True, alpha=False, inline=True, value=q.client.text),
            ui.color_picker(name='card', label='Card', trigger=True, alpha=False, inline=True, value=q.client.card),
            ui.color_picker(name='page', label='Page', trigger=True, alpha=False, inline=True, value=q.client.page),
            ui.text_xl('Code to Copy'),
            ui.frame(content=get_theme_code(q.client.text, q.client.card, q.client.page, q.client.primary),
                     height='180px')
        ])
        q.page['sample'] = ui.form_card(box='preview', items=[
            ui.text_xl(content='Sample App to show off colors'),
            ui.progress(label='A progress bar'),
            ui.inline([
                ui.checkbox(name='checkbox1', label='A checkbox', value=True),
                ui.checkbox(name='checkbox1', label='Another checkbox'),
                ui.checkbox(name='checkbox1', label='Yet another checkbox'),
                ui.toggle(name='toggle', label='Toggle', value=True),
            ]),
            ui.inline([
                ui.date_picker(name='date_picker', label='Date picker'),
                ui.picker(name='picker', label='Picker', choices=[
                    ui.choice('choice1', label='Choice 1'),
                    ui.choice('choice2', label='Choice 2'),
                    ui.choice('choice3', label='Choice 3'),
                ]),
                ui.combobox(name='combobox', label='Combobox', choices=['Choice 1', 'Choice 2', 'Choice 3']),
            ]),
            ui.slider(name='slider', label='Slider', value=70),
            ui.link(label='Link'),
            ui.stepper(name='stepper', items=[
                ui.step(label='Step 1', icon='MailLowImportance'),
                ui.step(label='Step 2', icon='TaskManagerMirrored'),
                ui.step(label='Step 3', icon='Cafe'),
            ]),
            ui.table(
                name='table',
                columns=[
                    ui.table_column(name='name', label='Name'),
                    ui.table_column(name='surname', label='Surname', filterable=True),
                    ui.table_column(name='age', label='Age', sortable=True),
                    ui.table_column(name='progress', label='Progress',
                                    cell_type=ui.progress_table_cell_type(color='$themePrimary')),
                ],
                rows=[
                    ui.table_row(name='row1', cells=['John', 'Doe', '25', '0.90']),
                    ui.table_row(name='row2', cells=['Ann', 'Doe', '35', '0.75']),
                    ui.table_row(name='row3', cells=['Casey', 'Smith', '40', '0.33']),
                ],
                height='330px',
            ),
            ui.buttons([
                ui.button(name='primary_button', label='Primary', primary=True),
                ui.button(name='standard_button', label='Standard'),
                ui.button(name='standard_disabled_button', label='Standard', disabled=True),
            ]),
        ])
        q.page['footer'] = ui.footer_card(box='footer', caption='(c) 2021 H2O.ai. All rights reserved.')
        q.client.themes = [ui.theme(name='custom', colors=ui.colors(
            text=q.client.text,
            card=q.client.card,
            page=q.client.page,
            primary=q.client.primary
        ))]
        q.client.initialized = True

    if q.args.primary:
        q.client.themes[0].colors.primary = q.args.primary
        q.client.primary = q.args.primary
        # TODO: Remove after resolving https://github.com/h2oai/wave/issues/150.
        q.page['form'].items[0].color_picker.value = q.args.primary
    if q.args.text:
        q.client.themes[0].colors.text = q.args.text
        q.client.text = q.args.text
        # TODO: Remove after resolving https://github.com/h2oai/wave/issues/150.
        q.page['form'].items[1].color_picker.value = q.args.text
    if q.args.card:
        q.client.themes[0].colors.card = q.args.card
        q.client.card = q.args.card
        # TODO: Remove after resolving https://github.com/h2oai/wave/issues/150.
        q.page['form'].items[2].color_picker.value = q.args.card
    if q.args.page:
        q.client.themes[0].colors.page = q.args.page
        q.client.page = q.args.page
        # TODO: Remove after resolving https://github.com/h2oai/wave/issues/150.
        q.page['form'].items[3].color_picker.value = q.args.page

    q.page['meta'].themes = q.client.themes
    q.page['form'].items[5].frame.content = get_theme_code(q.client.text, q.client.card, q.client.page,
                                                           q.client.primary)
    await q.page.save()
