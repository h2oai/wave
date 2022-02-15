# Post card
# Create a post card displaying persona, image, caption and optional buttons.
# ---
from h2o_wave import site, ui

page = site['/demo']

image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
page['example'] = ui.post_card(
    box='1 1 3 5',
    persona=ui.persona(title='John Doe', subtitle='Data Scientist', image=image, caption='caption'),
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
        ui.inline(justify='end', items=[
            ui.mini_buttons([
                ui.mini_button(name='like', label='4', icon='Heart'),
                ui.mini_button(name='comment', label='2', icon='Comment'),
                ui.mini_button(name='share', label='1', icon='Share'),
            ]),
        ]),
        ui.buttons(items=[
            ui.button(name='like', label='Like'),
            ui.button(name='comment', label='Comment'),
            ui.button(name='share', label='Share'),
        ]),
    ],
    caption='''
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere
necessitatibus tempore eum odio, qui illum. Repellat modi dolor facilis odio ex possimus
''',
    aux_value='2h ago',
    image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' # noqa
)
page.save()
