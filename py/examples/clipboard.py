
# Clipboard
# Use clipboard component to enable user to quickly copy paste text.
# #clipboard
# ---
from h2o_wave import site, ui

content = '''Wave is truly awesome.
You should try all the features!'''
page = site['/demo']

page['hello'] = ui.form_card(box='1 1 2 2', items=[ui.clipboard(label='Clipboard', value=content, multiline=True)])

page.save()
