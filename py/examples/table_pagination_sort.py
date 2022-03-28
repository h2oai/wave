# Table / Pagination / Sort
# Use a #table with pagination to display large (100k+ rows) tabular data and allow sorting along the way.
# #form #table #pagination #sort
# ---

from h2o_wave import main, app, Q, ui


# Create a dummy data blueprint.
class Issue:
    def __init__(self, text: str):
        self.text = text


issues = [Issue(i + 1) for i in range(100)]
rows_per_page = 10


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[ui.table_column(name='text', label='Text', sortable=True, link=False)],
                rows=[ui.table_row(name=str(i.text), cells=[str(i.text)]) for i in issues[0:rows_per_page]],
                pagination=ui.table_pagination(total_rows=len(issues), rows_per_page=rows_per_page),
                height='580px',
                events=['page_change', 'sort']
            )
        ])
        q.client.initialized = True

    if q.events.table:
        offset = 0
        if q.events.table.sort:
            for col, reverse in q.events.table.sort.items():
                issues.sort(key=lambda i: getattr(i, col), reverse=reverse)
        if q.events.table.page_change:
            offset = q.events.table.page_change.get('offset', 0)

        next_issues = issues[offset:offset + rows_per_page]
        q.page['form'].items[0].table.rows = [ui.table_row(name=str(i.text), cells=[str(i.text)]) for i in next_issues]

    await q.page.save()
