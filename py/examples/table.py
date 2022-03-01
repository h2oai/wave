# Table
# Use a #table to display tabular data.
# ---
import random

from faker import Faker

from h2o_wave import main, app, Q, ui

fake = Faker()

_id = 0


class Issue:
    def __init__(self, text: str, status: str, progress: float, icon: str, state: str, created: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.status = status
        self.views = 0
        self.progress = progress
        self.icon = icon
        self.created = created
        self.state = state


# Create some issues
issues = [
    Issue(
        text=str(i + 1),
        status=('Closed' if i % 2 == 0 else 'Open'),
        progress=random.random(),
        icon=('BoxCheckmarkSolid' if random.random() > 0.5 else 'BoxMultiplySolid'),
        state=('RUNNING' if random.random() > 0.5 else 'DONE,SUCCESS'),
        created=fake.iso8601()) for i in range(100)
]
rows = [ui.table_row(name=issue.id, cells=[issue.text, issue.status, issue.icon, str(issue.views), str(issue.progress),
                    issue.state, issue.created]) for issue in issues]

rows_per_page = 10

# Create columns for our issue table.
columns = [
    ui.table_column(name='text', label='Issue', sortable=True, searchable=True, max_width='300', cell_overflow='wrap'),
    ui.table_column(name='status', label='Status', filterable=True),
    ui.table_column(name='done', label='Done', cell_type=ui.icon_table_cell_type()),
    ui.table_column(name='views', label='Views', sortable=True, data_type='number'),
    ui.table_column(name='progress', label='Progress', cell_type=ui.progress_table_cell_type()),
    ui.table_column(name='tag', label='State', min_width='170px', cell_type=ui.tag_table_cell_type(name='tags', tags=[
                    ui.tag(label='RUNNING', color='#D2E3F8'),
                    ui.tag(label='DONE', color='$red'),
                    ui.tag(label='SUCCESS', color='$mint'),
                    ]
    )),
    ui.table_column(name='created', label='Created', sortable=True, data_type='time'),
]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 10', items=[
            ui.table(
                name='issues',
                columns=columns,
                rows=[],
                groupable=True,
                downloadable=True,
                resettable=True,
                height='800px',
                pagination=ui.table_pagination(total_rows=len(rows), rows_per_page=rows_per_page)
            )
        ])
        q.client.initialized = True

    if q.events.issues and q.events.issues.page_change is not None:
        rows_offset = q.events.issues.page_change['offset']
        q.page['form'].items[0].table.rows = rows[rows_offset:rows_offset + rows_per_page]

    q.page['nonexist'].items = []
    await q.page.save()
