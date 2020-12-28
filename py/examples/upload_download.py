# Uploads / Download
# Accept files from the user and downloads them locally.
# #upload #download
# ---


import os
import os.path
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    links = q.args.user_files
    if links:
        items = [ui.text_xl('Files uploaded!')]
        for link in links:
            local_path = await q.site.download(link, '.')
            #
            # The file is now available locally; process the file.
            # To keep this example simple, we just read the file size.
            #
            size = os.path.getsize(local_path)

            items.append(ui.link(label=f'{os.path.basename(link)} ({size} bytes)', download=True, path=link))
            # Clean up
            os.remove(local_path)

        items.append(ui.button(name='back', label='Back', primary=True))
        q.page['example'].items = items
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text_xl('Upload some files'),
            ui.file_upload(name='user_files', label='Upload', multiple=True),
        ])
    await q.page.save()
