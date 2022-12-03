# Form / Image Annotator
# Use when you need to annotate images.
# #form #annotator #image
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.annotator is not None:
        q.page['example'].items = [
            ui.text(f'annotator={q.args.annotator}'),
            ui.button(name='back', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 5 8', items=[
            ui.image_annotator(
                name='annotator',
                title='Drag to annotate',
                image='https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                image_height='450px',
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
    await q.page.save()
