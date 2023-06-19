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
            ui.image_annotator_item(tag='p', shape=ui.image_annotator_polygon([
                ui.image_annotator_point(x=828.2142857142857, y=135),
                ui.image_annotator_point(x=731.7857142857142, y=212.14285714285714),
                ui.image_annotator_point(x=890.3571428571429, y=354.6428571428571),
                ui.image_annotator_point(x=950.3571428571429, y=247.5)
            ])),
        ],
    ),
    ui.button(name='submit', label='Submit', primary=True)
])
```

## Allowing only certain drawing shapes

You can use the `allowed_shapes` attribute to limit the available shapes your users might use. The attribute takes a list of strings (either 'rect' or 'polygon'). If not specified, the annotator allows every supported shape.

```py
image = 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
q.page['example'] = ui.form_card(box='1 1 9 10', items=[
    ui.image_annotator(
        name='annotator',
        title='Drag to annotate',
        image=image,
        image_height='700px',
        allowed_shapes=['rect'],
        tags=[
            ui.image_annotator_tag(name='p', label='Person', color='$cyan'),
            ui.image_annotator_tag(name='f', label='Food', color='$blue'),
        ],
        items=[
            ui.image_annotator_item(shape=ui.image_annotator_rect(x1=649, y1=393, x2=383, y2=25), tag='p'),
            ui.image_annotator_item(tag='p', shape=ui.image_annotator_polygon([
                ui.image_annotator_point(x=828.2142857142857, y=135),
                ui.image_annotator_point(x=731.7857142857142, y=212.14285714285714),
                ui.image_annotator_point(x=890.3571428571429, y=354.6428571428571),
                ui.image_annotator_point(x=950.3571428571429, y=247.5)
            ])),
        ],
    ),
    ui.button(name='submit', label='Submit', primary=True)
])
```

## Supported keyboard shortcuts

The legend can be brought up by clicking the Info icon in the top right toolbar.

|         **Key**          |                         **Description**                       |
|:------------------------:|:-------------------------------------------------------------:|
|          **a**           |                        Select all shapes                      |
|          **c**           |                      Copy selected shapes                     |
|          **v**           |                      Paste selected shapes                    |
|          **d**           |                     Delete selected shapes                    |
|    **Shift + Click**     |       Select multiple shapes when in the selection mode       |
| **Arrow keys (↑ ↓ → ←)** | Move selected shapes by 1px (or 10px while holding Shift key) |
|  **Ctrl + Mouse wheel**  |                          Zoom in/out                          |
|        **Enter**         |                    Finish drawing polyshape                   |
|      **Backspace**       |                  Delete last polyshape vertex                 |
|         **Esc**          |                      Cancel ongoing task                      |
|          **l**           |                          Toggle label                         |
|          **b**           |                    Toggle drawing function                    |
|          **r**           |                     Select rectangle tool                     |
|          **p**           |                       Select polygon tool                     |
|          **s**           |                     Activate selection tool                   |

## Click event

Sometimes you may want to handle the annotating yourself and this is where `click` event comes into place. By setting `events=['click']` prop, the event containing cursor `x` and `y` coordinates is fired everytime you click on the image while `rect` or `polygon` tool is selected, e.g. `{x: 100, y: 120}`. The event can be accessed through `q.events.<image_annotator_name>.click`, where `image_annotator_name` is the `name` attribute of the image annotator component.

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
        items=[],
        events=['click']
    ),
    ui.button(name='submit', label='Submit', primary=True)
])
```

## Tool change event

When handling the annotating yourself with the use of [click event](#click-event), you may also want to know the tool you are currently using. By setting `events=['tool_change']` prop, the event containing the name of the tool is fired everytime you choose the `rect`, `polygon` or `select` tool. The event can be accessed through `q.events.<image_annotator_name>.tool_change`, where `image_annotator_name` is the `name` attribute of the image annotator component.

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
        items=[],
        events=['tool_change']
    ),
    ui.button(name='submit', label='Submit', primary=True)
])
```
