# Table / Pagination / Minimal
# Use a #table with pagination to display large (100k+ rows) tabular data.
# #form #table #pagination
# ---

from h2o_wave import main, app, Q, ui


rows = [str(i + 1) for i in range(100)]
rows_per_page = 10


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[ui.table_column(name='text', label='Text', link=False)],
                rows=[ui.table_row(name=r, cells=[r]) for r in rows[0:rows_per_page]],
                pagination=ui.table_pagination(total_rows=len(rows), rows_per_page=rows_per_page),
                height='580px',
                events=['page_change']
            )
        ])
        q.client.initialized = True

    if q.events.table and q.events.table.page_change:
        offset = q.events.table.page_change.get('offset', 0)
        new_rows = rows[offset:offset + rows_per_page]
        q.page['form'].items[0].table.rows = [ui.table_row(name=r, cells=[r]) for r in new_rows]

    await q.page.save()
