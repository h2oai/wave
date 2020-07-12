# Form / File Upload
# Use a file upload component to allow users to upload files.
# ---
from telesync import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 10',
    items=[
        ui.file_upload(name='file_upload', label='Upload!')
    ]
)

page.save()
