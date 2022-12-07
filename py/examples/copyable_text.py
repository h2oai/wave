
# Form / Copyable Text
# Use copyable text component to enable user quick text copy pasting.
# #copyable_text
# ---
from h2o_wave import site, ui


multiline_content = '''Wave is truly awesome.
You should try all the features!'''
big_multiline_content = '''Wave is truly awesome.
You should try all the features!
like having a big height textbox!
*
*
*
*
woohoo!'''
page = site['/demo']

page['hello'] = ui.form_card(box='1 1 3 3', items=[
    ui.copyable_text(label='Copyable text', value='Hello world!'),
    ui.copyable_text(label='Multiline Copyable text', value=multiline_content, multiline=True),
    ui.copyable_text(label='Multiline Copyable text with height', value=multiline_content, multiline=True, height='250px'),
    ui.copyable_text(label='Copyable text big height', value=big_multiline_content, multiline=True, height='1000px'),
    ui.copyable_text(label='Copyable text half height', value=big_multiline_content, multiline=True, height='500px'),
])

page.save()
