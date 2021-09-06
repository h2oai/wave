---
title: Template
keywords:
  - form
  - template
custom_edit_url: null
---

Used for rendering a dynamic custom HTML content using a templating language.

:::warning
One of the key advantages of Wave is zero HTML / CSS / JS knowledge. We strongly advise you to use
native Wave components and use custom HTML only as a last resort solution.
:::

```py
from h2o_wave import pack

content = '''
<ol>
{{#each dishes}}
<li><strong>{{name}}</strong> costs {{price}}</li>
{{/each}}
</ol
'''

q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.template(content=content, data=pack(dict(dishes=[
        dict(name='Spam', price='$2.00'),
        dict(name='Ham', price='$3.45'),
        dict(name='Eggs', price='$1.75'),
    ])))
])
```
