# Table / Pagination / Groups
# Use a paginated #table to display large (100k+ rows) tabular data managed in custom groups.
# #form #table #pagination #groups
# ---

from h2o_wave import main, app, Q, ui

groups = [ui.table_group(f"Group-{i + 1}", [
    ui.table_row(name=f"row{i * 3 + 1}", cells=[f"Item-{i * 3 + 1}"]),
    ui.table_row(name=f"row{i * 3 + 2}", cells=[f"Item-{i * 3 + 2}"]),
    ui.table_row(name=f"row{i * 3 + 3}", cells=[f"Item-{i * 3 + 3}"]),
]) for i in range(100)]
groups_per_page = 10


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[ui.table_column(name='text', label='Text', link=False)],
                groups=groups[0:groups_per_page],
                pagination=ui.table_pagination(total_rows=len(groups), rows_per_page=groups_per_page),
                height='590px',
                events=['page_change']
            )
        ])
        q.client.initialized = True

    if q.events.table and q.events.table.page_change:
        offset = q.events.table.page_change.get('offset', 0)
        new_groups = groups[offset:offset + groups_per_page]
        q.page['form'].items[0].table.groups = new_groups

    await q.page.save()
