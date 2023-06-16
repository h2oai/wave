# Form / Image Annotator / Events / Tool Change
# Register a `tool_change` #event to emit Wave event when the drawing function is changed.
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
                events=['tool_change']
            ),
        ])
        q.page['details'] = ui.markdown_card(
            box='1 8 5 2',
            title='Selected tool',
            content='The active tool is "rect".',
        )
    else:
        if q.events.annotator:
            if q.events.annotator.tool_change:
                q.page['details'].content = f'The active tool is "{q.events.annotator.tool_change}".'
    await q.page.save()
