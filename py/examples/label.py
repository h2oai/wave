# Form / Label
# Use labels to give a name to a component or a group of components in a #form.
# #label
# ---
from h2o_wave import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 -1',
    items=[
        ui.label(label='Standard Label'),
        ui.label(label='Required Label', required=True),
        ui.label(label='Disabled Label', disabled=True),
    ]
)
page.save()
