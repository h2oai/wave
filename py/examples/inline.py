# Inline
# Create an inline (horizontal) list of components.
# ---

from h2o_wave import main, app, Q, ui

all_justify = ['start', 'end', 'center', 'between', 'around']
all_align = ['start', 'end', 'center']

justify_choices = [ui.choice(opt, opt) for opt in all_justify]
align_choices = [ui.choice(opt, opt) for opt in all_align]


@app('/demo')
async def serve(q: Q):
    justify = q.args.justify if q.args.justify else 'start'
    align = q.args.align if q.args.align else 'center'

    q.page['example'] = ui.form_card(box='1 1 -1 3', items=[
        ui.inline([
            ui.choice_group(name='justify', label='justify', value=justify, choices=justify_choices, trigger=True),
            ui.choice_group(name='align', label='align', value=align, choices=align_choices, trigger=True),
        ], justify=justify, align=align)
    ])
    q.page['example2'] = ui.form_card(box='1 4 -1 3', items=[
        ui.text_xl('Header'),
        ui.inline(
            height='1',
            justify='around',
            align='center',
            items=[
                ui.inline(
                    direction='column',
                    items=[
                        ui.text_l(content='Sub title 1'),
                        ui.text(content='Lorem ipsum dolor sit amet'),
                    ]
                ),
                ui.inline(
                    direction='column',
                    items=[
                        ui.text_l(content='Sub title 2'),
                        ui.text(content='Lorem ipsum dolor sit amet'),
                    ]
                ),
                ui.inline(
                    direction='column',
                    items=[
                        ui.text_l(content='Sub title 3'),
                        ui.text(content='Lorem ipsum dolor sit amet'),
                    ]
                ),
            ]
        ),
        ui.text('Footer'),
    ])
    await q.page.save()
