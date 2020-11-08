# Layout / Grids
# How to create a responsive layout.
# ---

from h2o_wave import site, ui

page = site['/demo']
page.drop()

# The meta card's 'grids' attribute defines how to lay out cards for different viewport sizes.
# We define three layout grids here.
page['meta'] = ui.meta_card(box='', grids=[
    ui.grid(
        # If the viewport width >= 0:
        breakpoint='xs',
        # Create one column, sized automatically.
        columns=['auto'],
        # Create 5 rows: 80px for the header, and 4 others for content, sized automatically.
        rows=['80px'] + ['auto'] * 4,
    ),
    ui.grid(
        # If the viewport width >= 768:
        breakpoint='m',
        # Create 2 columns: 250px for the sidebar, and another for the content, sized automatically.
        columns=['250px', 'auto'],
        # Create 4 rows: 80px for the header, and 3 others for content, sized automatically.
        rows=['80px'] + ['auto'] * 3,
    ),
    ui.grid(
        # If the viewport width >= 1200:
        breakpoint='xl',
        # Create 3 columns: 300px for the sidebar, and 2 others taking up 1:1 (1/2 and 1/2) of the remaining width.
        columns=['300px', '1', '1'],
        # Create 3 rows: 80px for the header, and 2 others taking up 1:2 (1/3rd and 2/3rd) of the remaining height.
        rows=['80px', '1', '2'],
        # Fix width to 1200px.
        width='1200px',
    ),
])

page['header'] = ui.markdown_card(
    # The box attribute for a card specifies where to place the card for each of our three viewport sizes above.
    # If the viewport width >= 0: use 1 1 1 1.
    # If the viewport width >= 768: use 1 1 2 1.
    # If the viewport width >= 1200: use 1 1 3 1.
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
