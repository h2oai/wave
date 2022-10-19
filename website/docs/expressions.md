---
title: Data-binding
---

Some cards in the Wave SDK support *data-binding expressions*, a mini language that allows computing a card's attribute from the card's data.

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

Expressions currently support only one function, `intl`, which provides language-sensitive number, date, and time formatting using the [ECMAScript Internationalization API](https://tc39.es/ecma402/).

:::tip
Options in the [Internationalization API](https://tc39.es/ecma402/) are `camelCased`, but you can use both `camelCased` and `snake_cased` options in data-binding expressions. For example, both `maximum_fraction_digits` and `maximumFractionDigits` are valid.
:::

### Formatting numbers

|         **Param**        |                                                                     **Available values**                                                                    |
|:------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
|           style          |                                                        'decimal' \| 'percent' \| 'currency' \| 'unit'                                                       |
|         currency         |                   [ISO 4217 currency codes](https://docs.1010data.com/1010dataReferenceManual/DataTypesAndFormats/currencyUnitCodes.html)                   |
|           unit           | [Available units](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier) |
|        unitDisplay       |                                                                'long' \| 'short' \| 'narrow'                                                                |
|       currencySign       |                                                                  'standard' \| 'accounting'                                                                 |
|      currencyDisplay     |                                                        'symbol' \| 'code' \| 'name' \| 'narrowSymbol'                                                       |
|         notation         |                                                   'standard' \| 'scientific' \| 'engineering' \| 'compact'                                                  |
|      compactDisplay      |                                                                      'short' \| 'long'                                                                      |
|        signDisplay       |                                                        'auto' \| 'always' \| 'never' \| 'exceptZero'                                                        |
|        useGrouping       |                                                                        true \| false                                                                        |
|   minimumIntegerDigits   |                                                                            number                                                                           |
|   minimumFractionDigits  |                                                                            number                                                                           |
|   maximumFractionDigits  |                                                                            number                                                                           |
| minimumSignificantDigits |                                                                            number                                                                           |
| maximumSignificantDigits |                                                                            number                                                                           |
|      numberingSystem     |         [Available numbering systems](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem)         |

### Formatting date

|        **Param**       |                                                             **Available values**                                                            |
|:----------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------:|
|         hour12         |                                                                true \| false                                                                |
|         weekday        |                                                        'long' \| 'short' \| 'narrow'                                                        |
|           era          |                                                        'long' \| 'short' \| 'narrow'                                                        |
|          year          |                                           'numeric' \| '2-digit' \| 'long' \| 'short' \| 'narrow'                                           |
|          month         |                                           'numeric' \| '2-digit' \| 'long' \| 'short' \| 'narrow'                                           |
|           day          |                                                            'numeric' \| '2-digit'                                                           |
|          hour          |                                                            'numeric' \| '2-digit'                                                           |
|         minute         |                                                            'numeric' \| '2-digit'                                                           |
|         second         |                                                            'numeric' \| '2-digit'                                                           |
|      timeZoneName      |                            'long' \| 'short' \| 'shortOffset' \| 'longOffset' \| 'shortGeneric'  \| 'longGeneric'                           |
|        hourCycle       |                                                       'h11' \| 'h12' \| 'h23' \| 'h24'                                                      |
|        dateStyle       |                                                   'full' \| 'long' \| 'medium' \| 'short'                                                   |
|        timeStyle       |                                                   'full' \| 'long' \| 'medium' \| 'short'                                                   |
|     numberingSystem    | [Available numbering systems](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem) |
|        calendar        |         [Available calendars](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/calendar)        |
|      formatMatcher     |                                                     "basic" \| "best fit" \| "best fit"                                                     |
|        dayPeriod       |                                                        "narrow" \| "short" \| "long"                                                        |
| fractionalSecondDigits |                                                               0 \| 1 \| 2 \| 3                                                              |

See the [official spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters) for more info.
