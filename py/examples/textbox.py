# Form / Textbox
# Use a #textbox to allow users to provide text inputs.
# #form
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if q.args.show_inputs:
        q.page['example'].items = [
            ui.text(f'textbox={q.args.textbox}'),
            ui.text(f'textbox_disabled={q.args.textbox_disabled}'),
            ui.text(f'textbox_readonly={q.args.textbox_readonly}'),
            ui.text(f'textbox_required={q.args.textbox_required}'),
            ui.text(f'textbox_error={q.args.textbox_error}'),
            ui.text(f'textbox_mask={q.args.textbox_mask}'),
            ui.text(f'textbox_icon={q.args.textbox_icon}'),
            ui.text(f'textbox_prefix={q.args.textbox_prefix}'),
            ui.text(f'textbox_suffix={q.args.textbox_suffix}'),
            ui.text(f'textbox_placeholder={q.args.textbox_placeholder}'),
            ui.text(f'textbox_disabled_placeholder={q.args.textbox_disabled_placeholder}'),
            ui.text(f'textbox_multiline={q.args.textbox_multiline}'),
            ui.button(name='show_form', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.textbox(name='textbox', label='Standard'),
            ui.textbox(name='textbox_disabled', label='Disabled', value='I am disabled', disabled=True),
            ui.textbox(name='textbox_readonly', label='Read-only', value='I am read-only', readonly=True),
            ui.textbox(name='textbox_required', label='Required', required=True),
            ui.textbox(name='textbox_error', label='With error message', error='I have an error'),
            ui.textbox(name='textbox_mask', label='With input mask', mask='(999) 999 - 9999'),
            ui.textbox(name='textbox_icon', label='With icon', icon='Calendar'),
            ui.textbox(name='textbox_prefix', label='With prefix', prefix='http://'),
            ui.textbox(name='textbox_suffix', label='With suffix', suffix='@h2o.ai'),
            ui.textbox(name='textbox_placeholder', label='With placeholder', placeholder='I need some input'),
            ui.textbox(name='textbox_disabled_placeholder', label='Disabled with placeholder', disabled=True,
                       placeholder='I am disabled'),
            ui.textbox(name='textbox_multiline', label='Multiline textarea', multiline=True),
            ui.button(name='show_inputs', label='Submit', primary=True),
        ])
    await q.page.save()
