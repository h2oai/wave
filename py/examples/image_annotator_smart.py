# Form / Image Annotator / Events
# Register the `click` and `tool_change` #events to emit Wave event when the image is clicked or a tool is changed.
# #form #annotator #image #events
# ---
from h2o_wave import main, app, Q, ui

vehicle = {'x1': 657, 'y1': 273, 'x2': 848, 'y2': 440}
animal = {'x1': 353, 'y1': 462, 'x2': 682, 'y2': 668}

vehicle_annotation_rect = ui.image_annotator_item(shape=ui.image_annotator_rect(x1=657, y1=273, x2=848, y2=440), tag='v')
vehicle_annotation_polygon = ui.image_annotator_item(tag='v', shape=ui.image_annotator_polygon([
    ui.image_annotator_point(x=663, y=415),
    ui.image_annotator_point(x=663, y=355),
    ui.image_annotator_point(x=715, y=292),
    ui.image_annotator_point(x=778, y=283),
    ui.image_annotator_point(x=835, y=297),
    ui.image_annotator_point(x=840, y=435)
]))
animal_annotation_rect = ui.image_annotator_item(shape=ui.image_annotator_rect(x1=327, y1=687, x2=705, y2=450), tag='a')
animal_annotation_polygon = ui.image_annotator_item(tag='a', shape=ui.image_annotator_polygon([
    ui.image_annotator_point(x=327, y=687),
    ui.image_annotator_point(x=397, y=498),
    ui.image_annotator_point(x=547, y=450),
    ui.image_annotator_point(x=705, y=517),
    ui.image_annotator_point(x=653, y=692)
]))


def is_inside_object(x, y, rect):
    return rect['x1'] <= x <= rect['x2'] and rect['y1'] <= y <= rect['y2']


def get_smart_annotation(x, y, active_tool):
    if is_inside_object(x, y, vehicle):
        if active_tool == 'rect': return vehicle_annotation_rect
        if active_tool == 'polygon': return vehicle_annotation_polygon
    elif is_inside_object(x, y, animal):
        if active_tool == 'rect': return animal_annotation_rect
        if active_tool == 'polygon': return animal_annotation_polygon


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized or q.args.back:
        q.client.active_tool = 'rect'
        q.page['example'] = ui.form_card(box='1 1 5 8', items=[
            ui.image_annotator(
                name='annotator',
                title='Drag to annotate',
                image='https://images.unsplash.com/photo-1535082623926-b39352a03fb7?auto=compress&cs=tinysrgb&w=1260&h=750&q=80',
                image_height='450px',
                tags=[
                    ui.image_annotator_tag(name='v', label='Vehicle', color='$cyan'),
                    ui.image_annotator_tag(name='a', label='Animal', color='$blue'),
                ],
                events=['click', 'tool_change'],
                items=[],
            ),
            ui.button(name='submit', label='Submit', primary=True)
        ])
        q.client.initialized = True
    elif q.args.submit:
        q.page['example'].items = [
            ui.text(f'annotator={q.args.annotator}'),
            ui.button(name='back', label='Back', primary=True),
        ]
    elif q.events.annotator:
        if q.events.annotator.click:
            x, y = q.events.annotator.click.values()
            q.page['example'].annotator.items = [get_smart_annotation(x, y, q.client.active_tool)]
        if q.events.annotator.tool_change:
            q.client.active_tool = q.events.annotator.tool_change
            q.page['non-existent'].items = []

    await q.page.save()
