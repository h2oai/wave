# Import `Site` and the `ui` module from the `telesync` package
from telesync import Site, ui

# Connect to the Telesync server.
site = Site()

# Get the web page at route '/demo'.
# If you're running this example on your local machine,
# this page will refer to http://localhost:55555/demo.
page = site['/demo']

# Add a Markdown card named `hello` to the page.
page['hello'] = ui.markdown_card(
    box='1 1 2 2',
    title='Hello World!',
    content='I am card.',
)

# Finally, sync the page to send our changes to the server.
page.sync()
