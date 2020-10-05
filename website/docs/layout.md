---
title: Layout
---

This section illustrates how to lay out cards on a page.

## Grid system

By default, every page has a grid system in place, designed to fit HD displays (1920 x 1080 pixels). The grid has 12 columns and 10 rows. A column is 134 pixels wide. A row is 76 pixels high. The gap between rows and columns is set to 15 pixels. 

## The box attribute

Every card has a `box` attribute that specifies how to position the card on the page, a string of the form `'column row width height'`, for example `'1 1 2 4'` or `'8 7 3 6'`.

```py {2}
page['quote'] = ui.markdown_card(
    box='1 1 2 2',
    title='Hello World',
    content='"The Internet? Is that thing still around?" - *Homer Simpson*',
)
```
The `column` and `row` indicate which column and row to position the top-left corner of the card. The `width` and `height` indicate the width and height of the cards, respectively. The `column` and `row` are 1-based. The `width` and `height` are in spans (units) of columns or rows.

| Attribute | Value | Interpreted as |
|---|---|---|
| column | N | Nth column |
| row | N | Nth row |
| width | N | N columns wide |
| height | N | N rows high |


For example, a `box` of `1 2 3 4` is interpreted as:

| Attribute | Value | Interpreted as |
|---|---|---|
| column | 1 | 1st column |
| row | 2 | 2nd row |
| width | 3 | 3 columns wide |
| height | 4 | 4 rows high |

## Why a fixed grid?

A fixed grid like this ensures that your page layout looks exactly the same on every display, without surprises. That said, the default grid is designed to fit HD displays (1920 x 1080 pixels), so if you want your page to fit smaller displays, don't use up the entire grid. Instead, use up less columns and rows, like 8 columns x 6 rows.

## Other layout options

A fixed grid system is great for dashboards, but limiting for apps that require more flexibility, including the ability to responsively fit various display sizes. 

We are working on additional layout mechanisms, slated for release by the end of 2020.

## See also

[Positioning](examples/layout.md) and [Sizing](examples/layout-size.md) examples.

