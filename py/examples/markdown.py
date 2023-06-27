# Markdown
# Use a markdown card to display formatted content using #markdown.
# ---
from h2o_wave import site, ui

page = site['/demo']

sample_markdown = '''=
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

Table:

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |

'''

page['example'] = ui.markdown_card(
    box='1 1 3 10',
    title='I was made using markdown!',
    content=sample_markdown,
)
page['example1'] = ui.markdown_card(
    box='4 1 3 10',
    title='I was made using markdown!',
    content='''
```py
from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    # Display a Hello, world! message.
    q.page['hello'] = ui.markdown_card(
        box='1 1 4 4',
        title='Hello',
        content='Hello, world!'
    )

    await q.page`.save()
```
''',
)

page.save()
