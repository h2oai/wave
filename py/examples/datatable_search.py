# Datatable / Search
# Use a datatable's search feature to search for a specify column value.
# ---
from h2o_q import Q, listen, ui
from faker import Faker

fake = Faker()

_id = 0


class Issue:
    def __init__(self, text: str, status: str, progress: int, done: bool, sth: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.status = status
        self.views = 0
        self.progress = progress
        self.done = done
        self.sth = sth


# Create some issues
issues = [Issue(
    text=fake.sentence(),
    status=('Closed' if i % 2 == 0 else 'Open'),
    progress=0.5,
    done=('BoxCheckmarkSolid' if i % 2 == 0 else 'BoxMultiplySolid'),
    sth=('Off' if i % 2 == 0 else 'On')) for i in range(100)]

# Build a lookup of issues for convenience
issue_lookup = {issue.id: issue for issue in issues}

# Create columns for our issue table.
columns = [
    ui.table_column(name='text', label='Issue', searchable=True),
    ui.table_column(name='status', label='Status'),
    ui.table_column(name='sth', label='Something'),
    ui.table_column(name='done', label='Done', cell_type=ui.icon_table_cell_type()),
    ui.table_column(name='views', label='Views'),
    ui.table_column(name='progress', label='Progress', cell_type=ui.progress_table_cell_type()),
]


async def main(q: Q):
    q.page['form'] = ui.form_card(box='1 1 -1 11', items=[
        ui.table(
            name='issues',
            columns=columns,
            rows=[ui.table_row(
              name=issue.id,
              cells=[
                issue.text, issue.status, issue.sth, issue.done, str(issue.views), issue.progress]) for issue in issues
              ],
        )
      ]
    )
    await q.page.save()


listen('/demo', main)
