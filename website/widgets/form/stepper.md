---
title: Stepper
keywords:
  - form
  - stepper
custom_edit_url: null
---

Another alternative to [ui.expander](/docs/api/ui#expander) can be a simple stepper. If you feel like a multi-step form could make more sense than a
single cramped form, make sure the user is well aware of what the current step is about. The data collected should be grouped contextually, with a group name
used as a step label.

```py
q.page['form'] = ui.form_card(
    box='1 1 4 2',
    items=[
        ui.stepper(name='stepper', items=[
            ui.step(label='Order info', done=True),
            ui.step(label='Personal info', icon='ContactCard'),
            ui.step(label='Payment info', icon='Money'),
        ])
    ]
)
```

:::tip
Don't forget that your multi-step form should have easy navigation back and forth between steps and should accommodate data validation before proceeding to the next step.
That means the `Next` button should be disabled until all the required fields are filled correctly.
:::

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

Check the full API at [ui.stepper](/docs/api/ui#stepper).
