# Wide Article Preview
# Create a Wide Article Preview card displaying a persona, image, title, caption, and buttons.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.wide_article_preview:
        q.page['example'] = ui.form_card(box='1 1 -1 -1', items=[
            ui.button(name='back', label='Go back', primary=True),
        ])
    else:
        persona_pic = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100'
        q.page['example'] = ui.wide_article_preview_card(
            box='1 1 -1 -1',
            name='wide_article_preview',
            persona=ui.persona(title='Jasmine Grand', subtitle='Marketing Executive',
                               image=persona_pic, caption='caption'),
            commands=[
                ui.command(name='new', label='New', icon='Add', items=[
                    ui.command(name='email', label='Email Message', icon='Mail'),
                    ui.command(name='calendar', label='Calendar Event', icon='Calendar'),
                ]),
                ui.command(name='upload', label='Upload', icon='Upload'),
                ui.command(name='share', label='Share', icon='Share'),
                ui.command(name='download', label='Download', icon='Download'),
            ],
            aux_value='2h ago',
            image='https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress',
            title='Jasmine Grand',
            content='''
Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum sed odio porro veniam dolorum velit doloremque neque aliquam quisquam rem officiis, eius facilis iste quam, minus repellat magni iure eaque!
Veniam pariatur itaque nisi, a nam consequuntur. Aliquam nulla sequi, nihil soluta quaerat vitae inventore magni vero voluptates officiis dolorem alias incidunt iure in sapiente doloribus, quos distinctio? Illo, ullam?
            ''',
            items=[
                ui.inline(justify='end', items=[
                    ui.mini_buttons([
                        ui.mini_button(name='like', label='4', icon='Heart'),
                        ui.mini_button(name='comment', label='2', icon='Comment'),
                        ui.mini_button(name='share', label='1', icon='Share'),
                    ]),
                ])
            ],
        )

    await q.page.save()
