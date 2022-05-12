---
title: Image Annotator
keywords:
  - form
  - image_annotator
custom_edit_url: null
---

Use image annotator when you need to draw bounding boxes over an image. Useful for computer vision.

```py
image = 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
q.page['example'] = ui.form_card(box='1 1 9 10', items=[
    ui.image_annotator(
        name='annotator',
        title='Drag to annotate',
        image=image,
        image_height='700px',
        tags=[
            ui.image_annotator_tag(name='p', label='Person', color='$cyan'),
            ui.image_annotator_tag(name='f', label='Food', color='$blue'),
        ],
        items=[
            ui.image_annotator_item(shape=ui.image_annotator_rect(x1=649, y1=393, x2=383, y2=25), tag='p'),
        ],
    ),
    ui.button(name='submit', label='Submit', primary=True)
])
```
