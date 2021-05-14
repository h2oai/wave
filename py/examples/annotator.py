# Form / Annotator
# Use annotator when you need to highlight text phrases.
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
            ui.annotator(
                name='annotator',
                tags=[
                    ui.annotator_tag(name='p', label='Person', color='#D33A2C99'),
                    ui.annotator_tag(name='o', label='Org', color='#4CAF5099'),
                ],
                items=[
                    ui.annotator_item(text='Killer Mike', tag='p'),
                    ui.annotator_item(text=' is a member, of the hip hop supergroup '),  # no tag
                    ui.annotator_item(text='Run the Jewels', tag='o'),
                ],
            ),
            ui.button(name='submit', label='Submit', primary=True)
        ])
    await q.page.save()
