# Table / Preselection
# Use a table as an advanced multi-select. Specify rownames in 'values' for preselection.
# ---
from h2o_wave import  main, app, Q, ui


_id = 0


class Issue:
    def __init__(self, text: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text


issue_descriptions = [
    'Update release notes',
    'Generate software license',
    'Update product documentation',
    'Introduce new tutorials',
    'Rewrite the error handling guide',
    'Navigation links are not working',
    'Set up CICD pipeline',
    'Improve unit tests coverage',
    'Update dependencies',
    'Run the automated test suite',
    'Monitor server utilization',
    'Run deployment on a staging server',
]

# Create some issues
issues = [Issue(text=issue) for issue in issue_descriptions]

# Create columns for our issue table.
columns = [ui.table_column(name='text', label='Issue', min_width='300px')]


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.issues}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 -1 11', items=[
            ui.table(
                name='issues',
                columns=columns,
                rows=[ui.table_row(name=issue.id, cells=[issue.text]) for issue in issues],
                values=['I1', 'I2', 'I3']
            ),
            ui.button(name='show_inputs', label='Submit', primary=True)
        ])
    await q.page.save()
