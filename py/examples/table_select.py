# Table / Preselection
# Use a table as an advanced multi-select. Specify rownames in 'values' for preselection.
# ---
from h2o_wave import main, app, Q, ui

issues = [
    ["The secret depth wishs into the cumbersome interest."],
    ["The honest charity can't paddle the today."],
    ["The colossal breakfast can't carve the internet."],
    ["The calculating dust treats into the skeletal session."],
    ["Did the thorny national really rescue the hunt?"],
    ["The dizzy tradition can't entertain the anywhere."],
    ["What if the alluring family ate the debate?"],
    ["Did the various gap really bounce the ticket?"],
    ["The shabby western can't tremble the teacher."],
    ["The modern bother suspends into the each vast."]
]


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
                rows=[ui.table_row(name=str(issues.index(issue)), cells=issue) for issue in issues],
                values=['I1', 'I2', 'I3']
            ),
            ui.button(name='show_inputs', label='Submit', primary=True)
        ])
    await q.page.save()
