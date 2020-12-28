# Plot / Matplotlib
# Use #matplotlib to create plots. Also demonstrates how to provide live control over plots.
# #plot
# ---
import uuid
import os
import numpy as np
import matplotlib.pyplot as plt

from h2o_wave import ui, main, app, Q

np.random.seed(19680801)


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:  # First visit
        q.client.initialized = True
        q.client.points = 25
        q.client.alpha = 50

        q.page['controls'] = ui.form_card(
            box='1 1 2 3',
            items=[
                ui.text_xl("Lets make some plots"),
                ui.slider(name='points', label='Points', min=5, max=50, step=1, value=q.client.points, trigger=True),
                ui.slider(name='alpha', label='Alpha', min=5, max=100, step=1, value=q.client.alpha, trigger=True),
            ]
        )
        q.page['plot'] = ui.markdown_card(box='3 1 2 3', title='Your plot!', content='')

    if q.args.points:
        q.client.points = q.args.points

    if q.args.alpha:
        q.client.alpha = q.args.alpha

    n = q.client.points

    # Render plot
    plt.figure(figsize=(2, 2))
    plt.scatter(
        np.random.rand(n), np.random.rand(n),
        s=(30 * np.random.rand(n)) ** 2,
        c=np.random.rand(n),
        alpha=q.client.alpha / 100.0
    )
    image_filename = f'{str(uuid.uuid4())}.png'
    plt.savefig(image_filename)

    # Upload
    image_path, = await q.site.upload([image_filename])

    # Clean up
    os.remove(image_filename)

    # Display our plot in our markdown card
    q.page['plot'].content = f'![plot]({image_path})'

    # Save page
    await q.page.save()
