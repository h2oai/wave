# Form / Image Annotator / Events / Click
# Register the `click` #event to emit Wave event with cursor coordinates when the image is clicked.
# #form #annotator #image #events
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True
        q.page['example'] = ui.form_card(box='1 1 5 7', items=[
            ui.image_annotator(
                name='annotator',
                title='Drag to annotate',
                image='https://images.unsplash.com/photo-1535082623926-b39352a03fb7?auto=compress&cs=tinysrgb&w=1260&h=750&q=80',
                image_height='450px',
                tags=[
                    ui.image_annotator_tag(name='v', label='Vehicle', color='$cyan'),
                    ui.image_annotator_tag(name='a', label='Animal', color='$blue'),
                ],
                items=[],
                events=['click']
            ),
        ])
        q.page['details'] = ui.markdown_card(
            box='1 8 5 2',
            title='Clicked point',
            content='Nothing is clicked.',
        )
    else:
        if q.events.annotator:
            if q.events.annotator.click:
                x, y = q.events.annotator.click.values()
                q.page['details'].content = f'You clicked on x={x}, y={y}'
    await q.page.save()
