# Table / Tags
# Use tags in order to emphasize a specific value. For multiple tags in a single row use `,` as a delimiter.
# ---
from faker import Faker
from h2o_wave import main, app, Q, ui

fake = Faker()

_id = 0


class Issue:
    def __init__(self, text: str, tag: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.tag = tag


# Create some issues
issues = [Issue(text=fake.sentence(), tag=('FAIL' if i % 2 == 0 else 'DONE,SUCCESS')) for i in range(10)]

columns = [
    ui.table_column(name='text', label='Issue', min_width='400px'),
    ui.table_column(name='tag', label='Badge', cell_type=ui.tag_table_cell_type(name='tags', tags=[
        ui.tag(label='FAIL', color='$red'),
        ui.tag(label='DONE', color='#D2E3F8', label_color='#053975'),
        ui.tag(label='SUCCESS', color='$mint'),
    ])),
]


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 6 7', items=[
        ui.table(
            name='issues',
            columns=columns,
            rows=[ui.table_row(name=issue.id, cells=[issue.text, issue.tag]) for issue in issues],
        )
    ])
    await q.page.save()
