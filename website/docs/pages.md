---
title: Pages
---

The Wave server stores and manages content. Content is stored in a page cache, called a *site*. A Wave server contains exactly one site. A site holds a collection of *pages*. A page is composed of *cards*. Cards hold content and [data buffers](buffers.md).

## Reference

To reference a site from within a Wave script, import `site`.

```py
from h2o_wave import site
```

`site` is a dictionary-like object.

To reference the current site from within a Wave app, use `q.site`.

```py
async def serve(q: Q):
    site = q.site
```

To reference a page hosted at `/foo`, use `site['/foo']`.

```py
page = site['/foo']
```

To reference the current page in a Wave app, use `q.page`.

```py
async def serve(q: Q):
    page = q.page
```

`page` is also a dictionary-like object. To reference a card named `foo`, use `page['foo']`.

```py
card = page['foo']
```

## Add

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

## Delete

To delete a card named `foo` from a page, use `del page['foo']`:

```py
del page['foo']
```

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

To clear all cards in the active page from within a Wave app, use `q.page.drop()`:

```py
async def serve(q: Q):
    await q.page.drop()
```

## Replace

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

## Update

To avoid recreating the card from scratch, but to only update a specific attribute, use `name` attribute to get the reference to the component:

```py
q.page['example'] = ui.form_card(box='1 1 4 4', items=[
    ui.button(name='my_btn', label='Old label'),
])
q.page['example'].my_btn.label = 'New label'
```

## Save

To save a page from within a Wave script, use `page.save()`.

```py
page.save()
```

To save the active page from within a Wave app, use `q.page.save()`.

```py
async def serve(q: Q):
    await q.page.save()
```

:::caution
`q.page.save()` is an `async` function, so you must `await` while calling it.
:::

You don't need to explicitly create a new page. A page is automatically created on save if it doesn't exist.

## Control non-app pages

To update other (non-app) pages from within an app, use `AsyncSite`:

```py
from h2o_wave import Q, AsyncSite

site = AsyncSite()

async def serve(q: Q):
    page = site['/foo']
    page['bar'] = card
    await page.save()
```

## Animations (experimental)

Cards can be animated during their creation by setting `animate=True` on the `ui.meta_card`.

```py
page['meta'] = ui.meta_card(box='', animate=True)
```

:::warning
An animation is considered fluid when it is able to reach `60fps` (frames per second). To achieve such fps, one needs to make sure the browser has enough resources to paint the animation at such rate. Loading too many data or doing too much browser work may result in janky animations so use at your own risk.
:::

Default animation is a simple `fade in` animation (opacity 0 => 1) lasting for `0.5s`. if you are not happy with these defaults, it's possible to override these values via [custom CSS](/docs/custom-css/).

```css
:root {
  /* Custom CSS properties to configure duration and animation. */
  --wave-animation-duration: 0.5s;
  --wave-card-animation: wave-fade-in
}

/* Override this class to get full control over animations. */
.wave-animate-card {
  animation: var(--wave-card-animation);
  animation-duration: var(--wave-animation-duration);
}

@keyframes wave-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
```
