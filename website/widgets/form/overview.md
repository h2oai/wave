---
title: Overview
keywords:
  - form
custom_edit_url: null
---

Forms provide a simple way of getting data from your users. This page describes attributes that are common for all of the form components.

## Setting initial values

Most of the components support the `value` attribute,
which serves for pre-populating your form items in advance. This can be useful when you know that most
of the users will pick a certain value or fill in calculated values based on other filled form fields.
It is considered a good practice and we encourage you to make your users' lives as easy as possible.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.textbox(name='textbox', label='Textbox', value='Default value')
])
```

Some components allow multiple selections. These support the `values` attribute which takes the values of the
`name` attribute chosen for each option.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.checklist(name='checklist', label='Checklist', values=['A', 'B'], choices=[
        ui.choice(name='A', label='Checked A'),
        ui.choice(name='B', label='Checked B'),
        ui.choice(name='C', label='Option C'),
    ])
])
```

:::tip
If you stumble upon an element that has one of these attributes missing and you feel like it could be needed,
don't hesitate and [start a discussion](https://github.com/h2oai/wave/discussions)!
:::

## Handling inputs immediately

By default, data is submitted to the server on a button click. However, when you want to re-render the UI
based on the most recent user input, you may want to submit the data to the server right away, and that's exactly what the `trigger` attribute
is for.

## Setting tooltips

Most of the form components include an optional `tooltip` which is supposed to be used to add extra clarification to end-users. The tooltips are
displayed as a small icon next to a form component which, upon hover, shows the specified text. Note that using too many tooltips is an antipattern and
bad UX. The best thing you can do is to make your UI labels clear without further needing to hover over icons to reveal more info. Having to make
extra clicks/hovers will just annoy your users.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.textbox(name='textbox', label='Standard', tooltip='Tooltip!')
])
```

:::warning
Some components may need refinement as for tooltips currently, this is tracked [here](https://github.com/h2oai/wave/issues/326).
:::

## Setting widths

By default, all the form components try to occupy the full card width to avoid whitespace. We consider this a good default but also
understand it might not be ideal in every case. That's where the `width` attribute comes into play which gives you full control over the horizontal size
and supports all  [CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units), e.g. `px` and `%`.

```py
q.page['form'] = ui.form_card(box='1 1 3 2', items=[
    ui.button(name='button', label='Width in px', width='300px'),
    ui.button(name='button', label='Width in %', width='50%')
])
```

## Hiding components

Need to control whether a component is shown or not? Use the `visible` attribute. Note that space is not occupied after hiding the component.

```py
q.page['example'] = ui.form_card(box='1 1 2 2', items=[
    ui.text_m(content='I am visible!'),
    ui.text_m(content='I am invisible!', visible=False),
    ui.text_m(content='I am visible!'),
])
```

## Laying out components

If placing the form components in a default top-down direction is insufficient, try looking at [ui.inline](/docs/widgets/form/inline/) component that supports various alignment and sizing options.
