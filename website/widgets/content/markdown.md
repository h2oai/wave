---
title: Markdown
keywords:
  - markdown
custom_edit_url: null
---

Use a markdown card to display content authored in [Markdown](https://guides.github.com/features/mastering-markdown/).

Check the full API at [ui.markdown_card](/docs/api/ui#markdown_card).

```py
sample_markdown = '''=
The **quick** _brown_ fox jumped over the lazy dog.

Blockquote:

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

q.page['example'] = ui.markdown_card(
    box='1 1 3 10',
    title='I was made using markdown!',
    content=sample_markdown
)
```

## Submit values

If you would like your markdown links to behave like Wave buttons and submit `q.args` instead of redirecting to a different URL, use the `?` prefix.

```py
q.page['example'] = ui.markdown_card(
    box='1 1 3 2',
    title='I submit q.args.fox and q.args.dog!',
    content='The quick brown [fox](?fox) jumps over the lazy [dog](?dog)'
)
```
