# Table / Preselection / Multiple
# Use a #table as an advanced multi-select. To allow multiple #selection,
# specify the pre-selected row names in 'values' or simply specify the `multiple=True`.
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
                    columns=[ui.table_column(name='text', label='Table multiple selection', min_width='300px')],
                    rows=[
                        ui.table_row(name='row1', cells=['Row 1']),
                        ui.table_row(name='row2', cells=['Row 2']),
                        ui.table_row(name='row3', cells=['Row 3']),
                        ui.table_row(name='row4', cells=['Row 4']),
                        ui.table_row(name='row5', cells=['Row 5'])
                    ],
                    values=['row2','row4'],
                ),
                ui.button(name='show_inputs', label='Submit', primary=True)
            ])
    await q.page.save()

