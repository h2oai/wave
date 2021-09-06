---
title: Overview
keywords:
  - form
custom_edit_url: null
---

Forms provide a simple way for getting data from your users. This page describes attributes that are common for all the form components.

## Data submission

By default, the data is submitted to the server on a button click. However, when you want to rerender UI
based on most recent user input, you may want to submit the data to server right away and that's exactly what `trigger` attribute
is for.

## Default values

Most of the components support `value` attribute
which serves for prepopulating your form items in advance. This can be useful when you know that most
of the users will pick a certain value or to fill in calculated values based on other filled form fields.
It is considered a good practice and we encourage you to make your users lives as easy as possible.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.textbox(name='textbox', label='Textbox', value='Default value')
])
```

Some components allow multiple selections. These support `values` attribute which takes values of
`name` attribute chosen for each option.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.checklist(name='checklist', label='Checklist', values=['A', 'B'], choices=[
        ui.choice('A', 'Checked A'),
        ui.choice('B', 'Checked B'),
        ui.choice('C', 'Option C'),
    ])
])
```

:::tip
If you stumble upon an element that has one of these props missing and you feel like it could be needed,
don't hesitate and [start a discussion](https://github.com/h2oai/wave/discussions)!
:::

## Visibility

Need to control whether a component is shown or not? Use `visible` attribute. Note that space is not occupied after hiding the component.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.text_m(content='I am visible!'),
    ui.text_m(content='I am invisible!', visible=False),
    ui.text_m(content='I am visible!'),
])
```

## Sizing

By default, all the form components try to occupy all the card width so as to avoid whitespace. We consider this a good default, but
understand it might not be feasible in every case. That's where `width` comes into play which gives you full control over horizontal size
and supports all  [CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units), e.g. `px` and `%`.

```py
q.page['form'] = ui.form_card(box='1 1 3 2', items=[
    ui.button(name='button', label='Width in px', width='300px'),
    ui.button(name='button', label='Width in %', width='50%')
])
```

## Tooltips

Most of the form components include optional `tooltip` which is supposed to be used to add extra clarification to users when needed. The tooltips are
displayed as a small icon next to a form component which, upon hover, shows the specified text. Note that using too much tooltips is antipattern and
bad UX. The best thing you can do is to make your UI labels clear without further need to hover over icons to reveal more info. Having to make
extra clicks / hovers will just annoy your users.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.textbox(name='textbox', label='Standard', tooltip='Tooltip!')
])
```

:::warning
Some components may need refinement as for tooltips currently, tracked [here](https://github.com/h2oai/wave/issues/326).
:::
