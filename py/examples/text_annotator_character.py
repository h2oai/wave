# Form / TextAnnotator / Character
# Use text annotator with select autocomplete disabled to highlight text on character level.
# #form #annotator
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.annotator:
        q.page['example'].items = [
            ui.text(f'annotator={q.args.annotator}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text_annotator(
                name='annotator',
                title='Select text to annotate',
                smart_selection=False,
                tags=[
                    ui.text_annotator_tag(name='h', label='Highlight', color='#FFE52B'),
                ],
                items=[
                    ui.text_annotator_item(text='Text'),
                    ui.text_annotator_item(text='Annotator', tag='h'),
                    ui.text_annotator_item(text=' provides the ability to highlight text also on the character level.'),
                ],
            ),
            ui.button(name='submit', label='Submit', primary=True)
        ])
    await q.page.save()
