---
title: Frame
keywords:
  - form
  - frame
custom_edit_url: null
---

Used for cases when you need to embed another web page within your app.

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.frame(path='https://www.h2o.ai/')
])
```

Check the API at [ui.frame](/docs/api/ui#frame).

## Custom HTML

For cases when you want to build the embedded page yourself, you can use `content` attribute that
expects your own HTML.

:::warning
One of the key advantages of Wave is zero HTML / CSS / JS knowledge. We strongly advise you to use
native Wave components and use custom HTML only as a last resort solution.
:::

```py
content = '''
<!DOCTYPE html>
<html>
<body>
  <h1>Hello World!</h1>
</body>
</html>
'''

q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.frame(content=content)
])
```

## Sizing

In addition to `width` attribute that is present on every form component, frame also provides
a way to control height via `height` attribute. It supports all the [CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units), however `%` may not always work as you
could expect so we advise to use static units like `px`, `rem` etc. instead.

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.frame(path='https://www.h2o.ai/', width='200px', height='200px')
])
```
