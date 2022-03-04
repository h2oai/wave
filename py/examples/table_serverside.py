# Table / Serverside
# Use a serverside #table to display large (100k+ rows) tabular data.
# ---

from h2o_wave import main, app, Q, ui
from copy import deepcopy
import csv


class Issue:
    def __init__(self, text: str, status: str):
        self.text = text
        self.status = status


all_issues = [Issue(text=i + 1, status=('Closed' if i % 2 == 0 else 'Open')) for i in range(100)]
rows_per_page = 10


def get_table_rows(q: Q):
    rows = deepcopy(all_issues)
    if q.client.sort:
        rows.sort(key=lambda i: getattr(i, q.client.sort['col']), reverse=q.client.sort['asc'])
    if q.client.search:
        rows = [i for i in rows if q.client.search in str(i.text)]
    if q.client.filters:
        for col, filters in q.client.filters.items():
            rows = [row for row in rows if not filters or any(f in getattr(row, col) for f in filters)]

    if q.client.search is not None or q.client.filters:
        q.page['form'].items[0].table.pagination = ui.table_pagination(total_rows=len(rows), rows_per_page=rows_per_page)

    offset = q.client.page_offset or 0
    rows = rows[offset:offset + rows_per_page]
    return [ui.table_row(name=str(i.text), cells=[str(i.text), i.status]) for i in rows]


@app('/demo')
async def serve(q: Q):
    global issues

    if not q.app.initialized:
        # Create and upload a CSV file for downloads.
        with open('data_download.csv', 'w') as csvfile:
            csv_writer = csv.writer(csvfile, delimiter=',')
            for i in all_issues:
                csv_writer.writerow([i.text, i.status])
        q.app.data_download, = await q.site.upload(['data_download.csv'])
        q.app.initialized = True

    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['form'] = ui.form_card(box='1 1 -1 10', items=[
            ui.table(
                name='table',
                columns=[
                    ui.table_column(name='text', label='Text', sortable=True, searchable=True),
                    ui.table_column(name='status', label='Status', sortable=True),
                ],
                rows=get_table_rows(q),
                resettable=True,
                downloadable=True,
                pagination=ui.table_pagination(total_rows=len(all_issues), rows_per_page=rows_per_page)
            )
        ])
        q.client.initialized = True

    if q.events.table:
        if q.events.table.sort:
            q.client.sort = q.events.table.sort
        if q.events.table.filters:
            q.client.filters = q.events.table.filters
            q.client.page_offset = 0
        if q.events.table.search is not None:
            q.client.search = q.events.table.search
            q.client.page_offset = 0
        if q.events.table.page_change:
            q.client.page_offset = q.events.table.page_change.get('offset', 0)
        if q.events.table.reset:
            q.client.search = None
            q.client.sort = None
            q.client.filters = None
            q.client.page_offset = 0
        if q.events.table.download:
            q.page['meta'].script = ui.inline_script(f'window.open("{q.app.data_download}")')

        q.page['form'].items[0].table.rows = get_table_rows(q)

    await q.page.save()
