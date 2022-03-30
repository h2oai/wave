---
title: Side panel
keywords:
  - form
  - side_panel
custom_edit_url: null
---

Side panel is a supplementary surface used for providing additional information or configuration options, similar to [dialog](/docs/widgets/overlays/dialog). This kind of widget shall be used only in cases when there is not enough screen space left. We highly advise against creating complex UIs/navigations within the side panel. Regular screen viewport should always be the first choice.

UX tips:

* Do not use side panels when regular screen estate can be used.
* Do not use content-heavy side panels.
* Good for configuration options.

You can see the full API for [ui.side_panel](/docs/api/ui#side_panel) or check the interactive example in the Tour app.

![side panel gif](/img/widgets/side_panel.gif)

```py ignore
if not q.client.initialized:
    # Create a meta card for future interactions.
    q.page['meta'] = ui.meta_card(box='')
    # Render a button that will open the side panel.
    q.page['example'] = ui.form_card(box='1 1 2 1', items=[
        ui.button(name='show_side_panel', label='Open side panel', primary=True)
    ])
    q.client.initialized = True
else:
    # Handle button click and open the side panel.
    if q.args.show_side_panel:
        q.page['meta'].side_panel = ui.side_panel(title='Order Donuts', items=[
            ui.text('Donuts cost $1.99. Proceed?'),
            ui.buttons([
                ui.button(name='cancel', label='Cancel'),
                ui.button(name='submit', label='Submit', primary=True),
            ])
        ])
    elif q.args.cancel:
        # Close the side panel by setting it to None.
        q.page['meta'].side_panel = None
    elif q.args.submit:
        # If the user accepted, update the UI and close the side panel.
        q.page['example'].items = [ui.message_bar('success', 'Ordered!')]
        # Close the side panel by setting it to None.
        q.page['meta'].side_panel = None
```

## Handling events

If you ever need to know if the user closed the side panel e.g. by clicking outside or hitting the top right "X" button, you can register a `dismissed` event.

![side panel events gif](/img/widgets/side_panel_events.gif)

```py ignore
if not q.client.initialized:
    # Create a meta card for future interactions.
    q.page['meta'] = ui.meta_card(box='')
    # Render a button that will open the side panel.
    q.page['example'] = ui.form_card(box='1 1 2 1', items=[
        ui.button(name='show_side_panel', label='Order donuts', primary=True)
    ])
    q.client.initialized = True
else:
    # Handle button click by opening the side panel.
    if q.args.show_side_panel:
        q.page['meta'].side_panel = ui.side_panel(
            title='Order Donuts',
            # Name for q.events entry.
            name='my_side_panel',
            # Enable a close button (displayed at the top-right of the side panel).
            closable=True,
            # Get notified when the side panel is dismissed.
            events=['dismissed'],
            items=[
                ui.text('Donuts cost $1.99. Proceed?'),
                ui.buttons([ui.button(name='submit', label='Submit', primary=True)])
            ]
        )

    # Did we get events from the side panel?
    if q.events.my_side_panel:
        # Was the side panel dismissed?
        if q.events.my_side_panel.dismissed:
            # Close the side panel.
            q.page['meta'].side_panel = None
```
