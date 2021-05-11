# Info / Tall
# Create a tall information card displaying a title, caption, and either an icon or image.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('example', ui.tall_info_card(
    box='1 1 2 3',
    title='Info Card',
    caption='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere.',
    category='Category',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
))

page.save()
