# Routing / Toolbar
# This example demonstrates how you can observe and handle changes to the browser's
# [location hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash).
#
# The location hash can be accessed using `q.args['#']`.
# #routing #toolbar
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    hash = q.args['#']
    if hash:
        blurb = q.page['blurb']
        if hash == 'menu/spam':
            blurb.content = "Sorry, we're out of spam!"
        elif hash == 'menu/ham':
            blurb.content = "Sorry, we're out of ham!"
        elif hash == 'menu/eggs':
            blurb.content = "Sorry, we're out of eggs!"
        elif hash == 'about':
            blurb.content = 'Everything here is gluten-free!'
    else:
        q.page['nav'] = ui.toolbar_card(
            box='1 1 4 1',
            items=[
                ui.command(name='#menu/spam', label='Spam'),
                ui.command(name='#menu/ham', label='Ham'),
                ui.command(name='#menu/eggs', label='Eggs'),
                ui.command(name='#about', label='About'),
            ],
        )
        q.page['blurb'] = ui.markdown_card(
            box='1 2 4 2',
            title='Store',
            content='Welcome to our store!',
        )
    await q.page.save()
