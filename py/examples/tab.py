# Tab
# This example demonstrates how you can observe and handle changes to the browser's
# [location hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash).
#
# The location hash can be accessed using `q.args['#']`.
# #routing #tab
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    content = 'Welcome to our store!'

    location = q.args['#']
    if location:
        if location == 'menu/spam':
            content = "Sorry, we're out of spam!"
        elif location == 'menu/ham':
            content = "Sorry, we're out of ham!"
        elif location == 'menu/eggs':
            content = "Sorry, we're out of eggs!"
        elif location == 'about':
            content = 'Everything here is gluten-free!'

    if not q.client.initialized:
        q.page['nav'] = ui.tab_card(
            box='1 1 4 1',
            items=[
                ui.tab(name='#menu/spam', label='Spam'),
                ui.tab(name='#menu/ham', label='Ham'),
                ui.tab(name='#menu/eggs', label='Eggs'),
                ui.tab(name='#about', label='About'),
            ],
            value=f'#{location}' if location else None,
        )
        q.page['blurb'] = ui.markdown_card(
            box='1 2 4 2',
            title='Store',
            content=content,
        )
        q.client.initialized = True
    elif location:
        blurb = q.page['blurb']
        blurb.content = content

    await q.page.save()
