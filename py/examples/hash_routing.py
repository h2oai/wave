# Hash Routing
# This example demonstrates how you can observe and handle changes to the browser's
# [location hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash)
#
# The location hash can be accessed using `q.args['#']`.
# ---
from telesync import Q, listen, ui, site


async def main(q: Q):
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
            box='1 1 4 1',
            title='Links!',
            content='[Spam](#menu/spam) | [Ham](#menu/ham) | [Eggs](#menu/eggs) | [About](#about)',
        )
        q.page['blurb'] = ui.markdown_card(
            box='1 2 4 2',
            title='Store',
            content='Welcome to our store!',
        )
    await q.page.push()


if __name__ == '__main__':
    listen('/demo', main)
