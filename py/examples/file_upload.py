# Form / File Upload
# Use a file upload component to allow users to upload files.
# ---
from h2o_q import site, ui

page = site['/demo']

page['example'] = ui.form_card(
    box='1 1 4 10',
    items=[
        ui.file_upload(name='file_upload', label='Upload!', multiple=True,
        file_extensions=['csv', 'gz'], max_file_size=10, max_size=15)
    ]
)

page.save()
