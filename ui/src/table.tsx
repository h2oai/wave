import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, S, qd } from './qd';

/** Create a table column. */
interface TableColumn {
  /** An identifying name for this column. */
  name: S
  /** The text displayed on the column header. */
  label: S
}

/** Create a table row. */
interface TableRow {
  /** An identifying name for this row. */
  name: S
  /** The cells in this row (displayed left to right). */
  cells: S[]
}

/**
 * Create an interactive table.
 *
 * This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
 * display a non-interactive table of information, use a markdown table.
 *
 * If `multiple` is set to False (default), each row in the table is clickable. When a row is clicked, the form is
 * submitted automatically, and `q.args.table_name` is set to `[row_name]`, where `table_name` is the `name` of
 * the table, and `row_name` is the `name` of the row that was clicked on.
 *
 * If `multiple` is set to True, each row in the table is selectable. A row can be selected by clicking on it.
 * Multiple rows can be selected either by shift+clicking or using marquee selection. When the form is submitted,
 * `q.args.table_name` is set to `[row1_name, row2_name, ...]` where `table_name` is the `name` of the table,
 * and `row1_name`, `row2_name` are the `name` of the rows that were selected. Note that if `multiple` is
 * set to True, the form is not submitted automatically, and one or more buttons are required in the form to trigger
 * submission.
 */
export interface Table {
  /** An identifying name for this component. */
  name: S
  /** The columns in this table. */
  columns: TableColumn[]
  /** The rows in this table. */
  rows: TableRow[]
  /** True to allow multiple rows to be selected. */
  multiple?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XTable = bond(({ model: m }: { model: Table }) => {
    qd.args[m.name] = []
    const
      items = m.rows.map(r => {
        const item: any = { __key__: r.name }
        for (let i = 0, n = r.cells.length; i < n; i++) {
          const col = m.columns[i]
          item[col.name] = r.cells[i]
        }
        return item
      }),
      columns = m.columns.map((c): Fluent.IColumn => ({
        key: c.name,
        name: c.label,
        fieldName: c.name,
        isResizable: true,
        minWidth: 50,
      })),
      primaryColumnKey = columns[0].key,
      selection = new Fluent.Selection({
        onSelectionChanged: () => {
          qd.args[m.name] = selection.getSelection().map(item => (item as any).__key__)
        }
      }),
      onItemInvoked = (item: any) => {
        qd.args[m.name] = [item.__key__]
        qd.sync()
      },
      onRenderItemColumn = (item?: any, _index?: number, column?: Fluent.IColumn) => {
        if (!item) return <span />
        if (!column) return <span />
        const v = item[column.fieldName as any]
        if (column.key === primaryColumnKey) {
          const onClick = () => {
            qd.args[m.name] = [item.__key__]
            qd.sync()
          }
          return <Fluent.Link onClick={onClick}>{v}</Fluent.Link>
        }
        else return <span>{v}</span>
      },
      render = () => (
        <div data-test={m.name}>
          {
            m.multiple
              ? (
                <Fluent.MarqueeSelection selection={selection}>
                  <Fluent.DetailsList
                    items={items}
                    columns={columns}
                    layoutMode={Fluent.DetailsListLayoutMode.justified}
                    selection={selection}
                    selectionMode={Fluent.SelectionMode.multiple}
                    selectionPreservedOnEmptyClick={true}
                  />
                </Fluent.MarqueeSelection>
              ) : (
                <Fluent.DetailsList
                  items={items}
                  columns={columns}
                  layoutMode={Fluent.DetailsListLayoutMode.justified}
                  selection={selection}
                  selectionMode={Fluent.SelectionMode.none}
                  selectionPreservedOnEmptyClick={true}
                  onItemInvoked={onItemInvoked}
                  onRenderItemColumn={onRenderItemColumn}
                />
              )
          }
        </div>
      )
    return { render }
  })