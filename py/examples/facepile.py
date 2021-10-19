# Form / Facepile
# A face pile displays a list of personas. Each circle represents a person and contains their image or initials.
# Often this control is used when sharing who has access to a specific view or file.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.facepile:
        q.page['example'].items = [
            ui.text_m(f'q.args.facepile={q.args.facepile}'),
            ui.button(name='back', label='Back', primary=True),
        ]
    else:
        image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
        q.page['example'] = ui.form_card(box='1 1 2 2', items=[
            ui.facepile(name='facepile', max=4, items=[
                ui.persona(title='John Doe', image=image),
                ui.persona(title='John Doe', image=image),
                ui.persona(title='John Doe'),
                ui.persona(title='John Doe', image=image),
                ui.persona(title='John Doe', image=image),
            ]),
        ])

    await q.page.save()
