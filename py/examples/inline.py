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
    justify_current = q.args.justify if q.args.justify else 'start'
    align_current = q.args.align if q.args.align else 'center'

    q.page['example'] = ui.form_card(box='1 1 -1 3', items=[
        ui.inline([
            ui.choice_group(name='justify', label='justify', value=justify_current, choices=justify_choices, trigger=True),
            ui.choice_group(name='align', label='align', value=align_current, choices=align_choices, trigger=True),
        ], justify=justify_current, align=align_current)
    ])
    await q.page.save()
