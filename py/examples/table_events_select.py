# Table / Events / Select
# Register the `select` #event to emit Wave event on each #table row selection.
# #table #events #select
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.events.table and q.events.table.select is not None:
        q.page['description'].content = f'{q.events.table.select}'
    else:
        q.page['table'] = ui.form_card(box='1 1 3 4', items=[
            ui.table(
                name='table',
                columns=[ui.table_column(name='text', label='Table select event')],
                rows=[
                    ui.table_row(name='row1', cells=['Row 1']),
                    ui.table_row(name='row2', cells=['Row 2']),
                    ui.table_row(name='row3', cells=['Row 3'])
                ],
                multiple=True,
                events=['select']
            )
        ])
        q.page['description'] = ui.markdown_card(box='4 1 3 4', title='Selected rows', content='Nothing selected yet.')
    await q.page.save()
