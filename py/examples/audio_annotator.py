# Form / Audio Annotator
# Use when you need to annotate audio.
# #form #annotator #audio
# ---
from h2o_wave import main, app, Q, ui
import os


@app('/demo')
async def serve(q: Q):
    # Upload the audio file to Wave server first.
    if not q.app.initialized:
        example_dir = os.path.dirname(os.path.realpath(__file__))
        q.app.uploaded_mp3, = await q.site.upload([os.path.join(example_dir, 'audio_annotator_sample.mp3')])
        q.app.initialized = True

    if q.args.annotator is not None:
        q.page['example'].items = [
            ui.text(f'annotator={q.args.annotator}'),
            ui.button(name='back', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 7 -1', items=[
            ui.audio_annotator(
                name='annotator',
                title='Drag to annotate',
                path=q.app.uploaded_mp3,
                tags=[
                    ui.audio_annotator_tag(name='f', label='Flute', color='$blue'),
                    ui.audio_annotator_tag(name='d', label='Drum', color='$brown'),
                ],
            ),
            ui.button(name='submit', label='Submit', primary=True)
        ])
    await q.page.save()
