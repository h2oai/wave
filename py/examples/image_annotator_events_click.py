# Form / Image Annotator / Events / Click
# Register the `click` #event to emit Wave event with cursor coordinates when the image is clicked.
# #form #annotator #image #events
# ---
from h2o_wave import main, app, Q, ui

vehicle = {'x1': 657, 'y1': 273, 'x2': 848, 'y2': 440}
animal = {'x1': 353, 'y1': 462, 'x2': 682, 'y2': 668}

vehicle_annotation_rect = ui.image_annotator_item(shape=ui.image_annotator_rect(x1=657, y1=273, x2=848, y2=440), tag='v')
animal_annotation_rect = ui.image_annotator_item(shape=ui.image_annotator_rect(x1=327, y1=687, x2=705, y2=450), tag='a')

def is_inside_object(x, y, rect):
    return rect['x1'] <= x <= rect['x2'] and rect['y1'] <= y <= rect['y2']


def get_smart_annotation(x, y):
    if is_inside_object(x, y, vehicle): return vehicle_annotation_rect
    elif is_inside_object(x, y, animal): return animal_annotation_rect


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized or q.args.back:
        q.page['example'] = ui.form_card(box='1 1 5 8', items=[
            ui.image_annotator(
                name='annotator',
                title='Try annotating the car and see what happens!',
                image='https://images.unsplash.com/photo-1535082623926-b39352a03fb7?auto=compress&cs=tinysrgb&w=1260&h=750&q=80',
                image_height='450px',
                tags=[ui.image_annotator_tag(name='v', label='Vehicle', color='$cyan')],
                items=[],
                allowed_shapes=['rect'],
                events=['click'],
            ),
            ui.button(name='submit', label='Submit', primary=True)
        ])
        q.client.initialized = True
    if q.args.submit:
        q.page['example'].items = [
            ui.text(f'annotator={q.args.annotator}'),
            ui.button(name='back', label='Back', primary=True),
        ]
    if q.events.annotator and q.events.annotator.click:
            x, y = q.events.annotator.click.values()
            smart_annotation = get_smart_annotation(x, y)
            if smart_annotation:
                q.page['example'].annotator.items = [smart_annotation]
            else: 
                q.page['non-existent'].items = []

    await q.page.save()
