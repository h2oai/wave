# Table / Events / Group
# Register the `group_change` #event to emit Wave event when group collapses or opens.
# #table #events #groups #background_tasks
# ---
import asyncio
import concurrent.futures
import time
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
issue_cnt = 5

collapsed_states = {
    'Bob': True,
    'John': False
}
stop = False
new_issues_label = 'Add Issues'

def add_issues_function(q: Q, loop: asyncio.AbstractEventLoop):
    global stop
    stop = False
    future = None
    while not stop:
        time.sleep(2)
        if not future or future.done():
            future = asyncio.ensure_future(update_issues(q), loop=loop)

async def update_issues(q: Q):
    global issue_cnt
    issue_cnt += 1
    if (issue_cnt % 2) == 0:
        bobrows.append({"name":"row"+str(issue_cnt), "cell":"Issue"+str(issue_cnt)})
    else:
        johnrows.append({"name":"row"+str(issue_cnt), "cell":"Issue"+str(issue_cnt)})   
    update_table_groups(q)
    await q.page.save()       


@app('/demo')
async def serve(q: Q):
    global issue_cnt, new_issues_label, stop
    if q.events.issues_table and q.events.issues_table.group_change:
        # toggle the collapse states
        for group in q.events.issues_table.group_change:
             collapsed_states[group] = not collapsed_states[group]
        q.page['collapse'].content = f'{q.events.issues_table.group_change}'
    elif q.args.add_issues: 
        if new_issues_label == 'Add Issues':
            new_issues_label = 'Stop Adding'
            q.page['add_issues'].add_issues.label = new_issues_label           
            loop = asyncio.get_event_loop()  
            with concurrent.futures.ThreadPoolExecutor() as pool:
                await q.exec(pool, add_issues_function, q, loop)
        else:
            stop = True
            new_issues_label = 'Add Issues'
            q.page['add_issues'].add_issues.label = new_issues_label
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
        q.page['add_issues'] = ui.form_card(box='5 1 2 1', items=[ui.button(name='add_issues', label=new_issues_label)])
        q.page['collapse'] = ui.markdown_card(box='5 2 2 1', title='Group change info', content='')

        q.client.initialized = True

    await q.page.save()

def update_table_groups(q: Q):
        q.page['form'].issues_table.groups=[
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
                    ),
        ]
