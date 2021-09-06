---
title: Image
keywords:
  - form
  - image
custom_edit_url: null
---

Make your app come to life by including an interesting imagery.

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.image(title='Image title', path='https://www.fillmurray.com/640/360'),
])
```

## Base64

Wave also support images in [Base64](https://en.wikipedia.org/wiki/Base64) format. You need to
provide `image` with a base64 string and `type` of the image.

```py
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

q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.image(title='Image title', image=image, type='png'),
])
```

Another alternative how to make use of a Base64 images is constructing a
[data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).

```py
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

q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.image(title='Image title', path=f'data:image/png;base64,{image}'),
])
```

## Markdown

Apart from using a dedicated [ui.image](/docs/api/ui#image) component, one can also include images
using any textual component that supports Markdown. This way requires a regular image URLs (no base64).

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.text(content='![Fill Murray](https://www.fillmurray.com/640/360)')
])
```
