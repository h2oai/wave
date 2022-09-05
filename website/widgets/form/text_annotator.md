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

## With line breaks

Use the `\n` or `\r` escape characters if you wish to force the line breaks within the text.

```py
q.page['example'] = ui.form_card(box='1 1 4 10', items=[
    ui.text_annotator(
        name='annotator',
        title='Select a review to annotate',
        tags=[
            ui.text_annotator_tag(name='p', label='Positive', color='#CAEACA'),
            ui.text_annotator_tag(name='0', label='Neutral', color='#BBBBBB'),
            ui.text_annotator_tag(name='n', label='Negative', color='#F1CBCB'),
        ],
        items=[
            ui.text_annotator_item(text='Okay.\n', tag='0'),
            ui.text_annotator_item(text='Excellent work\nMasterpiece!\nA waste of money!!\nCould be a better quality.\n'),
            ui.text_annotator_item(text='Not recommending', tag='n'),
        ],
    )
])
```
