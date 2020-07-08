# Form / File Upload
# No description available.
# ---
from telesync import site, ui

page = site['/demo']

page['hello'] = ui.form_card(
    box='1 1 4 10',
    items=[
      ui.file_upload(name='file_upload', label='Upload a file')
    ]
)

page.sync()
