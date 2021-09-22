---
title: Table 
keywords:
  - form
  - table
custom_edit_url: null
---

This table differs from a markdown table in that it supports clicking or selecting rows, provides
built-in search, sort, filter and group by. If you simply want to display a non-interactive
table of information, use a markdown table.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

You can see the API for [ui.table](/docs/api/ui#table) or check the interactive example in Tour app.

## Selection

If `multiple` is set to False (default), each row in the table is clickable. When a row is clicked,
the form is submitted automatically and `q.args.table_name` is set to `[row_name]`, where
`table_name` is the `name` of the table, and `row_name` is the `name` of the row that was clicked.

If `multiple` is set to `True`, each row in the table is selectable. A row can be selected by
clicking on it.
Multiple rows can be selected either by shift+clicking or using marquee selection. When the form
is submitted, `q.args.table_name` is set to `[row1_name, row2_name, ...]` where `table_name` is the
`name` of the table, and `row1_name`, `row2_name` are the `name` of the rows that were selected. Note
that if `multiple` is set to `True`, the form is not submitted automatically and one or more buttons in the form are
required to trigger submission.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', multiple=True, columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

When `multiple` is specified, there is an option to control when should row checkboxes be visible.
By default, they are only visible on hover. Available options are `always`, `on-hover`, `hidden`.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', checkbox_visibility='always',
        multiple=True, columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

## Preselection

If you want to see some rows preselected, use `values` attribute. Note that if this parameter is set,
multiple selections will be allowed (`multiple=True` implicitly).

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', values=['row1'], columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

## Search

As stated above, the table provides a built-in search also. Activation consists of specifying any
column as `searchable`. This way one can control which columns should affect searched results.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', columns=[
        ui.table_column(name='name', label='Name', searchable=True),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

## Filter

Similar to search if you want to take advantage of a built-in filter, just specify a column as
`filterable`. This will render a small chevron next to a column name which expands after clicking, giving
you the option to check any of the unique column values and filter the table. We advise to use filtering
only on columns that consist of a limited set of values, e.g. statuses like `RUNNING`, `PENDING`. If
you specified it on a column with any arbitrary text column, there would be too many filtering
checkboxes which would be hard to navigate for your users.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='status', label='Status', filterable=True),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Employed']),
        ui.table_row(name='row2', cells=['Alice', 'Unemployed']),
        ui.table_row(name='row3', cells=['Bob', 'Employed']),
    ])
])
```

## Group by

Another cool feature of the Wave table is group by. All it takes is to specify a `groupable` option
on table and a dropdown will render with columns on which a user can group by data.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', groupable=True, columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

## Download

Want to allow your users to download the data you just showed them via table? No problem! Simply
specify `downloadable` prop.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', downloadable=True, columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

## Reset

If you take advantage of all these built-in features, it might be a good idea to provide your users with an
escape hatch when they search / filter / groupby too much and would like to get back to original view
with ease. That's exactly what `resettable` is for.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', resettable=True, columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```

## Sizing

By default the table tries to fit all horizontal available space and use as much vertical space as
needed. For tables with > 10 rows, the initial height is `500px`.

In some cases though, it might be desirable to control the dimensions yourself via `width` and `height`
attributes. Both accept [CSS units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units),
however `%` values for height might not work as you think (especially in [flex layout](/docs/layout#flex-layout))
so we discourage its use in favor of more static units like `px` or `rem`.

```py
q.page['example'] = ui.form_card(box='1 1 3 3', items=[
    ui.table(name='table', width='200px', height='200px', columns=[
        ui.table_column(name='name', label='Name'),
        ui.table_column(name='surname', label='Surname'),
    ], rows=[
        ui.table_row(name='row1', cells=['John', 'Doe']),
        ui.table_row(name='row2', cells=['Alice', 'Smith']),
        ui.table_row(name='row3', cells=['Bob', 'Adams']),
    ])
])
```
