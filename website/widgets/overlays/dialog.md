---
title: Dialog
keywords:
  - form
  - dialog
custom_edit_url: null
---

Dialogs inform users about critical information, require them to make decisions or involve multiple tasks. However, use dialogs sparingly as they take your users away from the app context and can make your app seem to be noisy if overused. In general, they shall be reached out for only when the users need to be informed about something very important that requires their interaction (e.g. "Are you sure?" dialogs).

UX tips:

* Do not use dialogs when regular screen estate can be used.
* Do not use content-heavy dialogs.
* Be consistent with action naming and positioning. If you have multiple dialogs with Yes/No options, make sure to always use the same strings and always place them in the same order.

You can see the full API for [ui.dialog](/docs/api/ui#dialog) or check the interactive example in the Tour app.

![dialog gif](/img/widgets/dialog.gif)

```py ignore
if not q.client.initialized:
    # Create a meta card for future interactions.
    q.page['meta'] = ui.meta_card(box='')
    # Render a button that will open the dialog.
    q.page['example'] = ui.form_card(box='1 1 4 2', items=[
        ui.button(name='show_dialog', label='Open dialog', primary=True)
    ])
    q.client.initialized = True
else:
    # Handle button click and open the dialog.
    if q.args.show_dialog:
        q.page['meta'].dialog = ui.dialog(title='Order Donuts', items=[
            ui.text('Donuts cost $1.99. Proceed?'),
            ui.buttons([
                ui.button(name='cancel', label='Cancel'),
                ui.button(name='submit', label='Submit', primary=True),
            ])
        ])
    elif q.args.cancel:
        # Close the dialog by setting it to None.
        q.page['meta'].dialog = None
    elif q.args.submit:
        # If the user accepted, update the UI and close the dialog.
        q.page['example'].items = [ui.message_bar('success', 'Ordered!')]
        # Close the dialog by setting it to None.
        q.page['meta'].dialog = None
```

## Handling events

If you ever need to know if the user closed the dialog e.g. by clicking outside or hitting the top right "X" button, you can register a `dismissed` event.

![dialog events gif](/img/widgets/dialog_events.gif)

```py ignore
if not q.client.initialized:
    # Create a meta card for future interactions.
    q.page['meta'] = ui.meta_card(box='')
    # Render a button that will open the dialog.
    q.page['example'] = ui.form_card(box='1 1 4 2', items=[
        ui.button(name='show_dialog', label='Open dialog', primary=True)
    ])
    q.client.initialized = True
else:
    # Handle button click by opening the dialog.
    if q.args.show_dialog:
        q.page['meta'].dialog = ui.dialog(
            title='Order Donuts',
            # Name for q.events entry.
            name='my_dialog',
            # Enable a close button (displayed at the top-right of the dialog).
            closable=True,
            # Get notified when the dialog is dismissed.
            events=['dismissed'],
            items=[
                ui.text('Donuts cost $1.99. Proceed?'),
                ui.buttons([ui.button(name='submit', label='Submit', primary=True)])
            ])

# Did we get events from the dialog?
if q.events.my_dialog:
    # Was the dialog dismissed?
    if q.events.my_dialog.dismissed:
        # Close the dialog.
        q.page['meta'].dialog = None
```
