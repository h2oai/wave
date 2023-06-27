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

## Code blocks syntax highlighting

```py
sample_markdown = '''=
```html
<!DOCTYPE html>
<title>Title</title>

<style>body {width: 500px;}</style>

<script type="application/javascript">
  function $init() {return true;}
</script>

<body>
  <p checked class="title" id='title'>Title</p>
  <!-- here goes the rest of the page -->
</body>
'''

q.page['example'] = ui.markdown_card(
    box='1 1 4 4',
    title='I was made using markdown!',
    content=sample_markdown
)
```

Displaying code with proper syntax highlighting is supported out of the box. The list of supported languages can be found [here](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md).

Wave uses [AndroidStudio](https://developer.android.com/studio) theme as default, but can be changed by picking one of the plenty [other themes](https://highlightjs.org/static/demo/), downloading its [CSS](https://github.com/highlightjs/highlight.js/tree/main/src/styles) and loading it within the Wave app. See [this example](/docs/examples/markdown-code-theme) to learn how to change the code highlighting theme into a popular `Atom One Dark`.
