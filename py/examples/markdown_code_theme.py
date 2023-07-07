# Markdown Code Theme
# Pick from more than 100 themes for your code blocks.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(
        box='',
        stylesheets=[ui.stylesheet(path='https://highlightjs.org/static/demo/styles/atom-one-dark.css')]
    )
    q.page['example'] = ui.markdown_card(
        box='1 1 3 4',
        title='I was made using markdown!',
        content='''
```py
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    # Display a Hello, world! message.
    q.page['hello'] = ui.markdown_card(
        box='1 1 4 4',
        title='Hello',
        content='Hello, world!'
    )

    await q.page.save()
    ''')
    await q.page.save()
