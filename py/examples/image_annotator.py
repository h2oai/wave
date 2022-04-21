# Form / Image Annotator
# Use when you need to annotate images.
# #form #annotator #image
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.annotator:
        q.page['example'].items = [
            ui.text(f'annotator={q.args.annotator}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 9 -1', items=[
            ui.image_annotator(
                name='annotator',
                title='Drag to annotate',
                image='https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                image_height='700px',
                tags=[
                    ui.image_annotator_tag(name='p', label='Person', color='$cyan'),
                    ui.image_annotator_tag(name='f', label='Food', color='$blue'),
                ],
                items=[],
            ),
            ui.button(name='submit', label='Submit', primary=True)
        ])
    await q.page.save()
