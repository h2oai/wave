# Lesson 7: User interaction III
# # Events explained
# Some widgets can yield multiple different interactions (like table sort, filter, search etc.) instead of a single
# one like "textbox" for example. In this case, "q.args" is not a viable place to store these and that's where
# events come into play.
# 
# Some widgets allow you to specify which events you would like to listen on via "events" attribute.
# Together with the "name" attribute, in case the specific event is fired, the q object is populated
# in the following way: `q.events.<name-atrr>.<event-name>`. In practice, if we have a dialog
# with the name "my_dialog" and we listen on "dismissed" event, it would be under "q.events.my_dialog.dismissed".
# ## Simple example
# Let's create a dialog box with an X closing button that emits a "dismissed" event after clicking. Then, we would
# want to handle the event so that the dialog is closed.
# ## Your task
# There is not much to play around with here so give yourself a pat on shoulder for making it this far!
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.form_card(box='1 1 2 1', items=[
        ui.button(name='show_dialog', label='Open dialog', primary=True)
    ])

    # Was the show_dialog button clicked?
    if q.args.show_dialog:
        # Create a dialog with a close button.
        q.page['meta'] = ui.meta_card(box='', dialog=ui.dialog(
            title='Hello!',
            name='my_dialog',
            items=[ui.text('Click the X button to close this dialog.')],
            # Enable a close button (displayed at the top-right of the dialog)
            closable=True,
            # Get notified when the dialog is dismissed.
            events=['dismissed'],
        ))

    # Did we get events from the dialog?
    if q.events.my_dialog:
        # Was the dialog dismissed?
        if q.events.my_dialog.dismissed:
            # Delete the dialog
            q.page['meta'].dialog = None

    await q.page.save()
