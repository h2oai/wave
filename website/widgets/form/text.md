---
title: Text
keywords:
  - form
  - text
custom_edit_url: null
---

Need to display textual content? No worries, we've got you covered.

Check the full API at [ui.text](/docs/api/ui#text).

## Basic text

```py
q.page['form'] = ui.form_card(box='1 1 2 4', items=[ui.text('Normal text')])
```

## Sizes

Wave supports a lot of text variations. This may come in handy when you want to distinguish certain parts of text from the other. For example title
should always be more prominent than subtitle which should be less prominent than content.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 4',
    items=[
        ui.text_xl('Extra large text'),
        ui.text_l('Large text'),
        ui.text('Normal text'),
        ui.text_m('Medium text'),
        ui.text_s('Small text'),
        ui.text_xs('Extra small text'),
    ],
)
```

Another alternative is to use [ui.text](/docs/api/ui#text) with `size` attr. That would achieve the same effect.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 4',
    items=[
        ui.text('Extra large text', size=ui.TextSize.XL),
        ui.text('Large text', size=ui.TextSize.L),
        ui.text('Normal text'),
        ui.text('Medium text', size=ui.TextSize.M),
        ui.text('Small text', size=ui.TextSize.S),
        ui.text('Extra small text', size=ui.TextSize.XS),
    ],
)
```

## Alignment

Use the `align` attribute to control the alignment of the text being displayed. Possible values are `start`, `end`, `center` and `justify`, with the default being `start`.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 1',
    items=[ui.text('Text alignment - end', align=ui.TextAlign.END)]
)
```

The `align` attribute to is also available on all variations of text, for example [ui.text_s](/docs/api/ui#text_s).

```py
q.page['form'] = ui.form_card(
    box='1 1 2 1',
    items=[ui.text_s('Small text alignment - center', align=ui.TextSAlign.CENTER)]
)
```

## With markdown

Interested in even more text flexibility? Wave supports `Markdown` in all these components!

```py
sample_markdown = '''
The **quick** _brown_ fox jumped over the lazy dog.

Block quote:

> The quick brown fox jumped over the lazy dog.

Unordered list:

- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.

Ordered list:

1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.

Image:

![Monty Python](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg)

Links:

Here's a [link to an image](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg).

Table:

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
'''

q.page['form'] = ui.form_card(
    box='1 1 4 10',
    items=[ui.text(sample_markdown)]
)
```

Note that markdown interprets tabs as code blocks (renders text in monospace font) so that's why you should avoid them.

```py
def get_markdown():
    # Remove tabs from your string to prevent undesired effects.
    sample_markdown = '''
The **quick** _brown_ fox jumped over the lazy dog.

Block quote:

> The quick brown fox jumped over the lazy dog.

Unordered list:

- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.

Ordered list:

1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.

Image:

![Monty Python](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg)

Links:

Here's a [link to an image](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg).

Table:

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
    '''
    return sample_markdown

q.page['form'] = ui.form_card(
    box='1 1 4 10',
    items=[ui.text(get_markdown())]
)
```
