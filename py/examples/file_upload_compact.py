# Form / File Upload / Compact
# Use a compact file #upload component to take less form space.
# #form #file_upload #compact
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    if 'file_upload' in q.args:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text(f'file_upload={q.args.file_upload}'),
            ui.button(name='show_upload', label='Back', primary=True),
        ])
    else:
        q.page['example'] = ui.form_card(
            box='1 1 4 10',
            items=[
                ui.file_upload(name='file_upload', label='Select one or more files to upload', compact=True,
                               multiple=True, file_extensions=['jpg', 'png'], max_file_size=1, max_size=15),
                ui.button(name='submit', label='Submit', primary=True)
            ]
        )
    await q.page.save()
