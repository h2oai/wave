import os
from typing import List
from h2o_wave import main, app, Q, ui, connect
import csv


rows_per_page = 10

async def get_rows(q: Q, table = 'issues', columns = ['text', 'status'], count_only = False) -> List:
    sql_query = f'SELECT {"count(*)" if count_only else ", ".join(columns)} FROM {table}'

    substitution_values = []
    # Filter out all rows that do not contain searched string.
    if q.client.search:
        search_val = q.client.search['value'].lower()
        cols = q.client.search['cols']
        like_statements = []
        for col in cols:
            if col in columns:
                substitution_values.append('%' + search_val + '%')
                like_statements.append(f'{col} LIKE ?')

        sql_query += ' WHERE (' + ' OR '.join(like_statements) + ')'

    # Filter out rows that do not contain filtered column value.
    if q.client.filters:
        filter_queries = []
        for col, filters in q.client.filters.items():
            if col in columns:
                like_statements = []
                for f in filters:
                    substitution_values.append(f'%{f}%')
                    like_statements.append(f'{col} LIKE ?')
                if like_statements:
                    filter_queries.append(' OR '.join(like_statements))
        if filter_queries:
            sql_query += ' AND ' if 'WHERE' in sql_query else ' WHERE '
            sql_query += ' AND '.join(filter_queries)
    
    # Sort by multiple columns.
    if q.client.sort:
        # NOTE: This example sorts alphabetically since only "text" col is sortable.
        sort_statements = []
        for col, asc in q.client.sort.items():
            if col in columns:
                sort_statements.append(f'{col} {"ASC" if asc else "DESC" }')
        if sort_statements:
            sql_query += ' ORDER BY ' + ', '.join(sort_statements)

    if not count_only:
        sql_query += f' LIMIT {rows_per_page} OFFSET {q.client.page_offset or 0} '

    results, err = await q.app.db.exec(sql_query, *substitution_values)
    if err:
        raise RuntimeError(f'Failed querying the table data: {err}')

    return results


# NOTICE: You need a running instance of https://wave.h2o.ai/docs/wavedb for this app to run.
@app('/demo')
async def serve(q: Q):
    # Run once per app lifetime.
    if not q.app.initialized:
        # Create a database connection.
        connection = connect()
        q.app.db = connection['demo_db']
        # Check if there is any data in the database.
        _, err = await q.app.db.exec('CREATE TABLE IF NOT EXISTS issues (text TEXT, status TEXT)')
        if err:
            raise RuntimeError(f'Failed setting up database: {err}')
        results, err = await q.app.db.exec('SELECT COUNT(*) FROM issues')
        if err:
            raise RuntimeError(f'Failed querying the database: {err}')
        # Populate DB data if necessary.
        if results and results[0] and results[0][0] != 100:
            insert_statements = []
            for i in range (1,101):
                insert_statements.append(f'INSERT INTO issues (text, status) VALUES ("Text {i}", "{"Closed" if i % 2 == 0 else "Open"} ")')
            _, err = await q.app.db.exec_many(*insert_statements)
            if err:
                raise RuntimeError(f'Failed querying the database: {err}')
        q.app.initialized = True

    # Run once per browser tab lifetime.
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        total_rows, err = await q.app.db.exec('SELECT COUNT(*) FROM issues')
        if err:
            raise RuntimeError(f'Failed querying the database: {err}')
        rows = await get_rows(q)
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[
                    ui.table_column(name='text', label='Text', sortable=True, searchable=True, link=False),
                    ui.table_column(name='status', label='Status', filterable=True, filters=['Open', 'Closed']),
                ],
                rows=[ui.table_row(r[0], [r[0], r[1]]) for r in rows],
                resettable=True,
                downloadable=True,
                pagination=ui.table_pagination(total_rows=total_rows[0][0], rows_per_page=rows_per_page),
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
            total_filtered_rows = await get_rows(q, count_only=True)
            table.pagination = ui.table_pagination(total_filtered_rows[0][0], rows_per_page)

        rows = await get_rows(q)
        table.rows = [ui.table_row(r[0], [r[0], r[1]]) for r in rows]

        # Update table pagination according to the new row count.
        if q.client.search is not None or q.client.filters:
            total_filtered_rows = await get_rows(q, count_only=True)
            table.pagination = ui.table_pagination(total_filtered_rows[0][0], rows_per_page)

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
