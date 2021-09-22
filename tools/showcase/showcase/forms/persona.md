---
title: Persona
keywords:
  - form
  - persona
custom_edit_url: null
---

Can be used to display an individual's avatar (or a composition of the person’s initials on a background color), their name or identification, and online status.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.form_card(box='1 1 2 7', items=[
    ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', image=image),
])
```

Check the API at [ui.persona](/docs/api/ui#persona).

## Sizes

Wave supports a lot of text variations. This may come in handy when you want to distinguish certain parts of text from the other. For example title
should always be more prominent than subtitle which should be less prominent than content.

Default size is `m`.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.form_card(box='1 1 2 7', items=[
    ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='xs', image=image),
    ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='s', image=image),
    ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='m', image=image),
    ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='l', image=image),
    ui.persona(title='John Doe', subtitle='Data Scientist', caption='Online', size='xl', image=image),
])
```

## Initials

If you don't have any user avatar image at hand, you can simply fallback to name initials instead.

```py
q.page['example'] = ui.form_card(box='1 1 2 7', items=[
    ui.persona(title='', initials='JD', initials_color='$grey'),
])
```

## Interactivity

Persona also provides a `name` attr that makes the whole component clickable, submitting `q.args.<persona-name-attr>`
after click. Note that hash routing is supported as well.

```py
image = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=750&w=1260'
q.page['example'] = ui.form_card(box='1 1 2 7', items=[
    ui.persona(name='persona', title='Click me', size='s', image=image)
])
```
