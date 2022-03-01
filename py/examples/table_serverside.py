# Table / Serverside
# Use a serverside #table to display large (100k+ rows) tabular data.
# ---

from typing import List
from h2o_wave import main, app, Q, ui
from copy import deepcopy


class Issue:
    def __init__(self, text: str, status: str):
        self.text = text
        self.status = status


all_issues = [Issue(text=i + 1, status=('Closed' if i % 2 == 0 else 'Open')) for i in range(100)]
issues = deepcopy(all_issues)
rows_per_page = 10


def get_table_rows(issues: List[Issue]):
    return [ui.table_row(name=str(i.text), cells=[str(i.text), i.status]) for i in issues]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 -1 10', items=[
            ui.table(
                name='table',
                columns=[
                    ui.table_column(name='text', label='Text', sortable=True),
                    ui.table_column(name='status', label='Status', searchable=True),
                ],
                rows=[],
                resettable=True,
                pagination=ui.table_pagination(total_rows=len(all_issues), rows_per_page=rows_per_page)
            )
        ])
        q.client.initialized = True

    if q.events.table:
        global issues
        table = q.page['form'].items[0].table
        # Handle pagination.
        if q.events.table.page_change:
            offset = q.events.table.page_change['offset']
            if offset is not None:
                table.rows = get_table_rows(issues[offset:offset + rows_per_page])
        # Handle sorting.
        sort = q.events.table.sort
        if sort:
            issues.sort(key=lambda i: getattr(i, sort['col']), reverse=sort['asc'])
            table.rows = get_table_rows(issues[0:rows_per_page])
        # Handle filtering.
        filters = q.events.table.filters
        if filters:
            print(filters)
        # Handle search.
        search = q.events.table.search
        if search is not None:
            searchedIssues = [i for i in issues if search in str(i.text)]
            table.rows = get_table_rows(searchedIssues[0:rows_per_page])
        # Handle reset.
        if q.events.table.reset:
            issues = deepcopy(all_issues)
            table.rows = get_table_rows(issues[0:rows_per_page])

    await q.page.save()
