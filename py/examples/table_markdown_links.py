# Table / Markdown / Links
# Creates a table with Markdown link that open in new tab
# #table #markdown #links
# ---

from h2o_wave import main, Q, ui, app


@app('/demo')
async def serve(q: Q):

    q.page['example'] = ui.form_card(box='1 1 3 3', items=[
        ui.text_xl(content='Table with Markdown links'),
        ui.table(
            name='table',
            columns=[
                ui.table_column(name='description', label='URL type'),
                ui.table_column(name='markdown', label='Link', cell_type=ui.markdown_table_cell_type(target='_blank'))
            ],
            rows=[
                ui.table_row(name='row1', cells=['Absolute', '[Wave website](http://wave.h2o.ai/)']),
                ui.table_row(name='row2', cells=['Relative', '[Go to /wave](/wave)']),
            ]
        )
    ])

    await q.page.save()
