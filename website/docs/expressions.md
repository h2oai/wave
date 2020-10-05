---
title: Data-binding
---

Some cards in the Q SDK support *data-binding expressions*, a mini language that allows computing a card's attribute from the card's data.

## Rationale

A card's attribute can be set directly when created:

```py {4}
card = page.add(f'donut', ui.small_stat_card(
    box='1 1 2 2',
    title='Donut',
    value='2.99',
))
```

The attribute can be updated later using:

```py {1}
card.value = '3.49'
```

The above approach works fine, but sometimes it's prudent to separate the data (what is displayed) from the presentation (how it is displayed). This is especially important if you care about [internationalization](https://en.wikipedia.org/wiki/Internationalization_and_localization) and displaying language-sensitive number, date, and time formatting.

The above example can be rewritten by pulling the donut price out into `data`, and pointing the `value` to the `data` using an expression:

```py {4-5}
card = page.add(f'donut', ui.small_stat_card(
    box='1 1 2 2',
    title='Donut',
    value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}',
    data=dict(price=2.99),
))
```

The attribute can be update later using:

```py
card.data.price = 3.49
```

## Syntax

Data-binding expressions are indicated with a leading `=` (similar to spreadsheet formulae). For example, `'={{price}}'` is an expression, but `'{{price}}'` is not.

Placeholders are enclosed between `{{` and `}}`. The placeholder `price` in `={{price}}` points to `data.price`. If `data.price` is `2.99`:
 - `={{price}}` translates to `2.99`. 
 - `=${{price}}` translates to `$2.99`. 
 - `=Donuts cost ${{price}}` translates to `Donuts cost $2.99`. 

An expression can have multiple placeholders. For example, `={{product}} costs {{price}}`

If an expression has a placeholder and nothing else, the `{{` and `}}` can be elided. For example, `=price` is shorthand for `={{price}}`.

Functions can be applied to placeholders using the general form `{{function_name placeholder param1=arg1 param2=arg2 ...}}`. For example `{{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}` applies the formatting function `intl` to `price` with arguments `minimum_fraction_digits=2` and `maximum_fraction_digits=2`.

## Functions

Expressions currently support only one function, `intl`, which provides language-sensitive number, date, and time formatting using the [ECMAScript Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

