---
title: Markup
keywords:
  - form
  - markup
custom_edit_url: null
---

Used for rendering a custom HTML content.

:::warning
One of the key advantages of Wave is zero HTML / CSS / JS knowledge. We strongly advise you to use
native Wave components and use custom HTML only as a last resort solution.
:::

```py
content = '''
<ol>
    <li>Spam</li>
    <li>Ham</li>
    <li>Eggs</li>
</ol>
'''
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.markup(name='markup', content=content)
])
```
