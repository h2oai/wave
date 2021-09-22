# Form / Icon Notificaton
# Use an icon notification to show number of unread notifications.
# ---
from h2o_wave import site, ui

page = site['/demo']
page['icon_notification1'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.icon_notification(icon='Ringer', icon_color='$red', notification_count="12"),
        ui.icon_notification(icon='Settings', icon_color='$red', notification_count="!")
    ]
)
page.save()
