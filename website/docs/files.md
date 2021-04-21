---
title: Files
---

Wave provides four functions to manage files from your app:
- `ui.file_upload()` allows uploading files from the browser to the Wave server.
- `q.site.upload()` uploads files from your app to the Wave server.
- `q.site.download()` downloads a file from the Wave server to your app.
- `q.site.unload()` deletes a file from the Wave server.

## Accept file uploads

Use a file upload component (`ui.file_upload()`) to accept file uploads from the browser. Files get uploaded from the browser and get stored on the Wave server. Use `q.site.download()` to download files from the Wave server to your app.

```py {9,13}
from h2o_wave import Q, main, app, ui

@app('/uploads')
async def serve(q: Q):
    paths = q.args.datasets
    if not paths:
        q.page['example'] = ui.form_card(box='1 1 4 10', items=[
            ui.text_xl('Upload datasets'),
            ui.file_upload(name='datasets', label='Upload', multiple=True),
        ])
    else:
        for path in paths:
            local_path = await q.site.download(path, '.')
            # Do something with the file located at local_path
            # ...
    await q.page.save()
```

:::tip
After a file is uploaded from the browser, it is stored forever on the Wave server. If you don't need the file any longer, use `q.site.unload()` to delete it from the Wave server. 
:::

## Provide file downloads

Use `q.site.upload()` to upload files from your app to the Wave server. Use the returned paths to display download links in the browser.

```py {5,7}
from h2o_wave import Q, main, app, ui

@app('/downloads')
async def serve(q: Q):
    download_path, = await q.site.upload(['results.csv'])
    q.page['download'] = ui.form_card(box='1 1 2 2', items = [
        ui.link(label='Download Results', path=download_path),
    ])
    await q.page.save()
```

:::tip
`q.site.upload()` accepts a list of file paths, so you can upload multiple files at a time.
:::


