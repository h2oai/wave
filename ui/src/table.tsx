import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, Rec, S } from './telesync';

interface TableColumn {
  name: S
  label: S
}

interface TableRow {
  name: S
  cells: S[]
}

export interface Table {
  name: S
  columns: TableColumn[]
  rows: TableRow[]
  multiple: B
  tooltip: S
}

export const
  XTable = bond(({ args, model: m, submit }: { args: Rec, model: Table, submit: () => void }) => {
    args[m.name] = []
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
          args[m.name] = selection.getSelection().map(item => (item as any).__key__)
        }
      }),
      onItemInvoked = (item: any) => {
        args[m.name] = [item.__key__]
        submit()
      },
      onRenderItemColumn = (item?: any, _index?: number, column?: Fluent.IColumn) => {
        if (!item) return <span />
        if (!column) return <span />
        const v = item[column.fieldName as any]
        if (column.key === primaryColumnKey) {
          const onClick = () => {
            args[m.name] = [item.__key__]
            submit()
          }
          return <Fluent.Link onClick={onClick}>{v}</Fluent.Link>
        } else {
          return <span>{v}</span>
        }
      },
      render = () => (
        m.multiple ? (
          <Fluent.MarqueeSelection selection={selection}>
            <Fluent.DetailsList
              data-test={m.name}
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
              data-test={m.name}
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
      )
    return { render }
  })