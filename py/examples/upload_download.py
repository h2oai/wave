# Uploads / UI
# Accept files from the user and downloads them locally.
# ---


import os
import os.path
from h2o_q import Q, listen, ui


def make_link_list(links_and_sizes):
    # Make a markdown list of links.
    return '\n'.join([f'- [{os.path.basename(link)} ({size} bytes)]({link})' for link, size in links_and_sizes])


async def main(q: Q):
    links = q.args.user_files
    if links:
        links_and_sizes = []
        for link in links:
            local_path = await q.site.download(link, '.')
            #
            # The file is now available locally; process the file.
            # To keep this example simple, we just read the file size.
            #
            size = os.path.getsize(local_path)
            links_and_sizes.append((link, size))

            # Clean up
            os.remove(local_path)

        q.page['example'].items = [
            ui.text_xl('Files uploaded!'),
            ui.text(make_link_list(links_and_sizes)),
            ui.button(name='back', label='Back', primary=True),
        ]
    else:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text_xl('Upload some files'),
            ui.file_upload(name='user_files', label='Upload', multiple=True),
        ])
    await q.page.save()


if __name__ == '__main__':
    listen('/demo', main)
