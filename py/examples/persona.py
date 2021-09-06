# Form / Persona
# Create an individual's persona or avatar, a visual representation of a person across products.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.persona:
        q.page['example'].items = [
            ui.text_m(f'q.args.persona={q.args.persona}'),
            ui.button(name='back', label='Back', primary=True),
        ]
    else:
        image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
        q.page['example'] = ui.form_card(box='1 1 2 7', items=[
            ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='xs', image=image),
            ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='s', image=image),
            ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='m', image=image),
            ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='l', image=image),
            ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='xl', image=image),
            ui.persona(title='', initials='JD', initials_color='$grey'),
            ui.persona(name='persona', title='Click me', size='s', image=image)
        ])

    await q.page.save()
