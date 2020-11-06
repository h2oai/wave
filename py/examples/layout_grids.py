# Layout / Size
# How to adjust the size of cards on a page.
# ---

from h2o_wave import site, ui

page = site['/demo']
page.drop()

page['meta'] = ui.meta_card(box='', grids=[
    ui.grid(
        breakpoint=0,
        columns=['auto'],
        rows=['100px'] + ['auto'] * 4,
    ),
    ui.grid(
        breakpoint=768,
        columns=['250px', 'auto'],
        rows=['100px'] + ['auto'] * 3,
    ),
    ui.grid(
        breakpoint=1200,
        columns=['300px', '1fr', '1fr'],
        rows=['100px', '1fr', '2fr'],
        width='1200px',
    ),
])

page['header'] = ui.markdown_card(
    box='1 1 1 1 / 1 1 2 1 / 1 1 3 1',
    title='Header',
    content='',
)
page['controls'] = ui.markdown_card(
    box='1 2 1 1 / 1 2 1 -1 / 1 2 1 -1',
    title='Controls',
    content='',
)
page['chart1'] = ui.markdown_card(
    box='1 3 1 1 / 2 2 1 1 / 2 2 1 1',
    title='Chart 1',
    content='',
)
page['chart2'] = ui.markdown_card(
    box='1 4 1 1 / 2 3 1 1 / 3 2 1 1',
    title='Chart 2',
    content='',
)
page['content'] = ui.markdown_card(
    box='1 5 1 1 / 2 4 1 1 / 2 3 2 1',
    title='Content',
    content='',
)

page.save()
