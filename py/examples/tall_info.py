# Info / Tall
# Create a tall information card displaying a title, caption, and either an icon or image.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.info_card:
        q.page['example'] = ui.form_card(box='1 1 2 4', items=[
            ui.button(name='back', label='Go back', primary=True),
        ])
    else:
        q.page['example'] = ui.tall_info_card(
            box='1 1 2 5',
            name='info_card',
            title='Info Card',
            caption='Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            category='Category',
            label='Click me',
            image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        )

    await q.page.save()
