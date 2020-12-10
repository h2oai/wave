# Table / Column Settings
# Add filter, sort and search options to your Table per column.
# On a column level, you can add sort with sortable=True, filter with filterable=True and search with searchable true.
# Note that those parameters are added per column in the column definition.
# ---

from h2o_wave import main, app, Q, ui


# Create columns for our issue table.
# For each column you can specify whether it is searchbale, filterable and/or sortable
columns = [
    ui.table_column(name='text', label='Issue', searchable=True),
    ui.table_column(name='status', label='Status', filterable=True, sortable=True),
    ui.table_column(name='notifications', label='Notifications'),
    ui.table_column(name='done', label='Done', cell_type=ui.icon_table_cell_type()),
    ui.table_column(name='progress', label='Progress', cell_type=ui.progress_table_cell_type(), sortable=True),
]


issues = [
    ['Industry chance also fish.', 'Closed', 'Off', 'BoxMultiplySolid', 0.05403974853326776],
    ['Doctor sound stay.', 'Open', 'Off', 'BoxCheckmarkSolid', 0.18650916598162226],
    ['Expert sea hour finally ever difference.', 'Closed', 'On', 'BoxCheckmarkSolid', 0.32065984702917405],
    ['Car include free hour laugh.', 'Open', 'On', 'BoxMultiplySolid', 0.6277587990397921],
    ['Country we painting space material rise.', 'Closed', 'Off', 'BoxMultiplySolid', 0.8776585192792797],
    ['Ground particular common son little nature.', 'Open', 'On', 'BoxCheckmarkSolid', 0.5425839415235011],
    ['Detail then owner action.', 'Closed', 'On', 'BoxMultiplySolid', 0.17064993845277554],
    ['Artist pressure our exactly.', 'Open', 'Off', 'BoxCheckmarkSolid', 0.36328099860853424],
    ['No heavy fact tax north already table result.', 'Closed', 'On', 'BoxCheckmarkSolid', 0.9208272052965547],
    ['Call avoid short.', 'Open', 'On', 'BoxMultiplySolid', 0.4661361082155442],
    ['Teacher house citizen.', 'Closed', 'On', 'BoxCheckmarkSolid', 0.6884864838753519],
    ['Money many toward son project person.', 'Open', 'On', 'BoxMultiplySolid', 0.5049239782344025],
]


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

