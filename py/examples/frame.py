# Frame
# Use a #frame card to display #HTML content.
# #form
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

page['example'] = ui.frame_card(
    box='1 1 2 2',
    title='Example',
    content=html,
)

page.save()
