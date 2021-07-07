// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, box, Dict, Id, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { IconTableCellType, XIconTableCellType } from "./icon_table_cell_type"
import { ProgressTableCellType, XProgressTableCellType } from "./progress_table_cell_type"
import { cssVar, rem } from './theme'
import { bond, wave } from './ui'

/** Defines cell content to be rendered instead of a simple text. */
interface TableCellType {
  progress?: ProgressTableCellType
  icon?: IconTableCellType
}

/** Create a table column. */
interface TableColumn {
  /** An identifying name for this column. */
  name: Id
  /** The text displayed on the column header. */
  label: S
  /** The minimum width of this column, e.g. '50px'. Only `px` units are supported at this time. */
  min_width?: S
  /** The maximum width of this column, e.g. '100px'. Only `px` units are supported at this time. */
  max_width?: S
  /** Indicates whether the column is sortable. */
  sortable?: B
  /** Indicates whether the contents of this column can be searched through. Enables a search box for the table if true. */
  searchable?: B
  /** Indicates whether the contents of this column are displayed as filters in a dropdown. */
  filterable?: B
  /** Indicates whether each cell in this column should be displayed as a clickable link. Applies to exactly one text column in the table. */
  link?: B
  /** Defines the data type of this column. Defaults to `string`. */
  data_type?: 'string' | 'number' | 'time'
  /** Defines how to render each cell in this column. Defaults to plain text. */
  cell_type?: TableCellType
}

