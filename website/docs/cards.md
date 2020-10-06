---
title: Cards
---

A *card* represents a block of content on a [Page](pages.md). This section lists the different kinds of cards available to you. Each of the cards below serve a different purpose.

:::info
To learn how to add, update or remove cards from a page, see [Pages](pages.md).
:::

## Inputs

### Forms

The form card is the most versatile and commonly used card in Q apps.

Use a form card to display input [components](components.md) like textboxes, dropdowns, date-pickers, and so on. The form card displays its components one below the other, stacked vertically. You can lay out several form cards on a page to build out intricate user interfaces.

See [ui.form_card()](api/ui.md/#form_card).

## Content

Use content cards to display formatted text, images or HTML.

:::tip
You can also display each of the following types of content using a form card. Use a content card if you want to display only that specific type of content. Use a form card if you want to display content intermingled with other types of content and input components.
:::

### Markdown

Use a markdown card to display content authored in [markdown](https://guides.github.com/features/mastering-markdown/).

See [ui.markdown_card()](api/ui.md/#markdown_card).

### Template

Use a template card to display content authored using [Handlebars](https://handlebarsjs.com/guide/) templates.

See [ui.template_card()](api/ui.md/#template_card).

### Markup (HTML)

Use a markup card to display raw HTML content.

See [ui.markup_card()](api/ui.md/#markup_card).

### Inline Frame

Use a frame card to display embed external HTML content your page.

See [ui.frame_card()](api/ui.md/#frame_card).

### Image

Use an image card to display an image on your page, either by specifying the image's path or by providing base64-encoded image data.

See [ui.image_card()](api/ui.md/#image_card).

## Control

Use control cards to provide links or commands to allow users to navigate between different sections, or surface top-level actions applicable across your user interface.

### Header

Use a header card to display your app's title and icon.

See [ui.header_card()](api/ui.md/#header_card).

### Breadcrumbs
Use a breadcrumbs card to display *breadcrumbs*, a navigational aid that indicates the current page's location withing a hierarchy, and help the user understand where they are in relation to the hierarchy.

See [ui.breadcrumbs_card()](api/ui.md/#breadcrumbs_card).

### Navigation Pane

Use a navigation pane to provide links to the main content areas of your app.

See [ui.nav_card()](api/ui.md/#nav_card).

### Tabs

Use tabs to allow navigation between two or more views of content.

See [ui.tab_card()](api/ui.md/#tab_card).

### Toolbar

Use a toolbar to display top-level commands that operate on the content of your app.

See [ui.toolbar_card()](api/ui.md/#toolbar_card).

## Graphics

Use these cards to display plots (or charts or graphs), or draw custom graphics.

### Plot

Use a plot card to display visualizations defined using Q's native `plot()` API, based on the [Grammar of Graphics](https://www.springer.com/gp/book/9780387245447).

See [ui.plot_card()](api/ui.md/#plot_card).

### Vega-lite

Use this card to display visualizations defined using [Vega-Lite](https://vega.github.io/vega-lite/).

See [ui.vega_card()](api/ui.md/#vega_card).

### Graphics

Use a graphics card to render vector graphics and turtle graphics backed by [data buffers](buffers.mdx).

See [ui.graphics_card()](api/ui.md/#graphics_card).

## Stats

Use stats cards for a quick and easy way to display live values and graphics (or [sparklines](https://en.wikipedia.org/wiki/Sparkline)). These cards are backed by [data buffers](buffers.mdx), and provide an efficient mechanism to display values that change rapidly over time.

| Card | Use |
|---|---|
| [ui.small_series_stat_card()](api/ui.md/#small_series_stat_card) | Small stat card; displays a primary value and a series plot. |
| [ui.small_stat_card()](api/ui.md/#small_stat_card) | Stat card; displays a single value. |
| [ui.large_bar_stat_card()](api/ui.md/#large_bar_stat_card) | Large captioned card; displays a primary value, an auxiliary value and a progress bar, with captions for each value. |
| [ui.large_stat_card()](api/ui.md/#large_stat_card) | Stat card; displays a primary value, an auxiliary value and a caption. |
| [ui.tall_gauge_stat_card()](api/ui.md/#tall_gauge_stat_card) | Tall stat card; displays a primary value, an auxiliary value and a progress gauge. |
| [ui.tall_series_stat_card()](api/ui.md/#tall_series_stat_card) | Tall stat card; displays a primary value, an auxiliary value and a series plot. |
| [ui.wide_bar_stat_card()](api/ui.md/#wide_bar_stat_card) | Wide stat card; displays a primary value, an auxiliary value and a progress bar. |
| [ui.wide_gauge_stat_card()](api/ui.md/#wide_gauge_stat_card) | Wide stat card; displays a primary value, an auxiliary value and a progress gauge. |
| [ui.wide_series_stat_card()](api/ui.md/#wide_series_stat_card) | Wide stat card; displays a primary value, an auxiliary value and a series plot. |

## Meta

The meta card is an invisible card, primarily used to control the behavior of the page it's placed on, like displaying a desktop notification, redirecting to a different page, or turning off realtime updates.

See [ui.meta_card()](api/ui.md/#meta_card).

