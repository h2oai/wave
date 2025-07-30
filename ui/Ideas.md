Resolving the Issue of Table Collapsing State Reset on Data Update in Wave Apps

Background
In Wave apps, when the table data gets updated, the collapsed rows of the table may reset. 
To address this, we need to preserve the user's selection state of table collapsing even after data updates.

Solutions
There are two main methods to resolve this issue:

1.Using the state management of Wave apps.
2.Using frontend techniques like Redux or state lifting in React.

1. Using Wave App State Management
Steps:

a.Initialization: Initiate and maintain a collapsing state for the table in q.client/q.user/q.app.
b.Handle JavaScript Events: Use emit to emit JavaScript events to modify the collapse state.
c.Synchronize Table State: Upon backend data update, synchronize the current table state, ensuring that the user's frontend selection (collapsed or expanded) remains valid after the backend data update.
The following is an untested example, but the idea is the same：

@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Initialize group collapse states
        q.client.group_collapsed_states = {"Bob": True, "John": False}

        await update_table_data(q)
        q.page['meta'] = ui.meta_card(box='', script=ui.inline_script(content='''
        document.querySelectorAll('.ms-GroupHeader-expand').forEach(btn => {
          btn.addEventListener('click', e => {
            const groupName = e.currentTarget.parentElement.parentElement.querySelector('.ms-GroupHeader-title > span').innerText
            wave.emit('table', 'group_change', groupName)
          })
        })
        '''))
        q.client.initialized = True

    else:
        # Handle group change event
        if q.events.table and q.events.table.group_change:
            group_name = q.events.table.group_change
            q.client.group_collapsed_states[group_name] = not q.client.group_collapsed_states[group_name]

        # Update the table data
        await update_table_data(q)

    # Set the page to refresh after a delay
    await q.sleep(1)
    await q.page.save()


async def update_table_data(q: Q):
    # Retrieve real-time CPU and Memory data
    cpu_data = [
        str(psutil.cpu_percent(interval=1)),
        str(psutil.cpu_percent(interval=1))
    ]
    mem_data = [
        str(psutil.virtual_memory().percent),
        str(psutil.virtual_memory().percent),
        str(psutil.virtual_memory().percent)
    ]

    q.page['form'] = ui.form_card(box='1 1 -1 6', items=[
        ui.table(
            name='table',
            columns=[ui.table_column(name='text', label='Issues reported by')],
            groups=[
                ui.table_group("Bob", [
                    ui.table_row(name='row1', cells=[cpu_data[0]]),
                    ui.table_row(name='row2', cells=[cpu_data[1]])
                ], collapsed=q.client.group_collapsed_states["Bob"]),
                ui.table_group("John", [
                    ui.table_row(name='row3', cells=[mem_data[0]]),
                    ui.table_row(name='row4', cells=[mem_data[1]]),
                    ui.table_row(name='row5', cells=[mem_data[2]])
                ], collapsed=q.client.group_collapsed_states["John"])],
            height='500px'
        )
    ])


2. Using Frontend Techniques: Redux or React State Lifting
Steps:

a.State Lifting: Ensure the expandedRefs state is managed in a parent component (like the Form component) and pass it down to the XTable component.
b.Update XTable: The XTable component accepts expandedRefs and setExpandedRefs as props, replacing its internal state with them.
c.Listen to Data Updates: In the Form component, when new data is fetched from the backend, do not directly modify expandedRefs.
d.Update Collapsed State: Within XTable, use componentDidUpdate or the useEffect hook. When the data prop of XTable updates, verify if the new data still aligns with the current collapsed state. If not, modify expandedRefs.
e*.(optional)Optimize User Experience: Provide an option for users to choose whether to keep the current collapsing state upon data updates, giving more control to the users.
f*. "return expandedRef === undefined || expandedRef;" There seems to be a bug here, which may need to be fixed.
The following is an untested example, but the idea is the same：

// In Form
const [expandedRefs, setExpandedRefs] = useState({});
// Get new data
const fetchData = async () => {
    const newData = await getNewData();
    // update data, but do not change expandedRefs
    setData(newData);
}
// Pass expandedRefs to XTable
<XTable expandedRefs={expandedRefs} setExpandedRefs={setExpandedRefs} data={data} />

// In the XTable component
useEffect(() => {
    // Check and update expandedRefs
    const newExpandedRefs = { ...props.expandedRefs };
    data.forEach(item => {
        if (!newExpandedRefs[item.id]) {
            delete newExpandedRefs[item.id];
        }
    });
    props.setExpandedRefs(newExpandedRefs);
}, [data]);
