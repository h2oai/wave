# Article
# Create an article card for longer texts.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('example', ui.article_card(
    box='1 1 4 6',
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
))

page.save()
