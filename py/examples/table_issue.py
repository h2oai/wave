# Table / Tags
# Use tags in order to emphasize a specific value. For multiple tags in a single row use `,` as a delimiter.
# ---
from faker import Faker
from h2o_wave import main, app, Q, ui

choices = [
    ui.choice('default', 'default'),
    ui.choice('monokai', 'monokia'),
    ui.choice('h2o-dark', 'h2o-dark'),
    ui.choice('one-dark-pro', 'one-dark-pro'),
    ui.choice('nord', 'nord'),
    ui.choice('winter-is-coming', 'winter-is-coming'),
    ui.choice('fuchasia', 'fuchasia'),
    ui.choice('nature', 'nature'),
    ui.choice('solarized', 'solarized'),
    ui.choice('oceanic', 'oceanic'),
    ui.choice('ember', 'ember'),
    ui.choice('lighting', 'lighting'),
    ui.choice('kiwi', 'kiwi'),
    ui.choice('benext', 'benext'),
]

_id = 0

class Issue:
    def __init__(self, text: str, tag: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.tag = tag

# Create some issues
issues = [Issue(text='Issue', tag=('FAIL' if i % 2 == 0 else 'DONE,SUCCESS')) for i in range(10)]

columns = [
    ui.table_column(name='text', label='Issue', min_width='400px'),
    ui.table_column(name='tag', label='Badge', min_width='200px', cell_type=ui.tag_table_cell_type(name='tags', tags=[
        ui.tag(label='FAIL', color='$red'),
        ui.tag(label='DONE', color='#D2E3F8', label_color='#053975'),
        ui.tag(label='SUCCESS', color='$mint'),
    ])),
]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['header1'] = ui.header_card(
            box='1 1 -1 1',
            title='Transparent header',
            subtitle='And now for something completely different!',
            image='https://wave.h2o.ai/img/h2o-logo.svg',
            items=[
                ui.button(name='btn1', label='Button 1'),
                ui.button(name='btn2', label='Button 2'),
                ui.button(name='btn3', label='Button 3'),
            ],
            secondary_items=[ui.textbox(name='search', icon='Search', width='300px', placeholder='Search...')],
            # color='transparent'
        )
        q.page['example'] = ui.form_card(box='1 3 -1 -1', items=[
            ui.button(name='toggle_theme', label='Toggle Theme', primary=True),
            ui.dropdown(name='theme', label='Choose theme', value='default', trigger=True, choices=choices),
            ui.table(
                name='issues',
                columns=columns,
                rows=[ui.table_row(name=issue.id, cells=[issue.text, issue.tag]) for issue in issues],
            ),
        ])
        q.page['example2'] = ui.wide_gauge_stat_card(
                box='1 2 2 1',
                title='Gauge',
                value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}',
                plot_color='$red',
                progress=0.63,
                data=dict(foo=1, bar=0.63),
            )
        q.client.initialized = True

    meta = q.page['meta']

    if q.args.toggle_theme:
        meta.theme = q.client.theme = 'default' if q.client.theme == 'h2o-dark' else 'h2o-dark'
    if q.args.theme:
        q.page['meta'].theme = q.args.theme

    await q.page.save()
