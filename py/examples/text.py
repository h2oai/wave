# Text
# Use text elements, markup and markdown to display formatted content within an app.
# ---
from h2o_wave import main, app, Q, ui

html = '''
<ol>
    <li>Spam</li>
    <li>Ham</li>
    <li>Eggs</li>
</ol>
'''

sample_markdown = '''
The **quick** _brown_ fox jumped over the lazy dog.

Image:

![Monty Python](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg)

Links:

Here's a [link to an image](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg).

Table:

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
'''

# Use a header card to display a page header.
# Change the icon using icon names from https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
header_card = ui.header_card(
    box='1 1 5 1',
    title='Text Elements',
    subtitle='Use text elements, markup and markdown to display formatted content within an app.',
    icon='TextBox',
    icon_color='$yellow')


@app('/demo')
async def serve(q: Q):
    # Add a header
    q.page.add('header', header_card)

    # Add a form card to display different text elements
    q.page['text_example'] = ui.form_card(box='1 2 5 -1', items=[
        ui.text_xl(content='Text Options'),
        ui.text_l(content='Available sizes of text:'),
        ui.text_xl(content='text_xl: Extra large text'),
        ui.text_l(content='text_l: Large text'),
        ui.text('text: Normal text'),
        ui.text_m(content='text_m: Medium text'),
        ui.text_s(content='text_s: Small text'),
        ui.text_xs(content='text_xs: Extra small text'),

        # Using `ui.text()` with a `size` argument produces similar results:
        ui.text_l(content='Another way of doing the same:'),
        ui.text('Extra large text', size=ui.TextSize.XL),
        ui.text('Large text', size=ui.TextSize.L),
        ui.text('Normal text'),
        ui.text('Medium text', size=ui.TextSize.M),
        ui.text('Small text', size=ui.TextSize.S),
        ui.text('Extra small text', size=ui.TextSize.XS),

        ui.separator(label='Separator'),
        ui.text_xl(content='Labels'),
        ui.label(label='Standard Label'),
        ui.label(label='Required Label', required=True),
        ui.label(label='Disabled Label', disabled=True),

        # Use links to allow navigation to internal and external URLs.
        ui.separator(label='Separator'),
        ui.text_xl(content='Links'),
        ui.link(label='Internal link', path='/starred'),
        ui.link(label='Internal link, new tab', path='/starred', target=''),
        ui.link(label='Internal link, new tab', path='/starred', target='_blank'),  # same as target=''
        ui.link(label='Internal link, disabled', path='/starred', disabled=True),
        ui.link(label='External link', path='https://h2o.ai'),
        ui.link(label='External link, new tab', path='https://h2o.ai', target=''),
        ui.link(label='External link, new tab', path='https://h2o.ai', target='_blank'),  # same as target=''
        ui.link(label='External link, disabled', path='https://h2o.ai', disabled=True),

        ui.separator(label='Separator'),
        ui.text_xl(content='Markup'),
        ui.markup(content=html),

        # Use a markdown card or the text element to display formatted content using markdown.
        ui.separator(label='Separator'),
        ui.text_xl(content='Markdown'),
        ui.text(sample_markdown)
    ])

    await q.page.save()
