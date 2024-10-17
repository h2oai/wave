# Table / Events / Group
# Register the `group_change` #event to emit Wave event when group collapses or opens.
# #table #events #groups
# ---
from h2o_wave import main, app, Q, ui

bobrows = [
    {"name":"row1", "cell":"Issue1"},
    {"name":"row2", "cell":"Issue2"},
]
johnrows = [
    {"name":"row3", "cell":"Issue3"},
    {"name":"row4", "cell":"Issue4"},
    {"name":"row5", "cell":"Issue5"},
]

collapsed_states = {
    'Bob': True,
    'John': False
}

@app('/demo')
async def serve(q: Q):
    if q.events.issues_table and q.events.issues_table.group_change:
        # toggle the collapse states
        for group in q.events.issues_table.group_change:
             collapsed_states[group] = not collapsed_states[group]
        q.page['collapse'].content = f'{q.events.issues_table.group_change}'
    else: 
        q.page['form'] = ui.form_card(box='1 1 4 5', items=[
            ui.table(
                name='issues_table',
                columns=[ui.table_column(name='text', label='Issues assigned to')],
                groups=[
                    ui.table_group("Bob", 
                                rows=[ui.table_row(
                                        name=row["name"],
                                        cells=[row["cell"]])
                                    for row in bobrows],
                                    collapsed=collapsed_states["Bob"]                                
                    ),
                    ui.table_group("John", 
                                rows=[ui.table_row(
                                        name=row["name"],
                                        cells=[row["cell"]])
                                    for row in johnrows],
                                    collapsed=collapsed_states["John"]                                
                    ),],
                height='400px',
                events=['group_change']
            )
        ])
        q.page['collapse'] = ui.markdown_card(box='5 1 2 1', title='Group change info', content='')

        q.client.initialized = True

    await q.page.save()
