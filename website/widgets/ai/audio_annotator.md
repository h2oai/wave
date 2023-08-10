---
title: Audio annotator
keywords:
  - audio
  - annotator
custom_edit_url: null
---

Useful for labelling audio data.

Check the full API at [ui.audio_annotator](/docs/api/ui#audio_annotator).

```py sleep 2
q.page['example'] = ui.form_card(box='1 1 7 7', items=[
    ui.audio_annotator(
        name='annotator',
        title='Drag to annotate',
        path='/assets/examples/sample-audio.mp3',
        tags=[
            ui.audio_annotator_tag(name='f', label='Flute', color='$blue'),
            ui.audio_annotator_tag(name='d', label='Drum', color='$brown'),
        ],
        items=[
            ui.audio_annotator_item(start=0, end=10, tag='f'),
            ui.audio_annotator_item(start=10, end=20, tag='d'),
            ui.audio_annotator_item(start=20, end=30, tag='f'),
        ]
    ),
])
```
