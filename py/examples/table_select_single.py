# Table / Preselection / Single
# Use a #table as an advanced single-select. To allow single #selection, 
# specify the name of the row you want to pre-select in 'value' attribute 
# or simply specify the `isSingle=True`.
# #table #selection
# ---
from h2o_wave import main, app, Q, ui

@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'selected={q.args.table}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 -1 5', items=[
                ui.table(
                    name='table',
                    columns=[ui.table_column(name='text', label='Table single selection', min_width='300px')],
                    rows=[
                        ui.table_row(name='row1', cells=['Row 1']),
                        ui.table_row(name='row2', cells=['Row 2']),
                        ui.table_row(name='row3', cells=['Row 3']),
                        ui.table_row(name='row4', cells=['Row 4']),
                        ui.table_row(name='row5', cells=['Row 5'])
                    ],
                    value='row2',
                ),
                ui.button(name='show_inputs', label='Submit', primary=True)
            ])
    await q.page.save()
