# Table / Pagination / Search
# Use a #table with pagination to display large (100k+ rows) tabular data and allow searching along the way.
# #form #table #pagination #search
# ---

from h2o_wave import main, app, Q, ui


class Issue:
    def __init__(self, text: str):
        self.text = text


issues = [Issue(str(i + 1)) for i in range(100)]
rows_per_page = 10


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[ui.table_column(name='text', label='Text', searchable=True, link=False)],
                rows=[ui.table_row(name=i.text, cells=[i.text]) for i in issues[0:rows_per_page]],
                pagination=ui.table_pagination(total_rows=len(issues), rows_per_page=rows_per_page),
                height='660px',
                events=['page_change', 'search']
            )
        ])
        q.client.initialized = True

    if q.events.table:
        offset = 0
        searched = issues
        search = q.events.table.search or q.client.search
        if search is not None:
            search_val = search['value'].lower()
            searched = [i for i in issues if any(search_val in str(getattr(i, col)).lower() for col in search['cols'])]
            q.client.search = search
        if q.events.table.page_change:
            offset = q.events.table.page_change.get('offset', 0)

        table = q.page['form'].items[0].table
        table.rows = [ui.table_row(name=i.text, cells=[i.text]) for i in searched[offset:offset + rows_per_page]]
        table.pagination = ui.table_pagination(len(searched), rows_per_page)

    await q.page.save()
