# Tall Aricle Preview
# Create a tall article preview card if you intend to show a little preview
# and allow user to click through to more content (specify 'name' attr).
# ---
from h2o_wave import site, ui

page = site['/demo']

content = '''
### Sub Header

Nunc scelerisque tincidunt elit. Vestibulum non mi ipsum. Cras pretium suscipit tellus sit ametsa aliquet.
'''

page.add('example', ui.tall_article_preview_card(
    box='1 1 4 6',
    title='Tall article preview',
    subtitle='Subtitle',
    name='name',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', # noqa
    content=content,
    items=[
        ui.buttons(items=[
            ui.button(name='like', label='Like'),
            ui.button(name='comment', label='Comment'),
            ui.button(name='share', label='Share'),
        ]),
    ]
))

page.save()
