# Table / Groups
# Manage data in custom groups
# #table
# ---

from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    q.page['form'] = ui.form_card(box='1 1 -1 6', items=[
        ui.table(
            name='issues',
            columns=[ui.table_column(name='text', label='Issues reported by')],
            groups=[
                ui.table_group("Bob", [
                    ui.table_row(name='row1', cells=['Issue1']),
                    ui.table_row(name='row2', cells=['Issue2'])
                ]),
                ui.table_group("John", [
                    ui.table_row(name='row3', cells=['Issue3']),
                    ui.table_row(name='row4', cells=['Issue4']),
                    ui.table_row(name='row5', cells=['Issue5']),
                ], collapsed=False)],
            height='500px'
        )
    ])
    await q.page.save()
