# Meta / Notification
# Display a desktop #notification. #meta
# ---
import time

from h2o_wave import site, ui

page = site['/demo']

page['meta'] = ui.meta_card(box='')

page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='Desktop Notifications',
    content='This page should display a desktop notification in a few seconds. Wait for it...',
)
page.save()

time.sleep(5)
page['meta'].notification = 'And now for something completely different!'

page.save()
