# Image
# Use an image card to display a base64-encoded #image.
# ---
from h2o_wave import site, ui
import io
import base64
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(19680801)

n = 25
plt.figure(figsize=(3, 3))
plt.scatter(
    np.random.rand(n), np.random.rand(n),
    s=(30 * np.random.rand(n)) ** 2,
    c=np.random.rand(n),
    alpha=0.5,
)

buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
image = base64.b64encode(buf.read()).decode('utf-8')

page = site['/demo']
page['example1'] = ui.image_card(
    box='1 1 3 5',
    title='An image',
    type='png',
    image=image,
)

# Another way to achieve the same result is to use a data URL for the path:
# The example below constructs the data URL from the base64-encoded
#   used in the previous example.
page['example2'] = ui.image_card(
    box='1 6 3 5',
    title='An image',
    path=f"data:image/png;base64,{image}",
)

page.save()
