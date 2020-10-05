---
title: Pages
---

The Q server stores and manages content. Content is stored in a page cache, called a *site*. A Q server contains exactly one site. A site holds a collection of *pages*. A page is composed of *cards*. Cards hold content and [data buffers](./buffers.md).

To reference a site from within a Q script, import `site`.

```py 
from h2o_q import site
```

`site` is a dictionary-like object. 

To reference the current site from within a Q app, use `q.site`.

```py
async def serve(q: Q):
    site = q.site
```

To reference a page hosted at `/foo`, use `site['/foo']`.

```py
page = site['/foo']
```

To reference the current page in a Q app, use `q.page`.

```py
async def serve(q: Q):
    page = q.page
```

`page` is also a dictionary-like object. To reference a card named `foo`, use `page['foo']`.

```py
card = page['foo']
```
There are two ways to add a card to a page.

The first way is to assign a new card to `page['foo']`.

```py
page['foo'] = card
```

The second way is to use `page.add()`. This is useful when you want to add a card to a page and obtain a reference to the new card.

```py
card = page.add('foo', card)
```

The following two forms are equivalent. The second form is more concise.

```py
page['foo'] = ui.form_card(...)
card = page['foo']
```

```py 
card = page.add('foo', ui.form_card(...)
```

To delete a card named `foo` from a page, use `del page['foo']`:
```py 
del page['foo']
```

Assigning a card to `page['foo']` replaces any previously assigned card named `foo`. Therefore, the following two forms are equivalent. The second form is more concise, hence preferred.

```py
page['foo'] = card1
del page['foo']
page['foo'] = card2
```

```py
page['foo'] = card1
page['foo'] = card2
```

To save a page from within a Q script, use `page.save()`.

```py
page.save()
```

To save the active page from within a Q app, use `q.page.save()`. 

```py
async def serve(q: Q):
    await q.page.save()
```

:::caution
`q.page.save()` is an `async` function, so you must `await` while calling it.
:::

You don't need to explicitly create a new page. A page is automatically created on save if it doesn't exist.

To delete the page hosted at `/foo`, use `page.drop()` or `del site['/foo']`. The following three forms are equivalent.

```py
page = site['/foo']
page.drop()
```

```py
site['/foo'].drop()
```

```py
del site['/foo'] 
```

Deleting a page automatically drops all cards associated with that page. Conversely, to delete all cards from a page, simply delete the page.

To clear all cards in the active page from within a Q app, use `q.page.drop()`:

```py
async def serve(q: Q):
    await q.page.drop()
```

