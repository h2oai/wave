# Theme generator
# Use theme generator to quickly generate custom color schemes for your app.
# #theme_generator
# ---
import math
from typing import Tuple

from h2o_wave import Q, app, data, main, ui


def to_grayscale(color: float) -> float:
    color /= 255
    return color / 12.92 if color <= 0.03928 else math.pow((color + 0.055) / 1.055, 2.4)


def get_luminance(r: float, g: float, b: float) -> float:
    return to_grayscale(r) * 0.2126 + to_grayscale(g) * 0.7152 + to_grayscale(b) * 0.0722


# Source: https://www.delftstack.com/howto/python/python-hex-to-rgb/.
def hex_to_rgb(hex_color: str) -> Tuple[int, ...]:
    if len(hex_color) == 3:
        hex_color = f'{hex_color[0]}{hex_color[0]}{hex_color[1]}{hex_color[1]}{hex_color[2]}{hex_color[2]}'
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))


# Source: https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors. # noqa
def update_contrast_check(color1: str, color2: str, q: Q, min_contrast=4.5):
    rgb1 = hex_to_rgb(q.client[color1].lstrip('#'))
    rgb2 = hex_to_rgb(q.client[color2].lstrip('#'))
    lum1 = get_luminance(rgb1[0], rgb1[1], rgb1[2])
    lum2 = get_luminance(rgb2[0], rgb2[1], rgb2[2])
    brightest = max(lum1, lum2)
    darkest = min(lum1, lum2)
    contrast = (brightest + 0.05) / (darkest + 0.05)
    message_bar_names = ['text_card', 'card_primary', 'text_page', 'page_primary']
    # TODO: Use by-name component access to index side panel items.
    message_bar_mobile = q.page['meta'].side_panel.items[5 + message_bar_names.index(f'{color1}_{color2}')].message_bar
    message_bar = q.page['form'][f'{color1}_{color2}']
    if contrast < min_contrast:
        message_bar.type = message_bar_mobile.type = 'error'
        message_bar.text = message_bar_mobile.text = f'Improve contrast between **{color1}** and **{color2}**.'
    else:
        message_bar.type = message_bar_mobile.type = 'success'
        message_bar.text = message_bar_mobile.text = f'Contrast between **{color1}** and **{color2}** is great!'


def get_theme_code(q: Q):
    return f'''
```py
ui.theme(
    name='<theme-name>',
    primary='{q.client.primary}',
    text='{q.client.text}',
    card='{q.client.card}',
    page='{q.client.page}',
)
```
'''


