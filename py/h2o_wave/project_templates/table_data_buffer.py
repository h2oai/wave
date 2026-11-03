from h2o_wave import app, main, Q, ui, data


rows = [
    ['I1', 'Investigate report export', 'Open', '0.25'],
    ['I2', 'Add table pagination', 'Closed', '1.0'],
    ['I3', 'Test data buffers', 'Open', '0.75'],
]

# Fixed data buffer: the table receives records from server memory instead of
# a list of ui.table_row objects.
issue_buffer = data(
    fields='name text status progress',
    size=len(rows),
    rows=rows,
)


@app('/demo')
async def serve(q: Q):
    q.page['form'] = ui.form_card(
        box='1 1 -1 -1',
        items=[
            ui.text_xl('Table with a data buffer'),
            ui.table(
                name='issues',
                columns=[
                    ui.table_column(name='text', label='Issue', searchable=True),
                    ui.table_column(name='status', label='Status', filterable=True),
                    ui.table_column(
                        name='progress',
                        label='Progress',
                        cell_type=ui.progress_table_cell_type(),
                    ),
                ],
                rows=issue_buffer,
                downloadable=True,
                resettable=True,
            ),
        ],
    )
    await q.page.save()
