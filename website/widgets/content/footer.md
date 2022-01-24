---
title: Footer 
keywords:
  -  footer
custom_edit_url: null
---

The bottom section of the app contains brand identity, useful links or just a simple copyright notice.

Check the full API at [ui.footer_card](/docs/api/ui#footer_card).

## Basic footer

```py
q.page['footer'] = ui.footer_card(box='1 1 7 1', caption='Made with 💛 by H2O Wave Team.')
```

## Using markdown

The `caption` attribute supports markdown natively, which allows adding images or another formatting.

```py
q.page['footer'] = ui.footer_card(box='1 1 7 2', caption='''
![wave-logo](https://wave.h2o.ai/img/logo.svg)

Made with 💛 by H2O Wave Team.'''
)
```

## Adding links

Sometimes, a single line of text is just not enough. A more complex app may need to display multiple sets of links leading to external pages. This is one of the use cases for the `items` attribute.

```py
caption = '''
![wave-logo](https://wave.h2o.ai/img/logo.svg)

Made with 💛 by H2O Wave Team.'''
q.page['footer'] = ui.footer_card(
    box='1 1 7 2',
    caption=caption,
    items=[
        ui.inline(justify='end', items=[
            ui.links(label='First Column', width='200px', items=[
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ]),
            ui.links(label='Second Column', width='200px', items=[
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ]),
            ui.links(label='Third Column', width='200px', items=[
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
                ui.link(label='Sample link', path='https://www.h2o.ai/', target='_blank'),
            ]),
        ]),
    ]
)
```
