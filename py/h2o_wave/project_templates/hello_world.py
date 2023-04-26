from h2o_wave import main, app, Q, ui

# Listen on the root ('/') route - http://localhost:10101 with default settings.
@app('/')
async def serve(q: Q):
    # First time a browser comes to the app
    if not q.client.initialized:
        # Setup counter state.
        q.client.count = 0
        # Web app metadata.
        q.page['meta'] = ui.meta_card(
            box='',
            # Tab title.
            title='Welcome to Wave',
            # Layout definitions.
            layouts=[
                ui.layout(
                    breakpoint='xs',
                    min_height='100vh',
                    max_width='1200px',
                    zones=[
                        ui.zone('content', size='1'),
                        ui.zone('footer'),
                    ]
                )
            ]
        )
        content='''
# 👋 Welcome to H2O Wave

This is a toy example for you to play around and show you the base concepts like:

* How to paint UI.
* How to handle interactivity (e.g. button click).
* How to work with application state.

You can edit **app.py** file, hit save and the app will automatically reload. Once you are done with playing around and want to get deeper knowledge of the framework itself, visit the [docs](https://wave.h2o.ai/) to learn more.

## ✨ Interactivity

Wave interactivity model is very simple: Every widget that is capable of user interaction populates a python q.args dictionary that developer can later handle in code. See the counter example in this app.

## 🆘 Asking for help

If you have any questions, please reach out to [Github Discussions](https://github.com/h2oai/wave/discussions) or our [Discord server](https://discord.gg/GsyvWgzevv).
'''
        # Render app body.
        q.page['body'] = ui.tall_article_preview_card(
            box='content',
            title='',
            image='https://wave.h2o.ai/img/blog-preview.png',
            content=content,
            items=[ui.button(name='counter', label=f'Current count: {q.client.count}')]
        )
        q.page['footer'] = ui.footer_card(
            box='footer',
            caption='Made with 💛 using [H2O Wave](https://wave.h2o.ai).'
        )

        q.client.initialized = True

    # Handle counter button click.
    if q.args.counter:
        # Update state
        q.client.count += 1
        # Update the button label.
        q.page['body'].counter.label = f'Current count: {q.client.count}'

    await q.page.save()
