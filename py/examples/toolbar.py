# Toolbar
# Use toolbars to provide commands that operate on the content of a page.
# #toolbar #command
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    q.page['nav'] = ui.toolbar_card(
        box='1 1 4 1',
        items=[
            ui.command(
                name='new', label='New', icon='Add', items=[
                    ui.command(name='email', label='Email Message', icon='Mail'),
                    ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
                ]
            ),
            ui.command(name='upload', label='Upload', icon='Upload'),
            ui.command(name='share', label='Share', icon='Share'),
            ui.command(name='download', label='Download', icon='Download'),
        ],
        secondary_items=[
            ui.command(name='tile', caption='Grid View', icon='Tiles'),
            ui.command(name='info', caption='Info', icon='Info'),
        ],
        overflow_items=[
            ui.command(name='move', label='Move to...', icon='MoveToFolder'),
            ui.command(name='copy', label='Copy to...', icon='Copy'),
            ui.command(name='rename', label='Rename', icon='Edit'),
        ],
    )
    await q.page.save()
