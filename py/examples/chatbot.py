# Form / Chatbot
# Use this component for chat interactions.
# #form
# ---
from h2o_wave import main, app, Q, ui, data

b = data(fields='donut price', size=-5, rows=[
    ['cream', 3.99],
    ['custard', 2.99],
    ['cinnamon', 2.49],
    ['sprinkles', 2.49],
    ['sugar', 1.99],
], pack=True)


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['form'] = ui.form_card(box='1 1 5 5', items=[
            ui.chatbot(name='chatbot', data=b)
        ])
        q.client.initialized = True
    if q.args.chatbot:
        print(q.args.chatbot)
        q.page['aa'].items = []

    await q.page.save()
