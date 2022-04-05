# Table / Pagination / Filter
# Use a #table with pagination to display large (100k+ rows) tabular data and allow filtering along the way.
# #form #table #pagination #filter
# ---

from h2o_wave import main, app, Q, ui


class Issue:
    def __init__(self, text: str, status: str):
        self.text = text
        self.status = status


issues = [Issue(str(i), 'Open' if i % 2 == 0 else 'Closed') for i in range(100)]
rows_per_page = 10


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[
                    ui.table_column(name='text', label='Text', link=False),
                    ui.table_column(name='status', label='Status', filterable=True, filters=['Open', 'Closed']),
                ],
                rows=[ui.table_row(name=i.text, cells=[i.text, i.status]) for i in issues[0:rows_per_page]],
                pagination=ui.table_pagination(total_rows=len(issues), rows_per_page=rows_per_page),
                height='580px',
                events=['page_change', 'filter']
            )
        ])
        q.client.initialized = True

    if q.events.table:
        offset = 0
        filtered = None
        active_filter = q.events.table.filter or q.client.filter
        if active_filter:
            q.client.filter = active_filter
            for col, filters in active_filter.items():
                filtered = [i for i in issues if not filters or any(f in getattr(i, col) for f in filters)]
        if q.events.table.page_change:
            offset = q.events.table.page_change.get('offset', 0)

        next_issues = filtered[offset:offset + rows_per_page] if filtered else issues[offset:offset + rows_per_page]

        table = q.page['form'].items[0].table
        table.rows = [ui.table_row(name=i.text, cells=[i.text, i.status]) for i in next_issues]
        table.pagination = ui.table_pagination(len(filtered) if filtered else len(issues), rows_per_page)

    await q.page.save()
