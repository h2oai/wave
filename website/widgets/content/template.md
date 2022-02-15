---
title: Template 
keywords:
  - template
custom_edit_url: null
---

Use a template card to display content authored using [Handlebars](https://handlebarsjs.com/guide/) templates.

Check the full API at [ui.template_card()](/docs/api/ui#template_card).

```py
from h2o_wave import pack
menu = '''
<ol>
{{#each dishes}}
<li><strong>{{name}}</strong> costs {{price}}</li>
{{/each}}
</ol
'''

q.page['template_example'] = ui.template_card(
    box='1 1 2 2',
    title='Menu',
    content=menu,
    data=pack(dict(dishes=[
        dict(name='Spam', price='$2.00'),
        dict(name='Ham', price='$3.45'),
        dict(name='Eggs', price='$1.75'),
    ])),
)
```
