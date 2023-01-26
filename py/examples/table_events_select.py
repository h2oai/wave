# Table / Events / Select
# Register the `select` #event to emit Wave event on each #table row selection.
# #table #events #select
# ---
from h2o_wave import main, app, Q, ui

@app('/demo')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(
    box='',
    layouts=[
        ui.layout(breakpoint='xs', zones=[
            ui.zone('main', direction=ui.ZoneDirection.ROW, zones=[
                ui.zone('table', size='50%'),
                ui.zone('selected', size='50%')
            ])
        ])
    ])
    if q.args.table:
        q.page['description'].content = f'{q.args.table}'
    else:
        q.page['table'] = ui.form_card(box='table', items=[
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
        q.page['description'] = ui.markdown_card(box='selected', title='Selected rows', content='No rows are selected yet.')
    await q.page.save()