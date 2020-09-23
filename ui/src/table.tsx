import * as Fluent from '@fluentui/react'
import React from 'react'
import { B, bond, S, qd, box, Dict, U } from './qd'
import { stylesheet } from 'typestyle'
import { rem } from './theme'
import { ProgressTableCellType, XProgressTableCellType } from "./progress_table_cell_type"
import { IconTableCellType, XIconTableCellType } from "./icon_table_cell_type"

/** Defines cell content to be rendered instead of a simple text. */
interface TableCellType {
  progress?: ProgressTableCellType
  icon?: IconTableCellType
}

/** Create a table column. */
interface TableColumn {
  /** An identifying name for this column. */
  name: S
  /** The text displayed on the column header. */
  label: S
  /** The minimum width of this column. */
  min_width?: S
  /** The maximum width of this column. */
  max_width?: S
  /** Indicates whether the column is sortable. */
  sortable?: B
  /** Indicates whether the contents of this column can be searched through. Enables a search box for the table if true. */
  searchable?: B
  /** Indicates whether the contents of this column are displayed as filters in a dropdown. */
  filterable?: B
  /** Indicates whether the table cell should be displayed as a clickable link. */
  link?: B
  /** Defines how to render each cell in this column. Defaults to plain text. */
  cell_type?: TableCellType
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
  /** True to allow group by feature. */
  groupable?: B
  /** Indicates whether the contents of this table can be downloaded and saved as a CSV file. Defaults to False. */
  downloadable?: B
  /** Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False. */
  resettable?: B
  /** The height of the table. */
  height?: S
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

type QColumn = Fluent.IColumn & {
  cellType?: TableCellType
  isSortable?: B
}

const
  css = stylesheet({
    sortableHeader: {
      $nest: {
        '.ms-DetailsHeader-cellName': {
          display: 'flex',
          flexDirection: 'row-reverse',
        }
      }
    },
    sortingIcon: {
      marginLeft: 10,
      fontSize: rem(1.1)
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
  groupByF = function <T extends Dict<any>>(arr: T[], key: S): Dict<any> {
    return arr.reduce((rv, x: T) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {} as Dict<any>)
  },
  sortingF = (column: QColumn, sortAsc: B) => (a: any, b: any) => {
    let itemA = a[column.key]
    let itemB = b[column.key]

    if (typeof itemA === typeof 'string' && typeof itemB === typeof 'string') {
      itemA = (itemA as S).toLowerCase()
      itemB = (itemB as S).toLowerCase()
      return sortAsc
        ? itemB > itemA ? -1 : 1
        : itemB > itemA ? 1 : -1
    }
    else if (typeof itemA === typeof 'number' && typeof itemB === typeof 'number') {
      return sortAsc ? itemA - itemB : itemB - itemA
    }

    return 0
  },
  formatNum = (num: U) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

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
      filteredItemsB = box(items),
      searchableKeys = m.columns.filter(({ searchable }) => searchable).map(({ name }) => name),
      searchStrB = box(''),
      selectedFiltersB = box<{ [key: string]: S[] } | null>(null),
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
          data = items.map(i => Object.values(i).join(',')).join('\n'),
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

        const footerItems: Fluent.ICommandBarItemProps[] = []
        if (m.downloadable) footerItems.push({ key: 'download', text: 'Download data', iconProps: { iconName: 'Download' }, onClick: download })
        if (m.resettable) footerItems.push({ key: 'reset', text: 'Reset table', iconProps: { iconName: 'Refresh' }, onClick: reset })

        return (
          <Fluent.Sticky stickyPosition={Fluent.StickyPositionType.Footer} isScrollSynced>
            <Fluent.Stack horizontal horizontalAlign={searchOrFilter ? 'space-between' : 'end'} verticalAlign='center'>
              {
                searchOrFilter && (
                  <Fluent.Text variant='smallPlus' block >Rows:
                    <b style={{ paddingLeft: 5 }}>{formatNum(filteredItemsB().length)} of {formatNum(items.length)}</b>
                  </Fluent.Text>
                )
              }
              <Fluent.CommandBar items={footerItems} />
            </Fluent.Stack>
          </Fluent.Sticky>
        )
      },
      onRenderRow = (props?: Fluent.IDetailsRowProps) => {
        if (!props) return <span />

        return <Fluent.DetailsRow {...props} styles={{ cell: { alignSelf: 'center' }, root: { width: '100%' } }} />
      },
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
          isSortable: c.sortable,
          isResizable: true,
        }
      })),
      primaryColumnKey = m.columns.find(c => c.link)?.name || (m.columns[0].link === false ? undefined : m.columns[0].name),
      selection = new Fluent.Selection({
        onSelectionChanged: () => {
          qd.args[m.name] = selection.getSelection().map(item => (item as any).__key__)
        }
      }),
      onItemInvoked = (item: any) => {
        qd.args[m.name] = [item.__key__]
        qd.sync()
      },
      onRenderItemColumn = (item?: any, _index?: number, col?: QColumn) => {
        if (!item || !col) return <span />

        const v = item[col.fieldName as S]
        if (col.key === primaryColumnKey && !m.multiple) {
          const onClick = () => {
            qd.args[m.name] = [item.__key__]
            qd.sync()
          }
          return <Fluent.Link onClick={onClick}>{v}</Fluent.Link>
        }

        if (col.cellType?.progress) return <XProgressTableCellType model={col.cellType.progress} progress={item[col.key]} />
        else if (col.cellType?.icon) return <XIconTableCellType model={col.cellType.icon} icon={item[col.key]} />

        return <span>{v}</span>
      },
      DataTable = () => (
        <>
          <Fluent.DetailsList
            styles={{ contentWrapper: { minHeight: m.height ? `calc(${m.height} - 100px)` : 400 } }}
            items={filteredItemsB()}
            columns={columnsB()}
            layoutMode={Fluent.DetailsListLayoutMode.fixedColumns}
            constrainMode={Fluent.ConstrainMode.unconstrained}
            groups={groupsB()}
            selection={selection}
            selectionMode={m.multiple ? Fluent.SelectionMode.multiple : Fluent.SelectionMode.none}
            selectionPreservedOnEmptyClick
            onItemInvoked={m.multiple ? undefined : onItemInvoked}
            onRenderRow={onRenderRow}
            onRenderItemColumn={onRenderItemColumn}
            onRenderDetailsHeader={onRenderDetailsHeader}
            onRenderDetailsFooter={onRenderDetailsFooter}
          />
          {colContextMenuListB() && <Fluent.ContextualMenu {...(colContextMenuListB() as Fluent.IContextualMenuProps)} />}
        </>
      ),
      render = () => (
        <div data-test={m.name} style={{ position: 'relative', height: m.height || 500 }}>
          <Fluent.Stack horizontal horizontalAlign='space-between' >
            {m.groupable && <Fluent.Dropdown data-test='groupby' label='Group by' selectedKey={groupByKeyB()} onChange={onGroupByChange} options={groupByOptions} styles={{ root: { width: 300 } }} />}
            {!!searchableKeys.length && <Fluent.TextField data-test='search' label='Search' onChange={onSearchChange} value={searchStrB()} styles={{ root: { width: '50%' } }} />}
          </Fluent.Stack>
          <Fluent.ScrollablePane scrollbarVisibility={Fluent.ScrollbarVisibility.auto} styles={{ root: { top: m.groupable || searchableKeys.length ? 60 : 0 } }}>
            {
              m.multiple
                ? <Fluent.MarqueeSelection selection={selection}><DataTable /></Fluent.MarqueeSelection>
                : <DataTable />
            }
          </Fluent.ScrollablePane>
        </div>
      )
    return { render, columnsB, filteredItemsB, selectedFiltersB, searchStrB, colContextMenuListB, groupsB, groupByKeyB }
  })