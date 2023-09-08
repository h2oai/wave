# Markdown Code Theme
# Pick from more than 100 themes for your code blocks.
# ---
from h2o_wave import main, app, Q, ui

# Src: https://github.com/highlightjs/highlight.js/blob/main/src/styles/atom-one-dark.css.
css = '''
.hljs {
  color: #abb2bf;
  background: #282c34;
}

.hljs-comment,
.hljs-quote {
  color: #5c6370;
  font-style: italic;
}

.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #c678dd;
}

.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #e06c75;
}

.hljs-literal {
  color: #56b6c2;
}

.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta .hljs-string {
  color: #98c379;
}

.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #d19a66;
}

.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #61aeee;
}

.hljs-built_in,
.hljs-title.class_,
.hljs-class .hljs-title {
  color: #e6c07b;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-link {
  text-decoration: underline;
}
'''


@app('/demo')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='', stylesheet=ui.inline_stylesheet(css))
    q.page['example'] = ui.markdown_card(
        box='1 1 3 4',
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

    await q.page.save()
    ''')
    await q.page.save()
