
# Form / Copyable Text
# Use copyable text component to enable user quick text copy pasting.
# #copyable_text
# ---
from h2o_wave import site, ui


multiline_content = '''Wave is truly awesome.
You should try all the features!'''
page = site['/demo']

page['hello'] = ui.form_card(box='1 1 3 3', items=[
    ui.copyable_text(label='Copyable text', value='Hello world!'),
    ui.copyable_text(label='Copyable text', value=multiline_content, multiline=True),
])

page.save()
