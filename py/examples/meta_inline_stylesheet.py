# Meta / Inline Stylesheet
# Use inline CSS to style a Wave app in case of quirks. Prefer using native Wave components if possible.
# ---

from h2o_wave import site, ui

page = site['/demo']

style = '''
p {
  color: red;
}
'''

# Add a placeholder.
page['example'] = ui.markdown_card(
    box='1 1 2 2',
    title='Try out the styling',
    content='I should be red!',
)

# Add the style to the page.
page['meta'] = ui.meta_card(box='', stylesheet=ui.inline_stylesheet(style))

page.save()
