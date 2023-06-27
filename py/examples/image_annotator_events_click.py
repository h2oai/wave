# Form / Image Annotator / Events / Click
# Register the `click` #event to emit Wave event with cursor coordinates when the image is clicked.
# #form #annotator #image #events
# ---
from h2o_wave import main, app, Q, ui

vehicle = {'x1': 657, 'y1': 273, 'x2': 848, 'y2': 440}


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized or q.args.back:
        q.page['example'] = ui.form_card(box='1 1 5 8', items=[
            ui.image_annotator(
                name='annotator',
                title='Click on the car and see what happens!',
                image='https://images.unsplash.com/photo-1535082623926-b39352a03fb7?auto=compress&cs=tinysrgb&w=1260&h=750&q=80',
                image_height='450px',
                allowed_shapes=['rect'],
                tags=[ui.image_annotator_tag(name='v', label='Vehicle', color='$cyan')],
                items=[],
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
        # If the click is within the vehicle's bounding box, show the vehicle.
        if vehicle['x1'] <= x <= vehicle['x2'] and vehicle['y1'] <= y <= vehicle['y2']:
            q.page['example'].annotator.items = [
                ui.image_annotator_item(shape=ui.image_annotator_rect(x1=657, y1=273, x2=848, y2=440), tag='v')
            ]
            q.page['example'].annotator.title = 'You got it!'
        else:
            q.page['example'].annotator.title = 'You missed the car!'

    await q.page.save()