# Table / Pagination
# Use a paginated #table to display large (100k+ rows) tabular data.
# #form #table #pagination
# ---

import os
from typing import Dict, List
from h2o_wave import main, app, Q, ui
from copy import deepcopy
import csv


# Create a dummy data blueprint.
class Issue:
    def __init__(self, text: str, status: str):
        self.text = text
        self.status = status


all_rows = [Issue(text=i + 1, status=('Closed' if i % 2 == 0 else 'Open')) for i in range(100)]
rows_per_page = 10
total_rows = len(all_rows)


def get_rows(base: List, sort: Dict[str, bool] = None, search: Dict = None, filters: Dict[str, List[str]] = None) -> List:
    # Make a deep copy in order to not mutate the original `all_issues` which serves as our baseline.
    rows = deepcopy(base)

    # Sort by multiple columns.
    if sort:
        for col, reverse in sort.items():
            rows.sort(key=lambda i: getattr(i, col), reverse=reverse)
    # Filter out all rows that do not contain searched string.
    if search:
        search_val = search['value'].lower()
        cols = search['cols']
        rows = [row for row in rows if any(search_val in str(getattr(row, col)).lower() for col in cols)]
    # Filter out rows that do not contain filtered column value.
    if filters:
        for col, filters in filters.items():
            rows = [row for row in rows if not filters or any(f in getattr(row, col) for f in filters)]

    return rows


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[
                    ui.table_column(name='text', label='Text', sortable=True, searchable=True, link=False),
                    ui.table_column(name='status', label='Status', filterable=True, filters=['Open', 'Closed']),
                ],
                rows=[ui.table_row(str(r.text), [str(r.text), r.status]) for r in get_rows(all_rows)[0:rows_per_page]],
                resettable=True,
                downloadable=True,
                pagination=ui.table_pagination(total_rows=len(all_rows), rows_per_page=rows_per_page),
                # Make sure to register the necessary events for the feature you want to support, e.g. sorting.
                # All the registered events have to be handled by the developer.
                # `page_change` event is required to be handled for pagination to work.
                events=['sort', 'filter', 'search', 'page_change', 'download', 'reset']
            )
        ])
        q.client.initialized = True

    # Check if user triggered any table action and save it to local state for allowing multiple
    # actions to be performed on the data at the same time, e.g. sort the filtered data etc.
    if q.events.table:
        table = q.page['form'].items[0].table
        if q.events.table.sort:
            q.client.sort = q.events.table.sort
            q.client.page_offset = 0
        if q.events.table.filter:
            q.client.filters = q.events.table.filter
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
            table.pagination = ui.table_pagination(total_rows, rows_per_page)

        rows = get_rows(all_rows, q.client.sort, q.client.search, q.client.filters)
        offset = q.client.page_offset or 0
        table.rows = [ui.table_row(str(r.text), [str(r.text), r.status]) for r in rows[offset: offset + rows_per_page]]

        # Update table pagination according to the new row count.
        if q.client.search is not None or q.client.filters:
            table.pagination = ui.table_pagination(len(rows), rows_per_page)

        if q.events.table.download:
            # For multi-user apps, the tmp file name should be unique for each user, not hardcoded.
            with open('data_download.csv', 'w') as csvfile:
                csv_writer = csv.writer(csvfile, delimiter=',')
                for r in rows:
                    csv_writer.writerow([r.text, r.status])
            download_url, = await q.site.upload(['data_download.csv'])
            # Clean up the file after upload.
            os.remove('data_download.csv')
            q.page['meta'].script = ui.inline_script(f'window.open("{download_url}")')

    await q.page.save()
