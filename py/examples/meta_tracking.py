# Meta / Tracking
# Track user interactions on your app's pages.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    count = q.client.count or 0
    if not q.client.initialized:

        # Set up a tracker for the page using Google Analytics.
        # All browser events/activities are logged against the specified property ID.
        q.page['meta'] = ui.meta_card('', tracker=ui.tracker(type=ui.TrackerType.GA, id='G-W810CJL5GP'))
        # That's all you need to do - set up a tracker.
        # The rest of this example does not do anything special related to tracking.

        q.page['example'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.button(name='increment', label=f'Count={count}')
        ])
        q.client.initialized = True
    else:
        if q.args.increment:
            q.client.count = count = count + 1
            q.page['example'].items[0].button.label = f'Count={count}'

    await q.page.save()
