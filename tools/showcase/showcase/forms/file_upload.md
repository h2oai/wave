---
title: File Upload 
keywords:
  - form
  - file-upload
custom_edit_url: null
---

Use this component when you wish to collect files.

You can upload files either by drag&drop or by clicking the upload button and choosing a file from
your local file system.

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.file_upload(name='file_upload', label='File Upload')
])
```

You can see the API for [ui.file_upload](/docs/api/ui#file_upload) or check the interactive example in Tour app.

## Constraints

It's common to want to allow your users to only upload files with very specific parameters, for example:

* Decide whether user should upload a single or multiple files.
* A specific file type with extensions like `pdf`, `png` etc.
* A file that is less than 50MB in size.
* In case of multiple files, make sure that total size does not exceed a specified limit.

Good news is Wave is flexible enough to support all these cases!

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.file_upload(
        name='file_upload',
        label='File Upload',
        multiple=True,
        file_extensions=['pdf'],
        max_file_size=50, # Specified in MB.
        max_size=100, # Specified in MB.
    )
])
```

## Sizing

In addition to `width` attribute that is present on every form component, file upload provides also
a way to control height via `height` attribute. It supports all the [CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units), however `%` may not always work as you
could expect so we advise to use static units like `px`, `rem` etc. instead.

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.file_upload(name='file_upload', label='File Upload', width='200px', height='200px')
])
```
