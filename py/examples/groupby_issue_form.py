# Table / Group by
# Allow grouping a table by column values.
# #table
# ---
import random
from faker import Faker
from h2o_wave import main, app, Q, ui

fake = Faker()

_id = 0


class Issue:
    def __init__(self, text: str, status: str, progress: float, icon: str, notifications: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.status = status
        self.views = 0
        self.progress = progress
        self.icon = icon
        self.notifications = notifications


# Create some issues
issues = [
    Issue(
        text=fake.sentence(),
        status=('Closed' if i % 2 == 0 else 'Open'),
        progress=random.random(),
        icon=('BoxCheckmarkSolid' if random.random() > 0.5 else 'BoxMultiplySolid'),
        notifications=('Off' if random.random() > 0.5 else 'On')) for i in range(10)
]

# Create columns for our issue table.
columns = [
    ui.table_column(name='text', label='Issue', sortable=True),
    ui.table_column(name='status', label='Status', sortable=True),
    ui.table_column(name='notifications', label='Notifications'),
    ui.table_column(name='done', label='Done', cell_type=ui.icon_table_cell_type()),
    ui.table_column(name='views', label='Views'),
    ui.table_column(name='progress', label='Progress', cell_type=ui.progress_table_cell_type()),
]

rows = [ui.table_row(
            name=issue.id,
            cells=[issue.text, issue.status, issue.notifications, issue.icon, str(issue.views),
                str(issue.progress)]) for issue in issues]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.app.rows = rows
        q.page['example'] = ui.form_card(box='1 1 8 10', items=[
            ui.table(
                name='issues',
                columns=columns,
                rows=q.app.rows,
                groupable=True,
                height='600px',
                multiple=True,
            ),
            ui.button(name='show_inputs', label='Remove selected', primary=True)  
        ])
        q.client.initialized = True
    elif q.args.show_inputs:
        q.app.rows = [row for row in q.app.rows if row.name not in q.args.issues]
        # q.page['example'].items[0].table.rows = q.app.rows
        q.page['example'] = ui.form_card(box='1 1 8 10', items=[
            ui.table(
                name='issues',
                columns=columns,
                rows=q.app.rows,
                groupable=True,
                height='600px',
                multiple=True,
            ),
            ui.button(name='show_inputs', label='Remove selected', primary=True)  
        ])

    await q.page.save()