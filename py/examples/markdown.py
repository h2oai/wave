# Markdown
# Use a markdown card to display formatted content using #markdown.
# ---
from h2o_wave import site, ui, app, main, Q


sample_markdown='''
# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6
___
The **quick** __brown__ *fox* **_jumped_ over** the ~~lazy~~ _dog_.

Block quote:

> The quick brown fox jumped over the lazy dog.

Ordered list:

1. James Madison
1. James Monroe
1. John Quincy Adams

Unordered list:

- George Washington
* John Adams
+ Thomas Jefferson
+ John Doe

Nested list:

1. First list item
   - First nested list item
     - Second nested list item  

<!-- This content will not appear in the rendered Markdown -->

Ignore \*markdown\* formatting.

This framework is made by [h2o.ai](https://h2o.ai)

Image:

![Monty Python](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg)

Image caption:

<figcaption>A single track trail outside of Albuquerque, New Mexico.</figcaption>

Table: 

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |

Inline code:

Use `git status` to list all new or modified files that haven't yet been committed.


Code block:

```py
from h2o_wave import main, app, Q, ui


async def serve(q: Q):
    # Display a Hello, world! message.
    q.page['hello'] = ui.markdown_card(
        box='1 1 4 4',
        title='Hello',
        content='Hello, world!'
    )

    await q.page.save()
```

This is <sup>superscript</sup> and this is <sub>subscript</sub>!

Linking
--------------------

Search with [Google][1],
[Yahoo][2] or [MSN][3].

  [1]: http://google.com/        "Google"
  [2]: http://search.yahoo.com/  "Yahoo Search"
  [3]: http://search.msn.com/    "MSN Search"
'''

@app('/demo')
async def serve(q: Q):
    q.page['example'] = ui.markdown_card(
        box='1 1 3 9',
        title='Markdown - compact (default)',
        content=sample_markdown,
    )
    q.page['example1'] = ui.markdown_card(
            box='4 1 3 9',
            title='Markdown - regular',
            content=sample_markdown,
            compact=False
    )
    await q.page.save()
