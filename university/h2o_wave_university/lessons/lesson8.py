# Lesson 8: Routing
# # Navigation 101
# Wave uses hash-routing mechanism which basically means that if your app listens on http://localhost:10101/demo,
# page 1 will not be at http://localhost:10101/demo/page1 but at http://localhost:10101/demo#page1 instead.
# The following example is best observed by opening a new tab and navigating to "/demo" route
# because the app's preview is not capable of displaying URL bar as well.
# 
# All it takes is to prepend a "#" symbol to the "name" attribute and you will receive the routing value at
# "q.args['#']" key. From there, you can decide which cards to remove / update / add.
# 
# See [docs](https://wave.h2o.ai/docs/routing) for more info.
# ## Your task
# Try to add support for page 4.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    q.page['header'] = ui.header_card(box='1 1 5 1', title='My app', subtitle='Routing demonstration', items=[
        ui.button(name='#page1', label='Page 1', link=True),
        ui.button(name='#page2', label='Page 2', link=True),
        ui.button(name='#page3', label='Page 3', link=True),
    ])

    # Remove previous pages.
    del q.page['page1']
    del q.page['page2']
    del q.page['page3']

    # Handle menu clicks.
    if q.args['#'] == 'page2':
        q.page['page2'] = ui.markdown_card(box='1 2 2 2', title='Page 2', content='Page 2 content')
    elif q.args['#'] == 'page3':
        q.page['page3'] = ui.markdown_card(box='1 2 2 2', title='Page 3', content='Page 3 content')
    else:
        q.page['page1'] = ui.markdown_card(box='1 2 2 2', title='Page 1', content='Page 1 content')

    await q.page.save()