image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
mobile_items = [
    ui.text_xl(content='Sample App to show colors'),
    ui.text('Click the top right button to change the theme. 👆'),
    ui.inline(justify='between', items=[
        ui.persona(title='John Doe', subtitle='Data Scientist', size='s', image=image),
        ui.toggle(name='toggle', label='Toggle', value=True),
    ]),
    ui.inline([
        ui.stepper(name='stepper', width='500px', items=[
            ui.step(label='Step 1', icon='MailLowImportance'),
            ui.step(label='Step 2', icon='TaskManagerMirrored'),
            ui.step(label='Step 3', icon='Cafe'),
        ]),
    ]),
    ui.progress(label='A progress bar'),
    ui.inline(justify='between', items=[
        ui.tabs(name='menu', value='email', items=[
            ui.tab(name='email', label='Mail', icon='Mail'),
            ui.tab(name='events', label='Events', icon='Calendar'),
            ui.tab(name='spam', label='Spam'),
        ]),
        ui.link(label='Link'),
    ]),
    ui.slider(name='slider', label='Slider', value=70),
    ui.date_picker(name='date_picker', label='Date picker'),
    ui.picker(name='picker', label='Picker', choices=[
        ui.choice('choice1', label='Choice 1'),
        ui.choice('choice2', label='Choice 2'),
        ui.choice('choice3', label='Choice 3'),
    ]),
    ui.combobox(name='combobox', label='Combobox', choices=['Choice 1', 'Choice 2', 'Choice 3']),
    ui.checkbox(name='checkbox1', label='Checkbox 1', value=True),
    ui.checkbox(name='checkbox2', label='Checkbox 2'),
    ui.checkbox(name='checkbox3', label='Checkbox 3'),
    ui.inline(direction='column', items=[
        ui.table(
            name='table',
            width='100%',
            columns=[
                ui.table_column(name='name', label='Name', min_width='80px'),
                ui.table_column(name='surname', label='Surname', filterable=True, max_width='90px'),
                ui.table_column(name='progress', label='Progress', max_width='80px',
                                cell_type=ui.progress_table_cell_type(color='$themePrimary')),
            ],
            rows=[
                ui.table_row(name='row1', cells=['John', 'Doe', '0.90']),
                ui.table_row(name='row2', cells=['Ann', 'Doe', '0.75']),
            ],
        ),
        ui.visualization(
            width='100%',
            data=data('profession salary', 5, rows=[
                ('medicine', 23000),
                ('fire fighting', 18000),
                ('pedagogy', 24000),
                ('psychology', 22500),
                ('computer science', 36000),
            ], pack=True),
            plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)])
        ),
    ]),
    ui.buttons([
        ui.button(name='primary_button', label='Primary', primary=True),
        ui.button(name='standard_button', label='Standard'),
        ui.button(name='standard_disabled_button', label='Disabled', disabled=True),
        ui.button(name='icon_button', icon='Heart', caption='Tooltip text'),
    ]),
]
desktop_items = [
    ui.text_xl(content='Sample App to show colors'),
    ui.progress(label='A progress bar'),
    ui.inline([
        ui.checkbox(name='checkbox1', label='Checkbox 1', value=True),
        ui.checkbox(name='checkbox2', label='Checkbox 2'),
        ui.checkbox(name='checkbox3', label='Checkbox 3'),
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
        ui.persona(title='John Doe', subtitle='Data Scientist', size='s', image=image),
    ]),
    ui.slider(name='slider', label='Slider', value=70),
    ui.link(label='Link'),
    ui.inline(justify='between', items=[
        ui.stepper(name='stepper', width='500px', items=[
            ui.step(label='Step 1', icon='MailLowImportance'),
            ui.step(label='Step 2', icon='TaskManagerMirrored'),
            ui.step(label='Step 3', icon='Cafe'),
        ]),
        ui.tabs(name='menu', value='email', items=[
            ui.tab(name='email', label='Mail', icon='Mail'),
            ui.tab(name='events', label='Events', icon='Calendar'),
            ui.tab(name='spam', label='Spam'),
        ]),
    ]),
    ui.inline(items=[
        ui.table(
            name='table',
            width='50%',
            columns=[
                ui.table_column(name='name', label='Name', min_width='80px'),
                ui.table_column(name='surname', label='Surname', filterable=True),
                ui.table_column(name='age', label='Age', sortable=True, max_width='80px'),
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
        ui.visualization(
            width='50%',
            data=data('profession salary', 5, rows=[
                ('medicine', 23000),
                ('fire fighting', 18000),
                ('pedagogy', 24000),
                ('psychology', 22500),
                ('computer science', 36000),
            ], pack=True),
            plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)])
        ),
    ]),
    ui.buttons([
        ui.button(name='primary_button', label='Primary', primary=True),
        ui.button(name='standard_button', label='Standard'),
        ui.button(name='standard_disabled_button', label='Disabled', disabled=True),
        ui.button(name='icon_button', icon='Heart', caption='Tooltip text'),
    ]),
]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.primary = '#000000'
        q.client.page = '#e2e2e2'
        q.client.card = '#ffffff'
        q.client.text = '#000000'
        q.page['meta'] = ui.meta_card(box='', theme='custom', layouts=[
            ui.layout(
                breakpoint='xs',
                zones=[
                    ui.zone('mobile_content'),
                    ui.zone('footer')
                ]
            ),
            ui.layout(
                breakpoint='817px',
                zones=[
                    ui.zone('header'),
                    ui.zone('content', direction=ui.ZoneDirection.ROW, zones=[
                        ui.zone('colors', size='30%'),
                        ui.zone('preview', size='70%')
                    ]),
                    ui.zone('footer')
                ]
            ),
        ])
        q.page['header'] = ui.header_card(box='header', title='Theme generator', subtitle='Color your app easily',
                                          icon='Color', icon_color='$card')
        q.page['mobile_header'] = ui.header_card(
            box='mobile_content',
            icon='Color',
            title='Theme generator',
            subtitle='Color your app easily',
            items=[ui.button(name='show_side_panel', label=' ', icon='Color')]
        )
        q.client.color_items = [
            ui.color_picker(name='primary', label='Primary', trigger=True, alpha=False, inline=True,
                            value=q.client.primary),
            ui.color_picker(name='text', label='Text', trigger=True, alpha=False, inline=True, value=q.client.text),
            ui.color_picker(name='card', label='Card', trigger=True, alpha=False, inline=True, value=q.client.card),
            ui.color_picker(name='page', label='Page', trigger=True, alpha=False, inline=True, value=q.client.page),
            ui.text_xl('Check contrast'),
            ui.message_bar(name='text_card', type='success', text='Contrast between **text** and **card** is great!'),
            ui.message_bar(name='card_primary', type='success',
                           text='Contrast between **card** and **primary** is great!'),
            ui.message_bar(name='text_page', type='success', text='Contrast between **text** and **page** is great!'),
            ui.message_bar(name='page_primary', type='success',
                           text='Contrast between **page** and **primary** is great!'),
            ui.text_xl('Copy code'),
            ui.text(name='code', content=get_theme_code(q)),
        ]
        q.page['form'] = ui.form_card(box='colors', items=q.client.color_items)
        q.page['sample'] = ui.form_card(box='preview', items=desktop_items)
        q.page['sample_mobile'] = ui.form_card(box='mobile_content', items=mobile_items)
        q.page['footer'] = ui.footer_card(box='footer', caption='Made with 💛 by H2O Wave Team.')
        q.client.themes = [ui.theme(name='custom', text=q.client.text, card=q.client.card,
                                    page=q.client.page, primary=q.client.primary)]
        q.client.initialized = True

    if q.args.show_side_panel:
        q.page['meta'].side_panel = ui.side_panel(
            title='Adjust theme colors',
            items=q.client.color_items,
            closable=True,
            width='min(75%, 420px)'
        )
    if q.args.primary:
        q.client.themes[0].primary = q.args.primary
        q.client.primary = q.args.primary
    if q.args.text:
        q.client.themes[0].text = q.args.text
        q.client.text = q.args.text
    if q.args.card:
        q.client.themes[0].card = q.args.card
        q.client.card = q.args.card
    if q.args.page:
        q.client.themes[0].page = q.args.page
        q.client.page = q.args.page

    q.page['meta'].themes = q.client.themes
    update_contrast_check('text', 'card', q)
    update_contrast_check('card', 'primary', q)
    update_contrast_check('text', 'page', q)
    update_contrast_check('page', 'primary', q)
    q.page['form'].code.content = get_theme_code(q)
    await q.page.save()
