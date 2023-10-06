---
title: Section
keywords:
  - section
custom_edit_url: null
---


Render a card displaying a title, a subtitle, and optional components.
Section cards are typically used to demarcate different sections on a page.

Check the full API at [ui.section_card](/docs/api/ui#section_card).

```py
q.page['section'] = ui.section_card(
    box='1 1 7 1',
    title='Your title',
    subtitle='Your subtitle',
    items=[
        ui.toggle(name='search', label='Search', value=True),
        ui.dropdown(name='distribution', label='', value='option0', choices=[
            ui.choice(name=f'option{i}', label=f'Option {i}') for i in range(5)
        ]),
        ui.date_picker(name='target_date', label='', value='2020-12-25'),
    ],
)
```
