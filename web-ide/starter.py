from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    q.page['hello'] = ui.markdown_card(box='1 1 2 1', title='Hello world', content='Start writing your first app!')
    await q.page.save()
