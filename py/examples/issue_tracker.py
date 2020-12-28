# Issue Tracker
# Implement a simple issue tracker using a #table to create master-detail views.
# ---
from h2o_wave import main, app, Q, ui
from faker import Faker

fake = Faker()

_id = 0


class Issue:
    def __init__(self, text: str, status: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.status = status
        self.views = 0


# Create some issues
issues = [Issue(text=fake.sentence(), status='Open') for i in range(12)]

# Build a lookup of issues for convenience
issue_lookup = {issue.id: issue for issue in issues}

# Create columns for our issue table.
columns = [
    ui.table_column(name='text', label='Issue'),
    ui.table_column(name='status', label='Status'),
    ui.table_column(name='views', label='Views'),
]


def make_issue_table(allow_multiple_selection=False):
    return ui.table(
        name='issues',
        columns=columns,
        rows=[ui.table_row(name=issue.id, cells=[issue.text, issue.status, str(issue.views)]) for issue in issues],
        multiple=allow_multiple_selection
    )


async def edit_multiple(q: Q):
    q.page['form'] = ui.form_card(
        box='1 1 4 -1',
        items=[
            make_issue_table(allow_multiple_selection=True),  # This time, allow multiple selections
            ui.buttons([
                ui.button(name='reopen_issues', label='Reopen Selected', primary=True),
                ui.button(name='close_issues', label='Close Selected', primary=True),
                ui.button(name='back', label='Back to safety')
            ]),
        ]
    )
    await q.page.save()


async def show_issues(q: Q):
    q.page['form'] = ui.form_card(
        box='1 1 4 -1',
        items=[
            make_issue_table(),
            ui.buttons([ui.button(name='edit_multiple', label='Edit Multiple...', primary=True)]),
        ]
    )
    await q.page.save()


async def show_issue(q: Q, issue_id: str):
    issue = issue_lookup[issue_id]
    issue.views += 1

    q.client.active_issue_id = issue_id

    q.page['form'] = ui.form_card(
        box='1 1 4 -1',
        items=[
            ui.text_xl(f'Issue {issue.id}'),
            ui.text(issue.text),
            ui.text_xs(f'({issue.views} views)'),
            ui.buttons([
                ui.button(
                    name='close_issue' if issue.status == 'Open' else 'reopen_issue',
                    label="Close Issue" if issue.status == 'Open' else "Reopen Issue",
                    primary=True,
                ),
                ui.button(name='back', label='Back'),
            ]),
        ]
    )

    await q.page.save()


async def close_issue(q: Q):
    issue = issue_lookup[q.client.active_issue_id]
    issue.status = 'Closed'
    await show_issues(q)


async def close_issues(q: Q):
    for issue_id in q.args.issues:
        issue = issue_lookup[issue_id]
        issue.status = 'Closed'
    await show_issues(q)


async def reopen_issue(q: Q):
    issue = issue_lookup[q.client.active_issue_id]
    issue.status = 'Open'
    await show_issues(q)


async def reopen_issues(q: Q):
    for issue_id in q.args.issues:
        issue = issue_lookup[issue_id]
        issue.status = 'Open'
    await show_issues(q)


@app('/demo')
async def serve(q: Q):
    if q.args.edit_multiple:
        await edit_multiple(q)
    elif q.args.reopen_issues:
        await reopen_issues(q)
    elif q.args.close_issues:
        await close_issues(q)
    elif q.args.reopen_issue:
        await reopen_issue(q)
    elif q.args.close_issue:
        await close_issue(q)
    elif q.args.issues:  # An issue was clicked on
        await show_issue(q, q.args.issues[0])
    else:
        await show_issues(q)
