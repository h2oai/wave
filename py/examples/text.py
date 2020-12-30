# Form / Text
# Use #markdown in a #text component to display formatted content within a #form.
# ---
from h2o_wave import site, ui

page = site['/demo']

sample_markdown = '''
The **quick** _brown_ fox jumped over the lazy dog.

Block quote:

> The quick brown fox jumped over the lazy dog.

Unordered list:

- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.

Ordered list:

1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.

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

page['example'] = ui.form_card(
    box='1 1 4 -1',
    items=[ui.text(sample_markdown)]
)
page.save()
