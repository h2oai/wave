# Profile
# Create a profile card to display information about a user.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('example', ui.profile_card(
    box='1 1 2 3',
    title='John Doe',
    subtitle='Developer',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', # noqa
    profile_image='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
))

page.save()
