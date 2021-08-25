# Meta / Stylesheet
# Load external CSS resources if needed.
# ---

from h2o_wave import site, ui

page = site['/demo']

# Add a placeholder.
page['example'] = ui.markup_card(
    box='1 1 2 2',
    title='This button should have Bootstrap styles.',
    content='<button type="button" class="btn btn-primary">Primary</button>',
)

page['meta'] = ui.meta_card(
    box='',
    # Load external stylesheet.
    stylesheets=[ui.stylesheet(path='https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css')]
)

page.save()
