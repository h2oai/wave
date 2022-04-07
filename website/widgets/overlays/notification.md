---
title: Notification
keywords:
  - form
  - notification
custom_edit_url: null
---

In cases when you have a long-running job/process running in the background and would like to notify users when finished, Wave supports desktop notifications. Their main advantage when compared to [in-app notifications](/docs/widgets/overlays/notification_bar) is that they are visible even if the user is not currently viewing the browser tab with your app, which is common since no one likes to blank stare into the screen while waiting. However, users have to allow these notifications themselves when prompted.

Desktop vs [in-app](/docs/widgets/overlays/notification_bar) notification:

|                                                      | Desktop | In-app |
|------------------------------------------------------|---------|--------|
| Can be seen when the app browser tab is not in view. |    ✅    |    ❌   |
| Configurable besides text.                           |    ❌    |    ✅   |
| Requires user consent.                               |    ✅    |    ❌   |

UX tips:

* Do not overuse. Too many notifications are noisy thus shall be used only when important.
* Use brief, clear messages.
* Use if you need to notify the user even if he is not currently looking at your app.

![desktop notification gif](/img/widgets/notification.gif)

```py ignore
if not q.client.initialized:
    # Create a meta card for future interactions.
    q.page['meta'] = ui.meta_card(box='')
    # Render a button that will open the notification.
    q.page['example'] = ui.form_card(box='1 1 2 1', items=[
        ui.button(name='show_notification', label='Show notification', primary=True)
    ])
    q.client.initialized = True
else:
    # Handle button click by opening the notification.
    if q.args.show_notification:
        q.page['meta'].notification = 'And now for something completely different!'
```
