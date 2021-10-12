# Info / Wide
# Create a wide information card displaying a title, caption, and either an icon or image.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.info_card:
        q.page['example'] = ui.form_card(box='1 1 4 5', items=[
            ui.button(name='back', label='Back', primary=True),
        ])
    else:
        q.page['example'] = ui.wide_info_card(
            box='1 1 4 5',
            name='info_card',
            title='Info Card',
            subtitle='Subtitle',
            caption='''
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia aliquam maxime quos facere
necessitatibus tempore eum odio, qui illum. Repellat modi dolor facilis odio ex possimus
ratione voluptate pariatur cupiditate, quidem quaerat sapiente exercitationem in omnis nulla
maiores consequatur dolores illo inventore quae obcaecati culpa totam corporis! Repudiandae, nostrum repellendus.
''',
            category='Category',
            label='Click me',
            image='https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' # noqa
        )
    await q.page.save()
