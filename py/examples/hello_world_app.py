# Hello World App
# A simple app to get you started with interactive Wave apps.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    # Take the name of the user as an input interactively
    q.page['name'] = ui.form_card(
        box='1 1 2 1',
        items=[
            ui.textbox(name='my_name', placeholder='Type your name here', value=q.args.my_name, trigger=True)
        ]
    )

    #  Greet the user with name
    q.page['hello'] = ui.markdown_card(
        box='1 2 2 2',
        title='Hello World!',
        content='=Hello{{my_name}}! Welcome to Wave!',
        data=dict(my_name=' ' + q.args.my_name if q.args.my_name else '')
    )
    await q.page.save()
