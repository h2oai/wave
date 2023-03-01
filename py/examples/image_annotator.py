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
                image='https://images.unsplash.com/photo-1535082623926-b39352a03fb7?auto=compress&cs=tinysrgb&w=1260&h=750&q=80',
                image_height='450px',
                tags=[
                    ui.image_annotator_tag(name='v', label='Vehicle', color='$cyan'),
                    ui.image_annotator_tag(name='a', label='Animal', color='$blue'),
                ],
                items=[
                    ui.image_annotator_item(shape=ui.image_annotator_rect(x1=657, y1=273, x2=848, y2=440), tag='v'),
                    ui.image_annotator_item(tag='a', shape=ui.image_annotator_polygon([
                        ui.image_annotator_point(x=327, y=687),
                        ui.image_annotator_point(x=397, y=498),
                        ui.image_annotator_point(x=547, y=450),
                        ui.image_annotator_point(x=705, y=517),
                        ui.image_annotator_point(x=653, y=692)
                    ])),
                ],
            ),
            ui.button(name='submit', label='Submit', primary=True)
        ])
    await q.page.save()
