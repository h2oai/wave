# Preview card
# Create a preview card displaying an image with shadow overlay, title, social icons, caption, and button.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.preview_card:
        q.page['example'] = ui.form_card(box='1 1 3 4', items=[
            ui.button(name='back', label='Back', primary=True),
        ])
    else:
        q.page['example'] = ui.preview_card(
            name='preview_card',
            box='1 1 3 4',
            image='https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress',
            title='Post title',
            items=[ui.mini_buttons([
                ui.mini_button(name='like', label='4', icon='Heart'),
                ui.mini_button(name='comment', label='2', icon='Comment'),
                ui.mini_button(name='share', label='1', icon='Share'),
            ])
            ],
            caption='''
                  Lorem ipsum dolor sit amet, coectetur adipiscing elit. Etiam ut hendrerit lectus.As Etiam venenatis id nulla a molestie.
                  Lorem ipsum dolor sit amet, coectetur adipiscing elit. Etiam ut hendrerit lectus.As Etiam venenatis id nulla a molestie.
                   ''',
            label='Click me'
        )
    await q.page.save()
