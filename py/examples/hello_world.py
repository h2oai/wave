# Hello World!
# A simple example to get you started with Telesync.
# ---
# Import `Site` and the `ui` module from the `telesync` package
from telesync import site, ui

# Get the web page at route '/demo'.
# If you're running this example on your local machine,
# this page will refer to http://localhost:55555/demo.
page = site['/demo']

# Add a Markdown card named `hello` to the page.
page['hello'] = ui.markdown_card(
    box='1 1 2 2',
    title='Hello World!',
    content='And now for something completely different!',
)

# Finally, sync the page to send our changes to the server.
page.save()
