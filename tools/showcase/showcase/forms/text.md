---
title: Text
keywords:
  - form
  - text
custom_edit_url: null
---

Need to display textual content? No worries, we've got you covered.

Check the API at [ui.text](/docs/api/ui#text).

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

## Markdown

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

## Label

Despite the fact most of the form elements have label built in, controlled by an attribute, it still sometimes make sense to want your own label. One example
could be having an interactive visualization on a form that requires user input. Wave supports standard, required and disabled states.

```py
q.page['form'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.label(label='Standard Label'),
        ui.label(label='Required Label', required=True),
        ui.label(label='Disabled Label', disabled=True),
    ]
)
```

## Message bar

Message bar is a more fancy way of telling your users what's going on. Whether something finished with success or failure or to give them additional info / warning about
upcoming app maintenance. This component supports plaintext, markdown and even HTML!

```py
q.page['form'] = ui.form_card(
    box='1 1 4 6',
    items=[
        ui.message_bar(type='blocked', text='This action is blocked.'),
        ui.message_bar(type='error', text='This is an error message'),
        ui.message_bar(type='warning', text='This is a warning message.'),
        ui.message_bar(type='info', text='This is an information message.'),
        ui.message_bar(type='success', text='This is an success message.'),
        ui.message_bar(type='danger', text='This is a danger message.'),
        ui.message_bar(type='success', text='This is a **MARKDOWN** _message_.'),
        ui.message_bar(type='success', text='This is an <b>HTML</b> <i>message</i>.'),
    ]
)
```
