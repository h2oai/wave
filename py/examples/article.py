# Article
# Create an article card for longer texts.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('meta', ui.meta_card(box='', theme='h2o-dark'))
page.add('example', ui.article_card(
    box='1 1 4 6',
    title='Title',
    subtitle='Subtitle',
    caption='Caption',
    commands=[
        ui.command(
            name='new', label='New', icon='Add', items=[
                ui.command(name='email', label='Email Message', icon='Mail'),
                ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
            ]
        ),
        ui.command(name='upload', label='Upload', icon='Upload'),
        ui.command(name='share', label='Share', icon='Share'),
        ui.command(name='download', label='Download', icon='Download'),
    ],
    content='''
Duis porttitor tincidunt justo ac semper. Vestibulum et molestie lectus. Proin vel eros a ex condimentum aliquam.
Sed accumsan tellus sit amet nulla ullamcorper. Suspendisse bibendum tristique sem, quis lacinia ex pulvinar quis.
Nam elementum accumsan porta. Sed eget aliquam elit, sed luctus lorem. Nulla gravida malesuada purus eu eleifend.
Maecenas in ante interdum, hendrerit velit at, tempus eros. Nullam convallis tempor libero at viverra.

# Heading 1

Duis porttitor tincidunt justo ac semper. Vestibulum et molestie lectus. Proin vel eros a ex condimentum aliquam.
Sed accumsan tellus sit amet nulla ullamcorper. Suspendisse bibendum tristique sem, quis lacinia ex pulvinar quis.
Nam elementum accumsan porta. Sed eget aliquam elit, sed luctus lorem. Nulla gravida malesuada purus eu eleifend.
Maecenas in ante interdum, hendrerit velit at, tempus eros. Nullam convallis tempor libero at viverra.
'''
))

page.save()
