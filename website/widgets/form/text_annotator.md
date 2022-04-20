---
title: Text Annotator
keywords:
  - form
  - text_annotator
custom_edit_url: null
---

Use text annotator when you need to highlight text phrases. Useful for NLP.

```py
q.page['example'] = ui.form_card(box='1 1 4 10', items=[
    ui.text_annotator(
        name='annotator',
        title='Select text to annotate',
        tags=[
            ui.text_annotator_tag(name='p', label='Person', color='#F1CBCB'),
            ui.text_annotator_tag(name='o', label='Org', color='#CAEACA'),
        ],
        items=[
            ui.text_annotator_item(text='Killer Mike', tag='p'),
            ui.text_annotator_item(text=' is a member, of the hip hop supergroup '),  # no tag
            ui.text_annotator_item(text='Run the Jewels', tag='o'),
        ],
    )
])
```

## Readonly

If you wish to prevent user interaction with annotator component, set `readonly` attribute to `True`.

```py
q.page['example'] = ui.form_card(box='1 1 4 10', items=[
    ui.text_annotator(
        name='annotator',
        title='Select text to annotate',
        readonly=True,
        tags=[
            ui.text_annotator_tag(name='p', label='Person', color='#F1CBCB'),
            ui.text_annotator_tag(name='o', label='Org', color='#CAEACA'),
        ],
        items=[
            ui.text_annotator_item(text='Killer Mike', tag='p'),
            ui.text_annotator_item(text=' is a member, of the hip hop supergroup '),  # no tag
            ui.text_annotator_item(text='Run the Jewels', tag='o'),
        ],
    )
])
```
