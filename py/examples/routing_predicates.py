# Routing / Predicates
# Use `on` and `handle_on` with predicates to handle routing with custom conditions.
# ---
from h2o_wave import main, app, Q, ui, on, handle_on


# This function is called when q.args['temperature'] < 15.
@on('temperature', lambda x: x < 15)
async def when_cold(q: Q):
    await show_slider(q, "It's too cold for a party!")


# This function is called when q.args['temperature'] is between 15 and 28.
@on('temperature', lambda x: 15 <= x < 28)
async def when_normal(q: Q):
    await show_slider(q, "Party time!")


# This function is called when q.args['temperature'] > 28
@on('temperature', lambda x: x > 28)
async def when_hot(q: Q):
    await show_slider(q, "It's hot for a party!")


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        q.args.temperature = 20
        await show_slider(q, "")
    else:
        await handle_on(q)


async def show_slider(q: Q, message: str):
    q.page['output'] = ui.form_card(
        box='1 1 3 2',
        title="Party Meter",
        items=[
            ui.slider(
                name='temperature',
                label='Temperature (°C)',
                max=50,
                value=q.args.temperature,
                trigger=True,
            ),
            ui.text(message),
        ]
    )
    await q.page.save()
