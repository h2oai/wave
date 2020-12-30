# Form / Frame
# Use a #frame component in a #form card to display #HTML content inline.
# ---
from h2o_wave import site, ui

html = '''
<!DOCTYPE html>
<html>
<body>
  <h1>Hello World!</h1>
</body>
</html>
'''

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 2 2',
    items=[
        ui.frame(content=html, height='100px')
    ]
)

page.save()
