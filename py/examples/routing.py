# Routing
# Use `on` and `handle_on` to simplify query handling by #routing queries to designated functions.
# ---
from h2o_wave import main, app, Q, ui, on, handle_on


# This function is called when q.args['empty_cart'] is True.
@on(arg='empty_cart')
async def clear_cart(q: Q):
    q.page['cart'].items[0].text.content = 'Your cart was emptied!'
    await q.page.save()


# If the name of the function is the same as that of the q.arg, simply use on().
# This function is called when q.args['buy_now'] is True.
@on()
async def buy_now(q: Q):
    q.page['cart'].items[0].text.content = 'Nothing to buy!'
    await q.page.save()


# This function is called when q.args['#'] is 'about'.
@on(arg='#about')
async def handle_about(q: Q):
    q.page['blurb'].content = 'Everything here is gluten-free!'
    await q.page.save()


# This function is called when q.args['#'] is 'menu/spam', 'menu/ham', 'menu/eggs', etc.
# The 'product' placeholder's value is passed as an argument to the function.
@on(arg='#menu/{product}')
async def handle_menu(q: Q, product: str):
    q.page['blurb'].content = f"Sorry, we're out of {product}!"
    await q.page.save()


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        q.page['nav'] = ui.markdown_card(
            box='1 1 4 2',
            title='Menu',
            content='[Spam](#menu/spam) / [Ham](#menu/ham) / [Eggs](#menu/eggs) / [About](#about)',
        )
        q.page['blurb'] = ui.markdown_card(
            box='1 3 4 2',
            title='Description',
            content='Welcome to our store!',
        )
        q.page['cart'] = ui.form_card(
            box='1 5 4 2',
            title='Cart',
            items=[
                ui.text('Your cart is empty!'),
                ui.buttons([
                    ui.button(name=buy_now.__name__, label='Buy Now!', primary=True),
                    ui.button(name='empty_cart', label='Clear cart'),
                ])
            ],
        )
        await q.page.save()
    else:
        await handle_on(q)
