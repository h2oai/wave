# Table / Group by
# Allow grouping a table by column values.
# #table
# ---
import random
from h2o_wave import main, app, Q, ui


# Create some issues
issues = [
    ui.table_row(name='row1', cells=['Row 1', 'C', 'Closed']),
    ui.table_row(name='row2', cells=['Row 2', 'D', 'Closed']),
    ui.table_row(name='row3', cells=['Row 3', 'A', 'Open']),
    ui.table_row(name='row4', cells=['Row 4', 'B', 'Closed']),
    ui.table_row(name='row5', cells=['Row 5', 'F', 'Open']),
    ui.table_row(name='row6', cells=['Row 6', 'E', 'Closed']),
]

# Create columns for our issue table.
columns = [
    ui.table_column(name='column1', label='Issue', sortable=True, searchable=True),
    ui.table_column(name='column2', label='Issue', sortable=True),
    ui.table_column(name='status', label='Status', filterable=True, searchable=True)
]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.app.rows = issues
        q.page['example'] = ui.form_card(box='1 1 6 10', items=[
            ui.table(
                name='issues',
                columns=columns,
                rows=q.app.rows,
                groupable=True,
                height='600px',
                multiple=True,
                resettable=True,
            ),
            ui.button(name='show_inputs', label='Remove selected', primary=True)  
        ])
        q.client.initialized = True
    elif q.args.show_inputs:
        q.app.rows = [row for row in q.app.rows if row.name not in q.args.issues]
        q.page['example'].issues.rows = q.app.rows


    await q.page.save()