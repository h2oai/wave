# Table / Commands
# Allow group of commands with context menu for each row.
# #table #commands
# ---
from h2o_wave import main, app, Q, ui
from faker import Faker

fake = Faker()

_id = 0


class TableRow:
    def __init__(self):
        global _id
        _id += 1
        self.id = f'row_{_id}'
        self.name = f'{fake.first_name()} {fake.last_name()}'
        self.details = fake.sentence()


rows = [TableRow() for _ in range(50)]

commands = [
    ui.command(name='details', label='Details'),
    ui.command(name='delete', label='Delete'),
]


@app('/demo')
async def serve(q: Q):
    if q.args.delete:
        await delete_row(q)
    elif q.args.details:
        await show_details(q)
    else:
        await show_table(q)


async def delete_row(q):
    global rows
    rows = [TableRow() for row in rows if str(row.id) != q.args.delete]
    q.page['example'].items[0].table.rows = [ui.table_row(
        name=str(row.name), cells=[str(row.name)]) for row in rows]
    await show_table(q)


async def show_table(q):
    q.page['example'] = ui.form_card(box='1 1 4 -1', items=[
        ui.table(
            name='table',
            columns=[
                ui.table_column(name='name', label='Name'),
                ui.table_column(name='actions', label='Actions',
                                cell_type=ui.command_table_cell_type(name='commands', items=commands))],
            rows=[ui.table_row(name=str(row.id), cells=[str(row.name)]) for row in rows]
        )
    ])
    await q.page.save()


async def show_details(q):
    for row in rows:
        if str(row.id) == q.args.details:
            q.page['example'] = ui.form_card(box='1 1 4 4', items=[
                ui.text(name='details', content=row.details),
                ui.button(name='back', label='Back')
            ])
            await q.page.save()
