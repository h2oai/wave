# Markdown
# Use a markdown card to display formatted content using #markdown.
# ---
from h2o_wave import site, ui

page = site['/demo']

sample_markdown = '''=
```typescript
const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
    },
    body: {
      flexGrow: 1,
    },
    markdown: {
      $nest: {
        '&>*:first-child': {
          marginTop: 0
        },
        '&>*:last-child': {
          marginBottom: 0
        },
        a: {
          color: cssVar('$themePrimary'),
          $nest: {
            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
        table: {
          width: pc(100),
          borderCollapse: 'collapse',
        },
        tr: {
          borderBottom: border(1, cssVar('$text5')),
        },
        th: {
          padding: padding(11, 6),
          textAlign: 'left',
        },
        td: {
          padding: padding(11, 6),
        },
        img: {
          maxWidth: '100%',
          maxHeight: '100%',
        },
      },
    },
  })
```

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
    box='1 1 4 10',
    title='I was made using markdown!',
    content=sample_markdown,
)
page.save()
