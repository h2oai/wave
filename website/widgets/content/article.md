---
title: Article
keywords:
  - article
  - preview
custom_edit_url: null
---

For cases when an app needs to display large amounts of textual content, there are article cards.

Check the full API at [ui.article_card](/docs/api/ui#article_card).

```py
q.page['example'] = ui.article_card(
    box='1 1 4 5',
    title='Title',
    items=[
        ui.mini_buttons([
            ui.mini_button(name='like', label='4', icon='Heart'),
            ui.mini_button(name='comment', label='2', icon='Blog'),
            ui.mini_button(name='share', label='1', icon='Relationship'),
        ])
    ],
    content='''
Duis porttitor tincidunt justo ac semper. Vestibulum et molestie lectus. Proin vel eros a ex condimentum aliquam.
Sed accumsan tellus sit amet nulla ullamcorper. Suspendisse bibendum tristique sem, quis lacinia ex pulvinar quis.
Nam elementum accumsan porta. Sed eget aliquam elit, sed luctus lorem. Nulla gravida malesuada purus eu eleifend.
Maecenas in ante interdum, hendrerit velit at, tempus eros. Nullam convallis tempor libero at viverra.

## Heading 2

Duis porttitor tincidunt justo ac semper. Vestibulum et molestie lectus. Proin vel eros a ex condimentum aliquam.
Sed accumsan tellus sit amet nulla ullamcorper. Suspendisse bibendum tristique sem, quis lacinia ex pulvinar quis.
Nam elementum accumsan porta. Sed eget aliquam elit, sed luctus lorem. Nulla gravida malesuada purus eu eleifend.
Maecenas in ante interdum, hendrerit velit at, tempus eros. Nullam convallis tempor libero at viverra.
'''
)
```
