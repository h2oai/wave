---
title: Frame
keywords:
  - form
  - frame
custom_edit_url: null
---

Used for cases when you need to embed another web page within your app.

The `name` attribute indicates how to reference this component in the query arguments: `q.args.<name-attr>`.

Check the full API at [ui.frame](/docs/api/ui#frame).

## Basic frame

```py
q.page['example'] = ui.form_card(box='1 1 7 7', items=[
    ui.frame(path='https://example.com', height='600px')
])
```

## With document

The frame is also a preffered way for displaying documents. Simply provide a path to the PDF file.

![sample document render](/img/widgets/frame_document.png)

```py ignore
q.page['example'] = ui.form_card(box='1 1 7 7', items=[
    ui.frame(path='/assets/examples/sample-document.pdf')
])
```

## With custom HTML

For cases when you want to build the embedded page yourself, you can use the `content` attribute that
expects your HTML.

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

## Setting width and height

In addition to the `width` attribute that is present on every form component, the frame also provides
a way to control height via the `height` attribute. It supports all the [CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units), however `%` may not always work as you
could expect so we advise using static units like `px`, `rem` etc. instead.

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.frame(path='https://example.com', width='200px', height='200px')
])
```
