# Meta / Dialog / Closable
# Display a #dialog having a close button, and detect when it's closed. #meta
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Create an empty meta_card to hold the dialog
        q.page['meta'] = ui.meta_card(box='')
        # Display a button to launch dialog dialog
        q.page['example'] = ui.form_card(box='1 1 2 1', items=[
            ui.button(name='launch_dialog', label='Launch dialog', primary=True)
        ])
        q.client.initialized = True

    # Was the launch_dialog button clicked?
    if q.args.launch_dialog:
        # Create a dialog with a close button
        q.page['meta'].dialog = ui.dialog(
            title='Hello!',
            name='my_dialog',
            items=[
                ui.text('Click the X button to close this dialog.'),
            ],
            # Enable a close button (displayed at the top-right of the dialog)
            closable=True,
            # Get notified when the dialog is dismissed.
            events=['dismissed'],
        )

    # Did we get events from the dialog?
    if q.events.my_dialog:
        # Was the dialog dismissed?
        if q.events.my_dialog.dismissed:
            # Delete the dialog
            q.page['meta'].dialog = None

    await q.page.save()
