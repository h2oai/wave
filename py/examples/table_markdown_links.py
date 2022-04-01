# Table / Markdown / Links
# Creates a table with relative and absolute links.
# #table #markdown #links
# ---

from h2o_wave import main, Q, ui, app


@app('/demo')
async def serve(q: Q):

    q.page['example'] = ui.form_card(box='1 1 5 3', items=[
        ui.text_xl(content='Table with Markdown links'),
        ui.table(
            name='table',
            columns=[
                ui.table_column(name='description', label='Description', min_width="200"),
                ui.table_column(name='newtab', label='Open in new tab'),
                ui.table_column(name='markdown', label='Link',
                                cell_type=ui.markdown_table_cell_type())
            ],
            rows=[
                ui.table_row(name='row1', cells=['Absolute URL', 'Yes', '[Wave](http://wave.h2o.ai/)']),
                ui.table_row(name='row2', cells=['Relative URL', 'No', '[Go to /wave](wave)']),
            ]
        )
    ])

    await q.page.save()
