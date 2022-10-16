# Table / Column Alignment
# Allow table values to be aligned per column as left (default), right or center
# #table
# ---
from faker import Faker

from h2o_wave import main, app, Q, ui

fake = Faker()

_id = 0

# Create some names
class User:
    def __init__(self, first_name: str, last_name: str, username: str, company: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.company = company

users = [
    User(
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        username=fake.user_name(),
        company=fake.company()
    ) for i in range (100)
]

# Create columns for our issue table.
columns = [
    ui.table_column(name='first_name', label='First Name', align='center'),
    ui.table_column(name='last_name', label='Last Name', align='right'),
    ui.table_column(name='username', label='Username', align='left'),
    ui.table_column(name='company', label='Company'),
]


@app('/demo')
async def serve(q: Q):
    q.page['form'] = ui.form_card(box='1 1 -1 10', items=[
            ui.table(
                name='users',
                columns=columns,
                rows=[ui.table_row(
                    name=user.id,
                    cells=[user.first_name, user.last_name, user.username, user.company]
                ) for user in users],
                downloadable=True,
                resettable=True,
                height='800px'
            )
        ])

    await q.page.save()
