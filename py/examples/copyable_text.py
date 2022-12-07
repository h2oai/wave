
# Form / Copyable Text
# Use copyable text component to enable user quick text copy pasting.
# #copyable_text
# ---
from h2o_wave import site, ui


multiline_content = '''Wave is truly awesome.
You should try all the features!'''
big_multiline_content = '''Wave is truly awesome.
You should try all the features!
Like having a big height textbox!
...
...
...
...
Woohoo!'''
page = site['/demo']

page['hello'] = ui.form_card(box='1 1 3 3', items=[
    ui.copyable_text(label='Copyable text', value='Hello world!'),
    ui.copyable_text(label='Multiline Copyable text', value=multiline_content, multiline=True),
    ui.copyable_text(label='Multiline Copyable text with height=200px', value=big_multiline_content, multiline=True, height='200px'),
])

page.save()
