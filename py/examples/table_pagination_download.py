# Table / Pagination / Download
# Use a #table with pagination to display large (100k+ rows) tabular data and provide data download option.
# #form #table #pagination #download
# ---

from h2o_wave import main, app, Q, ui
import csv


rows = [str(i + 1) for i in range(100)]
rows_per_page = 10


@app('/demo')
async def serve(q: Q):
    if not q.app.initialized:
        # Allow downloading all data since no filters/search/sort is allowed.
        # Create and upload a CSV file for downloads.
        # For multi-user apps, the tmp file name should be unique for each user, not hardcoded.
        with open('data_download.csv', 'w') as csvfile:
            csv_writer = csv.writer(csvfile, delimiter=',')
            for r in rows:
                csv_writer.writerow([r])
        q.app.data_download, = await q.site.upload(['data_download.csv'])
        q.app.initialized = True

    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(box='')
        q.page['form'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.table(
                name='table',
                columns=[ui.table_column(name='text', label='Text', link=False)],
                rows=[ui.table_row(name=r, cells=[r]) for r in rows[0:rows_per_page]],
                pagination=ui.table_pagination(total_rows=len(rows), rows_per_page=rows_per_page),
                height='580px',
                downloadable=True,
                events=['page_change', 'download']
            )
        ])
        q.client.initialized = True

    if q.events.table:
        if q.events.table.download:
            q.page['meta'].script = ui.inline_script(f'window.open("{q.app.data_download}")')
        if q.events.table.page_change:
            offset = q.events.table.page_change.get('offset', 0)
            new_rows = rows[offset:offset + rows_per_page]
            q.page['form'].items[0].table.rows = [ui.table_row(name=r, cells=[r]) for r in new_rows]

    await q.page.save()
