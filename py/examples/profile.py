# Profile
# Create a profile card to display information about a user.
# ---
from h2o_wave import site, ui

page = site['/demo']

page.add('meta', ui.meta_card(box='', theme='h2o-dark'))
page.add('example', ui.profile_card(
    box='1 1 3 4',
    title='John Doe',
    subtitle='Developer',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', # noqa
    profile_image='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260',
    commands=[
        ui.command(name='new', label='New', icon='Add', items=[
            ui.command(name='email', label='Email Message', icon='Mail'),
            ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
        ]),
        ui.command(name='upload', label='Upload', icon='Upload'),
        ui.command(name='share', label='Share', icon='Share'),
        ui.command(name='download', label='Download', icon='Download'),
    ],
    items=[
        ui.inline(justify='center', items=[
            ui.button(name='btn1', label='Button 1'),
            ui.button(name='btn2', label='Button 2'),
            ui.button(name='btn3', label='Button 3'),
        ]),
    ]
))

page.save()
