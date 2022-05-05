# Table / Markdown
# Creates a table with Markdown content.
# #table #markdown
# ---

from h2o_wave import main, Q, ui, app


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 3 6', items=[
        ui.text_xl(content='Table with Markdown'),
        ui.table(
            name='table',
            columns=[
                ui.table_column(name='description', label='Description', min_width='200',
                                cell_type=ui.markdown_table_cell_type(target='_blank')),
                ui.table_column(name='markdown', label='Markdown',
                                cell_type=ui.markdown_table_cell_type(target='_blank')),
            ],
            height='450px',
            rows=[
                ui.table_row(name='row1', cells=['Normal text', 'Hello World!']),
                ui.table_row(name='row2', cells=['Bold text', 'This is a **bold** text.']),
                ui.table_row(name='row3', cells=['Italicized text', 'This is a _italicized_ text.']),
                ui.table_row(name='row4', cells=['Link', '<http://wave.h2o.ai>']),
                ui.table_row(name='row5', cells=['Absolute link with label', '[Wave website](http://wave.h2o.ai/)']),
                ui.table_row(name='row6', cells=['Relative link with label', '[Go to /wave](/wave)']),
                ui.table_row(name='row7', cells=['Email', '<fake@email.com>']),
                ui.table_row(name='row8', cells=['Code', '``inline code``']),  # change to monospaced font
            ]
        )
    ])

    await q.page.save()
