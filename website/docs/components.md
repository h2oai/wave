---
title: Components
---

Components are blocks of interactive content (inputs, commands, notifications, graphics) contained in a [form card](api/ui#form_card).

:::info
Several of the components below allow users to input information or interact with them in some way. To know what the user did, see [event arguments](arguments.md).
:::

## Content

### Text
Use `text()` or one of its variants to display text content. Markdown works, too. `text_xl()` and `text_l()` support context menus.

See [ui.text()](api/ui#text) [ui.text_l()](api/ui#text_l) [ui.text_m()](api/ui#text_m) [ui.text_s()](api/ui#text_s) [ui.text_xl()](api/ui#text_xl) [ui.text_xs()](api/ui#text_xs)

### Label
Use a label to give a name or title to other components.

See [ui.label()](api/ui#label)

### Link
Use `link()` to display a hyperlink.

See [ui.link()](api/ui#link)

### Template
Use `template()` to render dynamic content using HTML. See [templates](templates.md) for syntax.

See [ui.template()](api/ui#template)

### HTML
Use `markup()` to display raw HTML.

See [ui.markup()](api/ui#markup)

### Inline frame
Use `frame()` to embed external HTML content using an inline frame.

See [ui.frame()](api/ui#frame)

### Table
Use a table to display tabular data. A table also functions as an input element, and can report row(s) selection, useful for building [master-detail](https://en.wikipedia.org/wiki/Master%E2%80%93detail_interface) views.

See [ui.table()](api/ui#table)

## Inputs

### Checkbox
Use a checkbox to allow switching between two mutually exclusive options (checked/unchecked or on/off).

See [ui.checkbox()](api/ui#checkbox)

### Checklist
Use a checklist to display a list of checkboxes.

See [ui.checklist()](api/ui#checklist)

### Choice Group
Use a choice group (also called *radio buttons*) to allow switching between more than two mutually exclusive options.

See [ui.choice_group()](api/ui#choice_group)

### Color Picker
Use a color picker to allow pick colors or swatches.

See [ui.color_picker()](api/ui#color_picker)

### Combo Box
Use a combo box to allow picking from a list of choices, or typing in custom values.

See [ui.combobox()](api/ui#combobox)

### Date Picker
Use a date picker to allow picking a date.

See [ui.date_picker()](api/ui#date_picker)

### Dropdown
Use a dropdown to allow picking from a list of choices.

See [ui.dropdown()](api/ui#dropdown)

### File Upload
Use a file upload component to allow uploading files.

See [ui.file_upload()](api/ui#file_upload)

### Picker
Use a picker component to allow picking multiple tags or labels from a list.

See [ui.picker()](api/ui#picker)

### Range Slider
Use a range slider to allow selecting a range of values within another range.

See [ui.range_slider()](api/ui#range_slider)

### Slider
Use a slider to allow selecting a value from a range of values.

See [ui.slider()](api/ui#slider)

### Spin Box
Use a spin box to allow incrementally adjusting a value in small steps.

See [ui.spinbox()](api/ui#spinbox)

### Table
Use a table to display tabular data, or allow selecting one or more rows.

See [ui.table()](api/ui#table)

### Textbox
Use a textbox to allow typing in text.

See [ui.textbox()](api/ui#textbox)

### Toggle
Use a toggle to allow switching between two mutually exclusive options (checked/unchecked or on/off), while producing an immediate result.
See [ui.toggle()](api/ui#toggle)

## Commands

### Command
Use a command to define menu items for cards and components that support menus and context-menus.

See [ui.command()](api/ui#command)

### Button
Use `button()` to display a clickable button.

See [ui.button()](api/ui#button)

### Button Set
Use `buttons()` to display two or more buttons side by side.

See [ui.buttons()](api/ui#buttons)

### Tabs
Use `tabs()` to display a set of tabs.

See [ui.tabs()](api/ui#tabs)

## Engagement

### Message Bar
Use a message bar to display information, warning and error notifications.

See [ui.message_bar()](api/ui#message_bar)

### Progress Bar
Use a progress bar to display progress information for tasks or operations.

See [ui.progress()](api/ui#progress)

### Stepper
Use a stepper to display a sequence of steps in a process, and how many have been completed.

See [ui.stepper()](api/ui#stepper)

## Graphics
### Visualization
Use `visualization()` to display visualizations defined using Q's native `plot()` API, based on the [Grammar of Graphics](https://www.springer.com/gp/book/9780387245447).

See [ui.visualization()](api/ui#visualization)

### Vega-lite Visualization
Use `vega_visualization()` to display visualization defined using [Vega-Lite](https://vega.github.io/vega-lite/).

See [ui.vega_visualization()](api/ui#vega_visualization)

## Utilities

### Expander
Use an expander to show or hider a group of related components.

See [ui.expander()](api/ui#expander)

### Separator

Use a separator to visually separate components in to groups.

See [ui.separator()](api/ui#separator)

