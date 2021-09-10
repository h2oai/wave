# Table / Badge
# Use badges in order to emphasize a specific value. For multiple badges in a single row use `,` as a delimiter.
# ---
from faker import Faker
from h2o_wave import main, app, Q, ui

fake = Faker()

_id = 0


class Issue:
    def __init__(self, text: str, badge: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.badge = badge


# Create some issues
issues = [Issue(text=fake.sentence(), badge=('FAIL' if i % 2 == 0 else 'DONE,SUCCESS')) for i in range(10)]

columns = [
    ui.table_column(name='text', label='Issue', min_width='400px'),
    ui.table_column(name='badge', label='Badge', cell_type=ui.badge_table_cell_type(name='badges', badges=[
        ui.badge(name='FAIL', background_color='$red'),
        ui.badge(name='DONE', background_color='#D2E3F8', color='#053975'),
        ui.badge(name='SUCCESS', background_color='$mint'),
    ])),
]


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 -1 11', items=[
        ui.table(
            name='issues',
            columns=columns,
            rows=[ui.table_row(name=issue.id, cells=[issue.text, issue.badge]) for issue in issues],
        )
    ])
    await q.page.save()
