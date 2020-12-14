# Frame
# Use a frame card to display HTML content or external web pages.
# ---
from h2o_wave import site, ui

html = '''
<!DOCTYPE html>
<html>
<body>
  <h1>Welcome to H2O.ai</h1>
</body>
</html>
'''

page = site['/demo']

page['html_example'] = ui.frame_card(
    box='1 1 5 2',
    title='HTML Example',
    content=html,
)

page['path_example'] = ui.frame_card(
    box='1 3 5 -1',
    title='iFrame Example',
    path='https://h2o.ai',
)

page.save()
