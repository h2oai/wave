# Nav
# Use nav cards to display #sidebar #navigation.
# ---
from h2o_wave import main, app, Q, ui


persona = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'


@app('/demo')
async def serve(q: Q):
    if '#' in q.args and not q.args.show_nav:
        hash_ = q.args['#']
        q.page.drop()
        q.page['redirect'] = ui.form_card(box='1 1 2 5', items=[
            ui.text(f'#={hash_}'),
            ui.button(name='show_nav', label='Back', primary=True),
        ])
    else:
        q.page['meta'] = ui.meta_card(box='', redirect='#')
        q.page['nav1'] = ui.nav_card(
            box='1 1 2 -1',
            value='#menu/spam',
            title='H2O Wave',
            subtitle='And now for something completely different!',
            image='https://wave.h2o.ai/img/h2o-logo.svg',
            items=[
                ui.nav_group('Menu', items=[
                    ui.nav_item(name='#menu/spam', label='Spam'),
                    ui.nav_item(name='#menu/ham', label='Ham'),
                    ui.nav_item(name='#menu/eggs', label='Eggs', tooltip='Make me a scrambled egg.'),
                    ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
                ]),
                ui.nav_group('Help', items=[
                    ui.nav_item(name='#about', label='About', icon='Info'),
                    ui.nav_item(name='#support', label='Support', icon='Help'),
                ])
            ],
            secondary_items=[
                ui.inline(items=[
                    ui.persona(title='John Doe', subtitle='Software developer', size='s', image=persona),
                    ui.menu(items=[
                        ui.command(name='profile', label='Profile', icon='Contact'),
                        ui.command(name='preferences', label='Preferences', icon='Settings'),
                        ui.command(name='logout', label='Logout', icon='SignOut'),
                    ])
                ]),
            ],
        )
        q.page['nav2'] = ui.nav_card(
            box='3 1 2 -1',
            value='#menu/ham',
            persona=ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='xl', image=persona),
            items=[
                ui.nav_group('Menu', items=[
                    ui.nav_item(name='#menu/spam', label='Spam'),
                    ui.nav_item(name='#menu/ham', label='Ham'),
                    ui.nav_item(name='#menu/eggs', label='Eggs'),
                    ui.nav_item(name='#menu/toast', label='Toast', disabled=True),
                ]),
                ui.nav_group('Help', items=[
                    ui.nav_item(name='#about', label='About', icon='Info'),
                    ui.nav_item(name='#support', label='Support', icon='Help'),
                ])
            ],
            secondary_items=[ui.button(name='logout', label='Logout', width='100%')],
            color='primary'
        )
    await q.page.save()