/** Create a table row. */
interface TableRow {
  /** An identifying name for this row. */
  name: Id
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
  name: Id
  /** The columns in this table. */
  columns: TableColumn[]
  /** The rows in this table. */
  rows: TableRow[]
  /** True to allow multiple rows to be selected. */
  multiple?: B
  /** True to allow group by feature. */
  groupable?: B
  /** Indicates whether the contents of this table can be downloaded and saved as a CSV file. Defaults to False. */
  downloadable?: B
  /** Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False. */
  resettable?: B
  /** The height of the table, e.g. '400px', '50%', etc. */
  height?: S
  /** The names of the selected rows. If this parameter is set, multiple selections will be allowed (`multiple` is assumed to be `True`). */
  values?: S[]
  /** Controls visibility of table rows when `multiple` is set to `True`. Defaults to 'on-hover'. */
  checkbox_visibility?: 'always' | 'on-hover' | 'hidden'
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

type QColumn = Fluent.IColumn & {
  dataType?: S
  cellType?: TableCellType
  isSortable?: B
}

const
  css = stylesheet({
    // HACK: Put sorting icon on right (same as filter).
    sortableHeader: {
      $nest: {
        '.ms-DetailsHeader-cellName': {
          position: 'relative',
          paddingRight: 15
        }
      }
    },
    sortingIcon: {
      marginLeft: 10,
      fontSize: rem(1.1),
      position: 'absolute',
      top: -2,
      right: -5
    },
    // HACK: incorrect width recalculated after changing to "group by mode" - collapse icon in header
    // causes horizontal overflow for whole table.
    hideCellGroupCollapse: {
      $nest: {
        'div[class*="cellIsGroupExpander"]': {
          display: 'none'
        }
      }
    }
  }),
  checkboxVisibilityMap = {
    'always': Fluent.CheckboxVisibility.always,
    'on-hover': Fluent.CheckboxVisibility.onHover,
    'hidden': Fluent.CheckboxVisibility.hidden,
  },
  groupByF = function <T extends Dict<any>>(arr: T[], key: S): Dict<any> {
    return arr.reduce((rv, x: T) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {} as Dict<any>)
  },
  sortingF = (column: QColumn, sortAsc: B) => (rowA: any, rowB: any) => {
    let a = rowA[column.key], b = rowB[column.key]

    switch (column.dataType) {
      case 'number':
        a = +a
        b = +b
        return sortAsc ? a - b : b - a
      case 'time':
        a = Date.parse(a)
        b = Date.parse(b)
        break
      default:
        a = a.toLowerCase()
        b = b.toLowerCase()
        break
    }

    return sortAsc
      ? b > a ? -1 : 1
      : b > a ? 1 : -1
  },
  formatNum = (num: U) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  toCSV = (data: unknown[][]): S => data.map(row => {
    const line = JSON.stringify(row)
    return line.substr(1, line.length - 2)
  }).join('\n')


export const
  XTable = bond(({ model: m }: { model: Table }) => {
    wave.args[m.name] = []
    const
      items = m.rows.map(r => {
        const item: Fluent.IObjectWithKey & Dict<any> = { key: r.name }
        for (let i = 0, n = r.cells.length; i < n; i++) {
          const col = m.columns[i]
          item[col.name] = r.cells[i]
        }
        return item
      }),
      isMultiple = m.values?.length || m.multiple,
      filteredItemsB = box(items),
      searchableKeys = m.columns.filter(({ searchable }) => searchable).map(({ name }) => name),
      searchStrB = box(''),
      selectedFiltersB = box<Dict<S[]> | null>(null),
      colContextMenuListB = box<Fluent.IContextualMenuProps | null>(null),
      groupsB = box<Fluent.IGroup[] | undefined>(undefined),
      groupByKeyB = box('*'),
      groupByOptions: Fluent.IDropdownOption[] = m.groupable ? [{ key: '*', text: '(No Grouping)' }, ...m.columns.map(col => ({ key: col.name, text: col.label }))] : [],
      onSearchChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, searchStr?: S) => {
        searchStrB(searchStr || '')

        if (!searchStr && !selectedFiltersB()) {
          filteredItemsB(items)
          if (groupsB()) initGroups()
          return
        }

        filter()
        search()
        if (groupsB()) initGroups()
      },
      search = () => {
        const searchStr = searchStrB().toLowerCase()
        if (!searchStr || !searchableKeys.length) return

        filteredItemsB(filteredItemsB().filter(i => searchableKeys.some(key => (i[key] as S).toLowerCase().includes(searchStr))))
      },
      onFilterChange = (filterKey: S, filterVal: S) => (_e?: React.FormEvent<HTMLInputElement | HTMLElement>, checked?: B) => {
        const filters = selectedFiltersB() || {}

        if (checked) {
          if (filters[filterKey]) filters[filterKey].push(filterVal)
          else filters[filterKey] = [filterVal]
        }
        else filters[filterKey] = filters[filterKey].filter(f => f !== filterVal)
        selectedFiltersB(Object.values(filters).every(v => !v.length) ? null : { ...filters })

        filter()
        search()
        if (groupsB()) initGroups()
      },
      // TODO: Make filter options in dropdowns dynamic.
      filter = () => {
        const selectedFilters = selectedFiltersB()

        // If we have filters, check if any of the data-item's props (filter's keys) equals to any of its filter values.
        const filteredItems = selectedFilters
          ? items.filter(i => Object.keys(selectedFilters)
            .every(filterKey => !selectedFilters[filterKey].length || selectedFilters[filterKey]
              .some(filterVal => i[filterKey] === filterVal)
            )
          )
          : items

        filteredItemsB(filteredItems)
      },
      reset = () => {
        selectedFiltersB(null)
        searchStrB('')

        groupsB(undefined)
        groupByKeyB('*')

        filter()
        search()
      },
      sort = (column: QColumn) => {
        const sortAsc = column.iconName === 'SortDown'
        column.iconName = sortAsc ? 'SortUp' : 'SortDown'

        if (groupsB()) {
          filteredItemsB(groupsB()?.reduce((acc, group) =>
            [...acc, ...filteredItemsB().slice(group.startIndex, acc.length + group.count).sort(sortingF(column, sortAsc))],
            [] as any[]) || [])
        }
        else filteredItemsB([...filteredItemsB()].sort(sortingF(column, sortAsc)))

        columnsB(columnsB().map((col) => column.key === col.key ? column : col))
      },
      download = () => {
        // TODO: Prompt a dialog for name, encoding, etc.
        const
          data = toCSV([m.columns.map(({ label, name }) => label || name), ...m.rows.map(({ cells }) => cells)]),
          a = document.createElement('a'),
          blob = new Blob([data], { type: "octet/stream" }),
          url = window.URL.createObjectURL(blob)

        a.href = url
        a.download = 'exported_data.csv'
        a.click()

        window.URL.revokeObjectURL(url)
      },
      onRenderMenuList = (props?: Fluent.IContextualMenuListProps) => {
        if (!props) return null

        return (
          <div style={{ padding: 10 }}>
            <Fluent.Text variant='mediumPlus' styles={{ root: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold' } }} block>Show only</Fluent.Text>
            {
              props.items.map(({ key, name, data }) => {
                const selectedFilters = selectedFiltersB()
                const checked = !!name && !!selectedFilters && selectedFilters[data] && selectedFilters[data].includes(name)
                return (
                  <Fluent.Checkbox
                    key={key}
                    label={name}
                    defaultChecked={checked}
                    onChange={onFilterChange(data || '', name || '')}
                    styles={{ root: { marginBottom: 5 } }}
                  />
                )
              })
            }
          </div>
        )
      },
      onDismissContextMenu = () => colContextMenuListB(null),
      onColumnContextMenu = (col: Fluent.IColumn, e: React.MouseEvent<HTMLElement>) => {
        colContextMenuListB({
          items: Array.from(new Set(items.map(i => i[col.fieldName || col.key])))
            .map(option => ({ key: option, name: option, data: col.fieldName || col.key })),
          target: e.target as HTMLElement,
          directionalHint: Fluent.DirectionalHint.bottomLeftEdge,
          gapSpace: 10,
          isBeakVisible: true,
          onRenderMenuList,
          onDismiss: onDismissContextMenu,
        })
      },
      makeGroups = () => {
        let prevSum = 0
        const groupedBy = groupByF(filteredItemsB(), groupByKeyB())
        const groupedByKeys = Object.keys(groupedBy)
        const groups: Fluent.IGroup[] = groupedByKeys.map((key, i) => {
          if (i !== 0) {
            const prevKey = groupedByKeys[i - 1]
            prevSum += groupedBy[prevKey].length
          }
          return { key, name: key, startIndex: prevSum, count: groupedBy[key].length, isCollapsed: true }
        })

        return { groupedBy, groups }
      },
      initGroups = () => {
        const { groupedBy, groups } = makeGroups()
        filteredItemsB(Object.values(groupedBy).flatMap(arr => arr))
        groupsB(groups)
      },
      onGroupByChange = (_e: React.FormEvent<HTMLDivElement>, option?: Fluent.IDropdownOption) => {
        if (!option) return
        if (option.key === '*') {
          reset()
          return
        }

        reset()
        groupByKeyB(option.key as S)
        initGroups()
      },
      onRenderDetailsHeader = (props?: Fluent.IDetailsHeaderProps) => {
        if (!props) return <span />

        return (
          <Fluent.Sticky stickyPosition={Fluent.StickyPositionType.Header} isScrollSynced>
            <Fluent.DetailsHeader {...props} onColumnContextMenu={onColumnContextMenu} className={groupsB() ? css.hideCellGroupCollapse : ''} />
          </Fluent.Sticky>
        )
      },
      onRenderDetailsFooter = (props?: Fluent.IDetailsFooterProps) => {
        const searchOrFilter = searchableKeys.length || m.columns.some(c => c.filterable)
        if (!props || (!m.downloadable && !m.resettable && !searchOrFilter)) return null

        const
          footerItems: Fluent.ICommandBarItemProps[] = [],
          buttonStyles = { root: { background: cssVar('$card') } }
        if (m.downloadable) footerItems.push({ key: 'download', text: 'Download data', iconProps: { iconName: 'Download' }, onClick: download, buttonStyles })
        if (m.resettable) footerItems.push({ key: 'reset', text: 'Reset table', iconProps: { iconName: 'Refresh' }, onClick: reset, buttonStyles })

        return (
          <Fluent.Sticky stickyPosition={Fluent.StickyPositionType.Footer} isScrollSynced>
            <Fluent.Stack horizontal horizontalAlign={searchOrFilter ? 'space-between' : 'end'} verticalAlign='center'>
              {
                searchOrFilter && (
                  <Fluent.Text variant='smallPlus' block styles={{ root: { whiteSpace: 'nowrap' } }}>Rows:
                    <b style={{ paddingLeft: 5 }}>{formatNum(filteredItemsB().length)} of {formatNum(items.length)}</b>
                  </Fluent.Text>
                )
              }
              <div style={{ width: '80%' }}>
                <Fluent.CommandBar items={footerItems} styles={{ root: { background: cssVar('$card') }, primarySet: { justifyContent: 'flex-end' } }} />
              </div>
            </Fluent.Stack>
          </Fluent.Sticky>
        )
      },
      onRenderRow = (props?: Fluent.IDetailsRowProps) => props
        ? <Fluent.DetailsRow {...props} styles={{ cell: { alignSelf: 'center' }, checkCell: { display: 'flex', alignItems: 'center' }, root: { width: '100%' } }} />
        : null,
      onColumnClick = (e: React.MouseEvent<HTMLElement>, column: QColumn) => {
        const isMenuClicked = (e.target as HTMLElement).getAttribute('data-icon-name') === 'ChevronDown'

        if (isMenuClicked) onColumnContextMenu(column, e)
        else if (column.isSortable) sort(column)
      },
      columnsB = box(m.columns.map((c): QColumn => {
        const
          minWidth = c.min_width
            ? c.min_width.endsWith('px')
              ? +c.min_width.substring(0, c.min_width.length - 2)
              : +c.min_width
            : 150,
          maxWidth = c.max_width
            ? c.max_width.endsWith('px')
              ? +c.max_width.substring(0, c.max_width.length - 2)
              : +c.max_width
            : undefined
        return {
          key: c.name,
          name: c.label,
          fieldName: c.name,
          minWidth,
          maxWidth,
          headerClassName: c.sortable ? css.sortableHeader : undefined,
          iconClassName: c.sortable ? css.sortingIcon : undefined,
          iconName: c.sortable ? 'SortDown' : undefined,
          onColumnClick,
          columnActionsMode: c.filterable ? Fluent.ColumnActionsMode.hasDropdown : Fluent.ColumnActionsMode.clickable,
          cellType: c.cell_type,
          dataType: c.data_type,
          isSortable: c.sortable,
          isResizable: true,
        }
      })),
      primaryColumnKey = m.columns.find(c => c.link)?.name || (m.columns[0].link === false ? undefined : m.columns[0].name),
      selection = new Fluent.Selection({
        onSelectionChanged: () => {
          wave.args[m.name] = selection.getSelection().map(item => item.key as S)
        }
      }),
      init = () => {
        if (isMultiple && m.values) {
          m.values.forEach(v => selection.setKeySelected(v, true, false))
          wave.args[m.name] = m.values
        }
      },
      onItemInvoked = (item: Fluent.IObjectWithKey & Dict<any>) => {
        wave.args[m.name] = [item.key as S]
        wave.push()
      },
      onRenderItemColumn = (item?: Fluent.IObjectWithKey & Dict<any>, _index?: number, col?: QColumn) => {
        if (!item || !col) return <span />

        let v = item[col.fieldName as S]
        if (col.cellType?.progress) return <XProgressTableCellType model={col.cellType.progress} progress={item[col.key]} />
        if (col.cellType?.icon) return <XIconTableCellType model={col.cellType.icon} icon={item[col.key]} />
        if (col.dataType === 'time') v = new Date(v).toLocaleString()
        if (col.key === primaryColumnKey && !isMultiple) {
          const onClick = () => {
            wave.args[m.name] = [item.key as S]
            wave.push()
          }
          return <Fluent.Link onClick={onClick}>{v}</Fluent.Link>
        }

        return v
      },
      computeHeight = () => {
        if (m.height) return m.height
        if (items.length > 10) return 500

        const
          topToolbarHeight = searchableKeys.length || m.groupable ? 60 : 0,
          headerHeight = 60,
          rowHeight = m.columns.some(c => c.cell_type)
            ? m.columns.some(c => c.cell_type?.progress) ? 68 : 50
            : 43,
          footerHeight = m.downloadable || m.resettable || searchableKeys.length ? 44 : 0

        return topToolbarHeight + headerHeight + (items.length * rowHeight) + footerHeight
      },
      DataTable = () => (
        <>
          <Fluent.DetailsList
            items={filteredItemsB()}
            columns={columnsB()}
            constrainMode={Fluent.ConstrainMode.unconstrained}
            layoutMode={Fluent.DetailsListLayoutMode.fixedColumns}
            groups={groupsB()}
            selection={selection}
            selectionMode={isMultiple ? Fluent.SelectionMode.multiple : Fluent.SelectionMode.none}
            selectionPreservedOnEmptyClick
            onItemInvoked={isMultiple ? undefined : onItemInvoked}
            onRenderRow={onRenderRow}
            onRenderItemColumn={onRenderItemColumn}
            onRenderDetailsHeader={onRenderDetailsHeader}
            onRenderDetailsFooter={onRenderDetailsFooter}
            checkboxVisibility={checkboxVisibilityMap[m.checkbox_visibility || 'on-hover']}
          />
          {colContextMenuListB() && <Fluent.ContextualMenu {...(colContextMenuListB() as Fluent.IContextualMenuProps)} />}
        </>
      ),
      render = () => (
        <div data-test={m.name} style={{ position: 'relative', height: computeHeight() }}>
          <Fluent.Stack horizontal horizontalAlign='space-between' >
            {m.groupable && <Fluent.Dropdown data-test='groupby' label='Group by' selectedKey={groupByKeyB()} onChange={onGroupByChange} options={groupByOptions} styles={{ root: { width: 300 } }} />}
            {!!searchableKeys.length && <Fluent.TextField data-test='search' label='Search' onChange={onSearchChange} value={searchStrB()} styles={{ root: { width: '50%' } }} />}
          </Fluent.Stack>
          <Fluent.ScrollablePane scrollbarVisibility={Fluent.ScrollbarVisibility.auto} styles={{ root: { top: m.groupable || searchableKeys.length ? 80 : 0 } }}>
            {
              isMultiple
                ? <Fluent.MarqueeSelection selection={selection}><DataTable /></Fluent.MarqueeSelection>
                : <DataTable />
            }
          </Fluent.ScrollablePane>
        </div>
      )
    return { init, render, columnsB, filteredItemsB, selectedFiltersB, searchStrB, colContextMenuListB, groupsB, groupByKeyB }
  })