# Markdown / Submit / Text
# Use "?" to prefix the desired q.args.key that you want to have submitted after clicking a phrase.
# ---

from h2o_wave import main, app, Q, ui


def get_form_items(clicked: str):
    return [
        ui.text(content='The quick brown [fox](?fox) jumps over the lazy [dog](?dog)'),
        ui.text(content=f'Clicked: {clicked}'),
    ]


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['example'] = ui.form_card(box='1 1 3 2', items=get_form_items('Nothing'))
        q.client.initialized = True

    if q.args.fox:
        q.page['example'].items = get_form_items('fox')
    if q.args.dog:
        q.page['example'].items = get_form_items('dog')
    await q.page.save()
