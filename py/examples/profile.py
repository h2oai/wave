# Profile
# Create a profile card to display information about a user.
# ---
from h2o_wave import site, ui

page = site['/demo']

image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
page.add('example', ui.profile_card(
    box='1 1 3 5',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', # noqa
    persona=ui.persona(title='John Doe', subtitle='Data Scientist', image=image),
    items=[
        ui.inline(justify='center', items=[
            ui.mini_buttons([
                ui.mini_button(name='upload', label='Upload', icon='Upload'),
                ui.mini_button(name='share', label='Share', icon='Share'),
                ui.mini_button(name='download', label='Download', icon='Download'),
            ])
        ]),
        ui.inline(justify='center', items=[
            ui.button(name='btn1', label='Button 1'),
            ui.button(name='btn2', label='Button 2'),
            ui.button(name='btn3', label='Button 3'),
        ]),
    ]
))

page.save()
