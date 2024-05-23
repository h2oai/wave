# Form / Text / Alignment
# Use #text align to control alignment of text.
# #form
# ---
from h2o_wave import site, ui

text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel nesciunt ab commodi pariatur fugiat sapiente?'

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 3 5',
    items=[
        ui.separator('Align - default'),
        ui.text(text),
        ui.separator('Align - start'),
        ui.text(text, align=ui.TextAlign.START),
        ui.separator('Align - end'),
        ui.text(text, align=ui.TextAlign.END),
        ui.separator('Align - center'),
        ui.text(text, align=ui.TextAlign.CENTER),
        ui.separator('Align - justify'),
        ui.text(text, align=ui.TextAlign.JUSTIFY),
    ],
)
page.save()
