# Form / Text / Alignment
# Use #text align to control alignment of text.
# #form
# ---
from h2o_wave import site, ui

text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel nesciunt ab commodi pariatur fugiat sapiente?'

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 3 7',
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
        ui.separator('Various sizes - align center'),
        ui.text_xl('Extra large text', align=ui.TextXlAlign.CENTER),
        ui.text_l('Large text', align=ui.TextLAlign.CENTER),
        ui.text_m('Medium text', align=ui.TextMAlign.CENTER),
        ui.text_s('Small text', align=ui.TextSAlign.CENTER),
        ui.text_xs('Extra small text', align=ui.TextXsAlign.CENTER),
        
    ],
)
page.save()
