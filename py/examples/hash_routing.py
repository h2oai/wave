# Routing / Hash
# Use the browser's [location hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash)
# for #routing using URLs.
#
# The location hash can be accessed using `q.args['#']`.
# #location_hash
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
        q.page['nav'] = ui.markdown_card(
            box='1 1 4 2',
            title='Links!',
            content='[Spam](#menu/spam) / [Ham](#menu/ham) / [Eggs](#menu/eggs) / [About](#about)',
        )
        q.page['blurb'] = ui.markdown_card(
            box='1 3 4 2',
            title='Store',
            content='Welcome to our store!',
        )
    await q.page.save()
