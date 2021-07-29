# Markdown / Submit / Text
# Use "?" to prefix the desired q.args.key that you want to have submitted after clicking a phrase.
# ---

from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['clicked'] = ui.form_card(box='1 1 3 2', items=[
            ui.text(content='The quick brown [fox](?fox) jumps over the lazy [dog](?dog).'),
            ui.text(content='Clicked: nothing'),
        ])
        q.client.initialized = True

    if q.args.fox:
        q.page['clicked'].items[1].text.content = 'Clicked: fox'
    if q.args.dog:
        q.page['clicked'].items[1].text.content = 'Clicked: dog'
    await q.page.save()
