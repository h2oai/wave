# Meta / Notification
# Show notification.
# ---
from telesync import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='')

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='Notification',
    content='Allow browser notifcations in order to see them.',
)
page['meta'].notification = 'Processing complete!'

page.save()
