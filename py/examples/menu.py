# Form / Menu
# Create a contextual menu component. Useful when you have a lot of links and want to conserve the space.
# #form #menu
# ---
from h2o_wave import main, app, Q, ui

image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
commands = [
    ui.command(name='profile', label='Profile', icon='Contact'),
    ui.command(name='preferences', label='Preferences', icon='Settings'),
    ui.command(name='logout', label='Logout', icon='SignOut'),
]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 2 3', items=[])
        q.client.initialized = True
    if 'profile' in q.args and not q.args.show_form:
        q.page['example'].items = [
            ui.text(f'profile={q.args.profile}'),
            ui.text(f'preferences={q.args.preferences}'),
            ui.text(f'logout={q.args.logout}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'].items = [
            ui.menu(image=image, items=commands),
            ui.menu(icon='Add', items=commands),
            ui.menu(items=commands)
        ]
    await q.page.save()
