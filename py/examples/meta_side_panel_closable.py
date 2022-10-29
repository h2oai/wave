# Meta / SidePanel / Closable
# Display a #sidePanel having a close button, and detect when it's closed. #meta
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Create an empty meta_card to hold the side panel
        q.page['meta'] = ui.meta_card(box='')
        # Display a button to show the side panel
        q.page['example'] = ui.form_card(box='1 1 2 1', items=[
            ui.button(name='show_side_panel', label='Open side panel', primary=True)
        ])
        q.client.initialized = True

    # Was the show_side_panel button clicked?
    if q.args.show_side_panel:
        # Create a side panel with a close button
        q.page['meta'].side_panel = ui.side_panel(
            title='Hello!',
            name="my_side_panel",
            items=[
                ui.text('Click the X button to close this side panel.')
            ],
            # Enable a close button (displayed at the top-right of the side panel)
            closable=True,
            # Get notified when the side panel is dismissed.
            events=['dismissed'],
        )

    # Did we get events from the side panel?
    if q.events.my_side_panel:
        # Was the side panel dismissed?
        if q.events.my_sidepanel.dismissed:
            # Delete the side panel
            q.page['meta'].side_panel = None

    await q.page.save()
    