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

Use `q.site.upload()` to upload files from your app to the Wave server. Use the returned paths to display download links in the browser and a `download` attribute to initiate the download process right after the click.

```py {5,7}
from h2o_wave import Q, main, app, ui

@app('/downloads')
async def serve(q: Q):
    download_path, = await q.site.upload(['results.csv'])
    q.page['download'] = ui.form_card(box='1 1 2 2', items = [
        ui.link(label='Download Results', path=download_path, download=True),
    ])
    await q.page.save()
```

See [download link](/docs/widgets/form/link/#download-link) for more info.

:::tip
`q.site.upload()` accepts a list of file paths, so you can upload multiple files at a time.
:::

Use `q.site.upload_dir()` to upload whole directories and preserve their structure. Useful when you want to host Javascript files having relative paths to other scripts for example. The function returns a list of uploaded paths and since it only takes a single directory at a time, the list is always going to have size of 1.

:::tip
`q.site.upload_dir()` is necessary only in very specific edgecases. For most of the time we recommend [serving files directly](/docs/files/#serving-files-directly-from-the-wave-server).
:::

:::warning
If running Wave on **Windows**, you might encounter a **500 internal error** during `q.site.upload` call due to lack of permissions since Wave server needs to write to your file system. The simple solution
is to start the Wave server (or `wave run your_app.py` for Wave  0.20.0) within a terminal with Admin rights (open terminal as Admin).
:::

## Serving images

Use `q.site.upload()` to upload images from your app to the Wave server. Use the returned paths in `ui.image()` or `ui.image_card().

```py
image, = await q.site.upload(['path/to/my/image.png'])
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.image(title='Image title', image=image, type='png'),
])
```

## Serving image streams

Use image streams to display images that can be updated in near real time, say for use cases such as real time object detection in videos or webcam streams. This feature lets you display an initial image on a web page, then follow up with updated images (or frames).

Use `q.site.uplink()` to stream a frame. This function returns the path to an image that can be passed to `ui.image()` or `ui.image_card()`, or any UI or HTML element that accepts an image source.

Use `q.site.unlink()` to signal the end of a stream.

```py
@app('/demo')
async def serve(q: Q):
    # Create stream by sending initial image
    path = await q.site.uplink('my_stream', 'image/jpeg', my_image)

    # Display image on page
    q.page['qux'] = ui.form_card(box='1 1 5 5', items=[ui.image('Image Stream', path=path)])
    await q.page.save()

    # Update image
    for i in range(100):
        await q.site.uplink('my_stream', 'image/jpeg', my_image)

    # Stop stream
    await q.site.unlink('my_stream')
```

See `examples/file_stream.py` for a complete example.

## Rendering documents

Use `q.site.upload()` to upload document from your app to the Wave server (or see the following section for other ways for serving files). Use the returned paths in `ui.frame()` component.

```py
q.app.document_path, = await q.site.upload(['path/to/my/document.pdf'])
q.page['example'] = ui.form_card(box='1 1 7 7', items=[
    ui.frame(path=document_path)
])
```

## Serving files directly from the Wave server

As an alternative to using the above `upload()` or `download()` mechanisms, you can make the Wave server (`waved`) directly serve the contents of one or more existing directories. If the Wave server and your app both have access to the directories on the file system, your app can simply create or copy files to the directories to make them accessible from web browsers.

Serve the contents of directory `/home/zaphod/data` at http://localhost:10101/datasets/

```
waved -public-dir /datasets/@/home/zaphod/data
```

Serve the contents of directory `/home/zaphod/data` at http://localhost:10101/datasets/, and `/home/zaphod/models` at http://localhost:10101/public/models

```
waved -public-dir /datasets/@/home/zaphod/data -public-dir /public/models/@/home/zaphod/models
```

Serve the contents of directory `/home/zaphod/data` at http://localhost:10101/datasets/, but only to authenticated users.

```
waved -private-dir /datasets/@/home/zaphod/data
```

Serve the contents of directory `/home/zaphod/data` at http://localhost:10101/datasets/, and `/home/zaphod/models` at http://localhost:10101/public/models, but only to authenticated users.

```
waved -private-dir /datasets/@/home/zaphod/data -private-dir /public/models/@/home/zaphod/models
```

Note that any number of `-public-dir` and `-private-dir` arguments are allowed.
