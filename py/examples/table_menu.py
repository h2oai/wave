# Table / Menu
# Allow group of commands with context menu for each row.
# #table #commands #menu
# ---
from h2o_wave import main, app, Q, ui
from faker import Faker

fake = Faker()


class TableRow:
    _id = 0

    def __init__(self):
        TableRow._id += 1
        self.id = f'row_{TableRow._id}'
        self.name = f'{fake.first_name()} {fake.last_name()}'
        self.details = fake.sentence()


def show_table(q) -> None:
    q.page['example'] = ui.form_card(box='1 1 4 4', items=[
        ui.table(
            name='table',
            columns=[
                ui.table_column(name='name', label='Name'),
                ui.table_column(
                    name='actions', label='Actions',
                    cell_type=ui.menu_table_cell_type(name='commands', commands=[
                        ui.command(name='details', label='Details'),
                        ui.command(name='delete', label='Delete'),
                    ])
                )
            ],
            rows=[ui.table_row(name=r.id, cells=[r.name]) for r in q.client.rows]
        )
    ])


@app('/demo')
async def serve(q: Q):
    if not q.app.initialized:
        q.app.rows = [TableRow() for _ in range(3)]
        q.app.initialized = True
    if not q.client.initialized:
        q.client.rows = q.app.rows
        show_table(q)
        q.client.initialized = True

    if q.args.delete:
        q.client.rows = [row for row in q.client.rows if row.id != q.args.delete]
        q.page['example'].items[0].table.rows = [ui.table_row(name=r.id, cells=[r.name]) for r in q.client.rows]
    if q.args.details:
        for row in q.client.rows:
            if row.id == q.args.details:
                q.page['example'] = ui.form_card(box='1 1 4 4', items=[
                    ui.text(name='details', content=row.details),
                    ui.button(name='back', label='Back')
                ])
                break
    if q.args.back:
        show_table(q)

    await q.page.save()
