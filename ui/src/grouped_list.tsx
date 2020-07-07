import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, S, U, box, xid, } from './telesync';

// TODO: Find a way to require only either items or children
// type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
//   Pick<T, Exclude<keyof T, Keys>>
//   & {
//     [K in Keys]-?:
//     Required<Pick<T, K>>
//     & Partial<Record<Exclude<Keys, K>, undefined>>
//   }[Keys]
// type ListGroup = RequireOnlyOne<BaseListGroup, 'items' | 'children'>

type ListGroup = {
  /** Group header. */
  name: S
  /** Subgroup. */
  children?: ListGroup[]
  /** Group's data. */
  items?: object[]
}

/**
 * Create an interactive GroupList.
 *
 */
export interface GroupedList {
  /** An identifying name for this component. */
  name?: S
  /** Groups in list. */
  groups: ListGroup[]
  /** Optional columns. If not set, the column names will be generated based on items key attribute. */
  columns?: Fluent.IColumn[]
}

// TODO: Custom groups type - each group has own items that will be parsed and set count + offset
// TODO: Merge all items into a single one

export const
  XGroupedList = bond(({ groups, columns }: GroupedList) => {
    const
      selection = new Fluent.Selection(),
      // groupz: ListGroup[] = [
      //   {
      //     children: [
      //       {
      //         name: 'group 1 - 1',
      //         items: [
      //           { name: 'name4', desc: 'desc', val: 'val' },
      //           { name: 'name5', desc: 'desc', val: 'val' },
      //           { name: 'name6', desc: 'desc', val: 'val' },
      //         ]
      //       },
      //     ],
      //     name: 'group 1',

      //   },
      //   {
      //     name: 'group 2',
      //     items: [
      //       { name: 'name7', desc: 'desc', val: 'val' },
      //       { name: 'name8', desc: 'desc', val: 'val' },
      //       { name: 'name9', desc: 'desc', val: 'val' },
      //     ]
      //   },
      //   {
      //     children: [
      //       {
      //         name: 'group 3 - 1',
      //         children: [
      //           {
      //             name: 'group 3 - 1-1',
      //             items: [
      //               { name: 'name1', desc: 'desc', val: 'val' },
      //             ]
      //           },
      //           {
      //             name: 'group 3 - 1-2',
      //             items: [
      //               { name: 'name2', desc: 'desc', val: 'val' },
      //             ]
      //           },
      //           {
      //             name: 'group 3 - 1-3',
      //             items: [
      //               { name: 'name3', desc: 'desc', val: 'val' },
      //             ]
      //           }
      //         ]
      //       },
      //     ],
      //     name: 'group 3',
      //   },
      // ],
      itemsB = box<object[]>([]),
      groupsB = box<Fluent.IGroup[]>([]),
      columnsB = box<Fluent.IColumn[]>([]),
      processCustomGroups = (startIndex: U, level: U, groups?: ListGroup[]): Fluent.IGroup[] => {
        if (!groups) return []
        return groups.map(g => {
          const name = g.name
          let
            count = 0,
            children: Fluent.IGroup[] = []
          if (g.items) {
            // Merge all items into single array
            itemsB([...itemsB(), ...g.items!])
            count = g.items.length
          } else if (g.children) {
            children = processCustomGroups(itemsB().length, level + 1, g.children)
            count = children.reduce((count, g) => count + g.count, 0)
          } else throw new Error('GroupedList group has to have specified either items or children')
          const ret = { level, count, children, name, key: xid(), startIndex }
          startIndex += count
          return ret
        })
      },
      createDefaultColumns = (): Fluent.IColumn[] => {
        if (!itemsB().length) throw new Error('items should be initialized at this point')
        return Object
          .keys(itemsB()[0])
          .map(key => (
            {
              key: xid(),
              name: key.charAt(0).toUpperCase() + key.slice(1),
              fieldName: key,
              minWidth: 300
            }
          ))
      },
      init = () => {
        groupsB(processCustomGroups(0, 0, groups))
        columnsB(columns || createDefaultColumns())
      },
      onRenderCell = (nestingDepth?: number, item?: unknown, itemIndex?: number): JSX.Element => {
        if (itemIndex === undefined) return <span></span>
        return (
          <Fluent.DetailsRow
            columns={columnsB()}
            groupNestingDepth={nestingDepth}
            item={item}
            itemIndex={itemIndex}
            selection={selection}
            selectionMode={Fluent.SelectionMode.multiple}
            compact={true}
          />
        )
      },
      render = () => (
        <Fluent.SelectionZone selection={selection} selectionMode={Fluent.SelectionMode.multiple}>
          <Fluent.GroupedList
            items={itemsB()}
            onRenderCell={onRenderCell}
            selection={selection}
            selectionMode={Fluent.SelectionMode.multiple}
            groups={groupsB()}
            compact={true}
          />
        </Fluent.SelectionZone>
      )
    return { init, render, itemsB, groupsB, columnsB }
  })