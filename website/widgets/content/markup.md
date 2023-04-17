---
title: Markup
keywords:
  - markup
custom_edit_url: null
---

Use a markup card to display raw HTML content.

Check the full API at [ui.markup_card](/docs/api/ui#markup_card).

:::warning
Prefer native Wave components whenever possible and use the raw HTML only as a last resort.
:::

```py
menu = '''
<ol>
    <li>Spam</li>
    <li>Ham</li>
    <li>Eggs</li>
</ol>
'''

q.page['example'] = ui.markup_card(box='1 1 2 2', title='Menu', content=menu)
```

## Without padding

You can set the `compact` attribute to `True` to remove the title and padding of a markup card.

```py
menu = '''
<ol>
    <li>Spam</li>
    <li>Ham</li>
    <li>Eggs</li>
</ol>
'''

q.page['example'] = ui.markup_card(box='1 1 2 2', title='Menu', content=menu, compact=True)
```
