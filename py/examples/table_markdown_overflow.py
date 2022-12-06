# Table / Markdown / Overflow
# Creates a table with Markdown content that overflows
# #table #markdown #overflow
# ---

from h2o_wave import main, Q, ui, app


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 4 10', items=[
        ui.text_xl(content='Table with Markdown Overflow'),
        ui.table(
            name='table',
            columns=[
                ui.table_column(name='markdown', label='Markdown (No overflow)', 
                    sortable=True, searchable=True, max_width='250'),
                ui.table_column(name='markdown_tooltip', label='Tooltip', 
                    sortable=True, searchable=True, max_width='70', cell_overflow='tooltip',
                    cell_type=ui.markdown_table_cell_type(target='_blank')),
                ui.table_column(name='markdown_wrap', label='Wrap', max_width = '70',
                                cell_type=ui.markdown_table_cell_type(target='_blank'), cell_overflow='wrap'),
            ],
            height='800px',
            rows=[
                ui.table_row(name='row1', cells=['Normal text', 'Hello World! Make a tooltip!', 'Hello World! Wrap this!']),
                ui.table_row(name='row2', cells=['Bold text', 'This is a **bold** text.', 'This is a **bold** text.']),
                ui.table_row(name='row3', cells=['Italicized text', 'This is a _italicized_ text.', 'This is a _italicized_ text.']),
                ui.table_row(name='row4', cells=['Link', '<http://wave.h2o.ai>', '<http://wave.h2o.ai>']),
                ui.table_row(name='row5', cells=['Absolute link with label', '[Wave website as tooltip](http://wave.h2o.ai/)', '[Wave website wrapped](http://wave.h2o.ai/)']),
                ui.table_row(name='row6', cells=['Relative link with label', '[Go to /wave](/wave)', '[Go to /wave](/wave)']),
                ui.table_row(name='row7', cells=['Email', '<fake@email.com>', '<fake@email.com>']),
                ui.table_row(name='row8', cells=['Code', '``inline code with tooltip``', '``inline code that wraps``']),  # change to monospaced font
            ]
        )
    ])

    await q.page.save()
