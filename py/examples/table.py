# Table
# Use a table to display tabular data.
# ---

from h2o_wave import main, app, Q, ui


# Create columns for our issue table.
# On a column level, you can add sort with sortable=True, filter with filterable=True and search with searchable true.
# Note that those parameters are added per column in the column definition.
columns = [
    ui.table_column(name='text', label='Issue', searchable=True),
    ui.table_column(name='status', label='Status', filterable=True, sortable=True),
    ui.table_column(name='notifications', label='Notifications'),
    ui.table_column(name='done', label='Done', cell_type=ui.icon_table_cell_type()),
    ui.table_column(name='progress', label='Progress', cell_type=ui.progress_table_cell_type(), sortable=True),
]


issues = [
    ['Issue 1', 'Closed', 'Off', 'BoxMultiplySolid', 0.1],
    ['Issue 2', 'Open', 'Off', 'BoxCheckmarkSolid', 0.2],
    ['Issue 3', 'Closed', 'On', 'BoxCheckmarkSolid', 0.15],
    ['Issue 4', 'Open', 'On', 'BoxMultiplySolid', 0.62],
    ['Issue 5', 'Closed', 'Off', 'BoxMultiplySolid', 0.87],
    ['Issue 6', 'Open', 'On', 'BoxCheckmarkSolid', 0.54],
    ['Issue 7', 'Closed', 'On', 'BoxMultiplySolid', 0.17],
    ['Issue 8', 'Open', 'Off', 'BoxCheckmarkSolid', 0.36],
    ['Issue 9', 'Closed', 'On', 'BoxCheckmarkSolid', 0.92],
    ['Issue 10', 'Open', 'On', 'BoxMultiplySolid', 0.46]
]

# Add the groupable, downloadable and resettable parameters to add the functionality to the table.
@app('/demo')
async def serve(q: Q):
    q.page['form'] = ui.form_card(box='1 1 -1 11', items=[
        ui.table(
            name='issues',
            columns=columns,
            rows=[ui.table_row(name=str(issues.index(issue)), cells=issue) for issue in issues],
            groupable=True,
            downloadable=True,
            resettable=True,
            height='800px'
        )
    ])
    await q.page.save()

