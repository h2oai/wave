# Table / Tags
# Use tags in order to emphasize a specific value. For multiple tags in a single row use `,` as a delimiter.
# ---
import random
from faker import Faker
from h2o_wave import main, app, Q, ui

fake = Faker()

_id = 0


class Issue:
    def __init__(self, text: str, progress: float):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.progress = progress


# Create some issues
issues = [Issue(text=fake.sentence(), progress=random.random()) for i in range(10)]

columns = [
    ui.table_column(name='text', label='Issue', min_width='400px'),
    ui.table_column(name='progress', label='Progress', cell_type=ui.progress_table_cell_type(compact=True)),
]


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 -1 -1', items=[
        ui.table(
            name='issues',
            columns=columns,
            rows=[ui.table_row(name=issue.id, cells=[issue.text, str(issue.progress)]) for issue in issues],
        )
    ])
    await q.page.save()
