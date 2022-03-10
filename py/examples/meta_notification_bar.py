# Meta / Notification bar
# Display a notification bar #notification_bar. #meta
# Use this kind of notification when an immediate user feedback is needed. For cases when
# the feedback is not immediate (long-running jobs), use ui.notification as it will
# be visible even when the user is not currently focusing browser tab with your Wave app.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 2 4', items=[
            ui.button(name='top_right', label='Success top-right'),
            ui.button(name='top_center', label='Error top-center'),
            ui.button(name='top_left', label='Warning top-left'),
            ui.button(name='bottom_right', label='Info bottom-right'),
            ui.button(name='bottom_center', label='Info bottom-center'),
            ui.button(name='bottom_left', label='Info bottom-left'),
        ])
        q.client.initialized = True
    if q.args.top_right:
        q.page['meta'] = ui.meta_card(box='', notification_bar=ui.notification_bar(
            text='Success notification',
            type='success',
            position='top-right',
            buttons=[ui.button(name='btn1', label='Button 1', link=True)]
        ))
    if q.args.top_center:
        q.page['meta'] = ui.meta_card(box='', notification_bar=ui.notification_bar(
            text='Error notification message that should hopefully span at least two lines.',
            type='error',
            position='top-center',
            buttons=[
                ui.button(name='btn1', label='Button 1'),
                ui.button(name='btn2', label='Button 2')
            ]
        ))
    if q.args.top_left:
        q.page['meta'] = ui.meta_card(box='', notification_bar=ui.notification_bar(
            text='Warning notification',
            type='warning',
            position='top-left',
        ))
    if q.args.bottom_right:
        q.page['meta'] = ui.meta_card(box='', notification_bar=ui.notification_bar(
            text='Info notification',
            type='info',
            position='bottom-right',
        ))
    if q.args.bottom_center:
        q.page['meta'] = ui.meta_card(box='', notification_bar=ui.notification_bar(
            text='Info notification',
            position='bottom-center',
        ))
    if q.args.bottom_left:
        q.page['meta'] = ui.meta_card(box='', notification_bar=ui.notification_bar(
            text='Default notification',
            position='bottom-left',
        ))
    await q.page.save()
