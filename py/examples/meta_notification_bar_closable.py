# Meta / Notification bar / Closable
# Display a #notification_bar and detect when it's closed. #meta
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        # Create an empty meta_card to hold the notification bar
        q.page['meta'] = ui.meta_card(box='')
        # Display a button to show the notification bar
        q.page['form'] = ui.form_card(box='1 1 2 4', items=[
            ui.button(name='show_notification_bar', label='Show notification bar'),
        ])
        q.client.initialized = True

    # Was the show_notification_bar button clicked?    
    if q.args.show_notification_bar:
        # Create a notification bar
        q.page['meta'].notification_bar=ui.notification_bar(
            text='You can close me!',
            name="my_bar",
            # Get notified when the notification bar is dismissed.
            events=['dismissed'],
        )

    # Did we get events from the notification bar?
    if q.events.my_bar:
        # Was the notification bar dismissed?
        if q.events.my_bar.dismissed:
            # Delete the notification bar
            q.page['meta'].notification_bar = None        

    await q.page.save()
