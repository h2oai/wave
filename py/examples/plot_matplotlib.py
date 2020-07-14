# Plot / Matplotlib
# Use matplotlib to create plots. Also demonstrates how to provide live control over plots.
# ---
import uuid
import os
import numpy as np
import matplotlib.pyplot as plt

from telesync import ui, listen, Q

np.random.seed(19680801)


async def main(q: Q):
    if not q.client.initialized:  # First visit
        q.page['controls'] = ui.form_card(
            box='1 1 2 3',
            items=[
                ui.text_xl("Lets make some plots"),
                ui.slider(name='points', label='Points', min=5, max=50, step=1, value=25, trigger=True),
                ui.slider(name='alpha', label='Alpha', min=5, max=100, step=1, value=50, trigger=True),
            ]
        )
        q.page['plot'] = ui.markdown_card(box='3 1 2 3', title='Your plot!', content='')
        q.client.initialized = True

    if q.args.points:
        # Get arguments
        points = q.args.points
        alpha = q.args.alpha / 100.0
    else:
        points = 25
        alpha = 0.5

    # Render plot
    plt.figure(figsize=(2, 2))
    plt.scatter(
        np.random.rand(points), np.random.rand(points),
        s=(30 * np.random.rand(points)) ** 2,
        c=np.random.rand(points),
        alpha=alpha
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


listen('/demo', main)
