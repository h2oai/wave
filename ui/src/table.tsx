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
import { B, Dict, Id, S, U } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { MenuTableCellType as MenuTableCellType, XMenuTableCellType } from './menu_table_cell_type'
import { IconTableCellType, XIconTableCellType } from "./icon_table_cell_type"
import { MarkdownTableCellType, XMarkdownTableCellType } from './markdown_table_cell_type'
import { ProgressTableCellType, XProgressTableCellType } from "./progress_table_cell_type"
import { TagTableCellType, XTagTableCellType } from "./tag_table_cell_type"
import { border, cssVar, important, margin, rem } from './theme'
import useUpdateOnlyEffect from './parts/useUpdateOnlyEffectHook'
import { wave } from './ui'
import { Z_INDEX } from './parts/styleConstants'

/** Configure table pagination. Use as `pagination` parameter to `ui.table()` */
interface TablePagination {
  /** Total count of all the rows in your dataset. */
  total_rows: U
  /** The maximum amount of rows to be displayed in a single page. */
  rows_per_page: U
}

/** Defines cell content to be rendered instead of a simple text. */
interface TableCellType {
  /** Renders a progress arc with a percentage value in the middle. */
  progress?: ProgressTableCellType
  /** Renders an icon. */
  icon?: IconTableCellType
  /** Renders one or more tags. */
  tag?: TagTableCellType
  /** Renders a command menu. */
  menu?: MenuTableCellType
  /** Renders text using markdown. */
  markdown?: MarkdownTableCellType
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
  /** Defines the data type of this column. Time column takes either ISO 8601 date string or unix epoch miliseconds. Defaults to `string`. */
  data_type?: 'string' | 'number' | 'time'
  /** Defines how to render each cell in this column. Renders as plain text by default. */
  cell_type?: TableCellType
  /** Defines what to do with a cell's contents in case it does not fit inside the cell. */
  cell_overflow?: 'tooltip' | 'wrap'
  /** Explicit list of values to allow filtering by, needed when pagination is set or custom order is needed. Only applicable to filterable columns. */
  filters?: S[]
  /** Defines how to align values in a column. */
  align?: 'left' | 'center' | 'right'
}

/** Create a table row. */
interface TableRow {
  /** An identifying name for this row. */
  name: Id
  /** The cells in this row (displayed left to right). */
  cells: S[]
}

/**
 * Make rows within the table collapsible/expandable.
 *
 * This type of table is best used for cases when your data makes sense to be presented in chunks rather than a single flat list.
 */
interface TableGroup {
  /** The title of the group. */
  label: S
  /** The rows in this group. */
  rows: TableRow[]
  /** Indicates whether the table group should be collapsed by default. Defaults to True. */
  collapsed?: B
}

/**
 * Create an interactive table.
 *
 * This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
 * display a non-interactive table of information, use a markdown table.
 *
 * If `multiple` is set to False (default), each row in the table is clickable. When a cell in the column with `link=True`
 * (defaults to first column) is clicked or the row is doubleclicked, the form is
 * submitted automatically, and `q.args.table_name` is set to `[row_name]`, where `table_name` is the `name` of
 * the table, and `row_name` is the `name` of the row that was clicked on.
 *
 * If `multiple` is set to True, each row in the table is selectable. A row can be selected by clicking on it.
 * Multiple rows can be selected either by shift+clicking or using marquee selection. When the form is submitted,
 * `q.args.table_name` is set to `[row1_name, row2_name, ...]` where `table_name` is the `name` of the table,
 * and `row1_name`, `row2_name` are the `name` of the rows that were selected. Note that if `multiple` is
 * set to True, the form is not submitted automatically, and one or more buttons are required in the form to trigger
 * submission.
 * 
 * If `pagination` is set, you have to handle search/filter/sort/download/page_change/reset events yourself since
 * none of these features will work automatically like in non-paginated table.
 */
export interface Table {
  /** An identifying name for this component. */
  name: Id
  /** The columns in this table. */
  columns: TableColumn[]
  /** The rows in this table. Mutually exclusive with `groups` attr. */
  rows?: TableRow[]
  /** True to allow multiple rows to be selected. Mutually exclusive with `single` attr. */
  multiple?: B
  /** True to allow group by feature. */
  groupable?: B
  /** Indicates whether the table rows can be downloaded as a CSV file. Defaults to False. */
  downloadable?: B
  /** Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False. */
  resettable?: B
  /** The height of the table in px (e.g. '200px') or '1' to fill the remaining card space. */
  height?: S
  /** The width of the table, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** The names of the selected rows. If this parameter is set, multiple selections will be allowed (`multiple` is assumed to be `True`). */
  values?: S[]
  /** Controls visibility of table rows when `multiple` is set to `True`. Defaults to 'on-hover'. */
  checkbox_visibility?: 'always' | 'on-hover' | 'hidden'
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** Creates collapsible / expandable groups of data rows. Mutually exclusive with `rows` attr. */
  groups?: TableGroup[]
  /** Display a pagination control at the bottom of the table. Set this value using `ui.table_pagination()`. */
  pagination?: TablePagination
  /** The events to capture on this table when pagination is set. One of 'search' | 'sort' | 'filter' | 'download' | 'page_change' | 'reset' | 'select'. */
  events?: S[]
  /** True to allow only one row to be selected at time. Mutually exclusive with `multiple` attr. */
  single?: B
  /** The name of the selected row. If this parameter is set, single selection will be allowed (`single` is assumed to be `True`). */
  value?: S
}

type WaveColumn = Fluent.IColumn & {
  dataType?: 'string' | 'number' | 'time'
  cellType?: TableCellType
  isSortable?: B
  cellOverflow?: 'tooltip' | 'wrap'
  filters?: S[]
  align?: 'left' | 'center' | 'right'
}

type DataTable = {
  model: Table
  onFilterChange: (filterKey: S, filterVal: S, checked?: B) => void
  onSortChange: (col: WaveColumn, sortAsc: B) => void,
  filteredItems: any[]
  selectedFilters: Dict<S[]> | null
  items: any[]
  selection: Fluent.Selection
  isMultiple: B,
  isSingle: B,
  groups?: Fluent.IGroup[]
  expandedRefs: React.MutableRefObject<{ [key: S]: B } | null>
  setFiltersInBulk: (colKey: S, filters: S[]) => void
}

type ContextualMenuProps = {
  onFilterChange: (filterKey: S, filterVal: S, checked?: B) => void
  col: WaveColumn
  listProps: Fluent.IContextualMenuListProps
  selectedFilters: Dict<S[]> | null
  setFiltersInBulk: (colKey: S, filters: S[]) => void 
}

type FooterProps = {
  currentPage: U
  onPageChange: (newPage: U) => void
  isSearchable: B
  isFilterable: B
  displayedRows: S
  m: Table
  reset: () => void
}

type PaginationProps = {
  currentPage: U
  onPageChange: (newPage: U) => void
  pagination: TablePagination
}

const
  // TODO: Clean up into correct Fluent style slots.
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
    }
  }),
  styles: Partial<Fluent.IDetailsListStyles> = {
    contentWrapper: {
      borderTop: 'none',
      '.ms-List-page:first-child .ms-List-cell:first-child > .ms-DetailsRow': {
        borderTop: border(2, 'transparent'),
      },
    }
  },
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
  sortingF = (column: WaveColumn, sortAsc: B) => (rowA: any, rowB: any) => {
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
  valueToDateString = (value: S) => {
    const epoch = Number(value)
    return new Date(isNaN(epoch) ? value : epoch).toLocaleString()
  },
  toCSV = (data: unknown[][]): S => data.map(row => {
    const line = JSON.stringify(row)
    return line.substr(1, line.length - 2)
  }).join('\n'),
  TooltipWrapper = ({ children, cellOverflow }: { children: JSX.Element, cellOverflow?: S }) => {
    return cellOverflow === 'tooltip' ? (
      <Fluent.TooltipHost
        // HACK: prevent Safari from showing a default tooltip - https://github.com/microsoft/fluentui/issues/13868
        styles={{ root: { '::after': { content: '', display: 'block' } } }}
        content={children}
        overflowMode={Fluent.TooltipOverflowMode.Parent}
      >{children}</Fluent.TooltipHost>
    ) : <>{children}</>
  },
  ContextualMenu = ({ onFilterChange, col, listProps, selectedFilters, setFiltersInBulk }: ContextualMenuProps) => {
    const
      isFilterChecked = (data: S, key: S) => !!selectedFilters && selectedFilters[data]?.includes(key),
      [selectedFiltersCount, setSelectedFiltersCount] = React.useState(0), // Step 1
      [menuFilters, setMenuFilters] = React.useState(col.cellType?.tag
        ? Array.from(listProps.items.reduce((_filters, { key, text, data }) => {
          key.split(',').forEach(key => _filters.set(key, { key, text, data, checked: isFilterChecked(data, key) }))
          return _filters
        }, new Map<S, Fluent.IContextualMenuItem>()).values())
        : listProps.items.map(i => ({ ...i, checked: isFilterChecked(i.data, i.key) }))
      ),
      selectAll = () => {
        setMenuFilters(menuFilters.map(i => ({ ...i, checked: true })))
        setFiltersInBulk(col.key, menuFilters.map(f => f.key))
        setSelectedFiltersCount(menuFilters.length)
      },
      deselectAll = () => {
        setMenuFilters(menuFilters.map(i => ({ ...i, checked: false })))
        setFiltersInBulk(col.key, [])
        setSelectedFiltersCount(0)
      },
      getOnFilterChangeHandler = (data: S, key: S) => (_ev?: React.FormEvent<HTMLInputElement | HTMLElement>, checked?: B) => {
        const onChangeFilterMap = menuFilters.map(f => (f.key === key ? { ...f, checked } : f))
        setMenuFilters(onChangeFilterMap)    
        onFilterChange(data, key, checked)
        setFiltersInBulk(col.key, onChangeFilterMap.filter(f => f.checked).map(f => f.key))    
        setSelectedFiltersCount(
          onChangeFilterMap.reduce((count, filter) => (filter.checked ? count + 1 : count), 0)
        )
      }

    return (
      <div style={{ padding: 10 }}>
      <Fluent.Text variant='mediumPlus' styles={{ root: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold' } }} block>
        {`(${selectedFiltersCount} selected)`}
      </Fluent.Text>
        <Fluent.Text variant='mediumPlus' styles={{ root: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold' } }} block>Show only</Fluent.Text>
        <Fluent.Text variant='small'>
          <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
        </Fluent.Text>
        {
          menuFilters.map(({ key, data, checked }) => (
            <Fluent.Checkbox
              key={key}
              label={col.dataType === 'time' ? valueToDateString(key) : key}
              checked={checked}
              onChange={getOnFilterChangeHandler(data, key)}
              styles={{ root: { marginBottom: 5 }, checkmark: { display: 'flex' } }}
            />
          )
          )
        }
      </div>
    )
  },
  DataTable = React.forwardRef(({ model: m, onFilterChange, items, filteredItems, selection, selectedFilters, isMultiple, isSingle, groups, expandedRefs, onSortChange, setFiltersInBulk }: DataTable, ref) => {
    const
    [colContextMenuList, setColContextMenuList] = React.useState<Fluent.IContextualMenuProps | null>(null),
      onRenderMenuList = React.useCallback((col: WaveColumn) => (listProps?: Fluent.IContextualMenuListProps) => {
        return listProps ?
          <ContextualMenu
            onFilterChange={onFilterChange}
            col={col}
            listProps={listProps}
            selectedFilters={selectedFilters}
            setFiltersInBulk={setFiltersInBulk}
          /> : null
      }, [onFilterChange, selectedFilters, setFiltersInBulk]),
      onColumnContextMenu = React.useCallback((col: WaveColumn, e: React.MouseEvent<HTMLElement>) => {
        const menuFilters = col.filters || items.map(i => i[col.fieldName || col.key])
        setColContextMenuList({
          items: Array.from(new Set(menuFilters)).filter(item => item !== '').map(option => ({ key: option, text: option, data: col.fieldName || col.key })),
          target: e.target as HTMLElement,
          directionalHint: Fluent.DirectionalHint.bottomLeftEdge,
          gapSpace: 10,
          isBeakVisible: true,
          onRenderMenuList: onRenderMenuList(col),
          onDismiss: () => setColContextMenuList(null),
        })
      }, [items, onRenderMenuList]),
      onColumnClick = React.useCallback((e: React.MouseEvent<HTMLElement>, column: WaveColumn) => {
        const isMenuClicked = (e.target as HTMLElement).closest('[data-icon-name="ChevronDown"]')

        if (isMenuClicked) onColumnContextMenu(column, e)
        else if (column.isSortable) {
          const sortAsc = column.iconName === 'SortDown' || !column.iconName
          onSortChange(column, sortAsc)
          setColumns(cols => cols.map(col => {
            if (column.key === col.key) {
              col.iconName = sortAsc ? 'SortUp' : 'SortDown'
            } else {
              col.iconName = undefined
            }
            return col
          }))
        }
      }
      , [onColumnContextMenu, onSortChange]),
      tableToWaveColumn = React.useCallback((c: TableColumn): WaveColumn => {
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
        let label = c.label
            if (c.filterable) {
              const dataKey = c.name // Assuming the column name represents the data key
              const appliedFilters = selectedFilters?.[dataKey]?.length || 0
              label += (appliedFilters > 0 && appliedFilters <= 9) ? ` (${appliedFilters})` : appliedFilters > 9 ? '(9+)': ''
            }
        return {
          key: c.name,
          name: label,
          fieldName: c.name,
          minWidth,
          maxWidth,
          headerClassName: c.sortable ? css.sortableHeader : undefined,
          iconClassName: c.sortable ? css.sortingIcon : undefined,
          onColumnClick,
          columnActionsMode: c.filterable ? Fluent.ColumnActionsMode.hasDropdown : Fluent.ColumnActionsMode.clickable,
          cellType: c.cell_type,
          dataType: c.data_type,
          align: c.align,
          isSortable: c.sortable,
          cellOverflow: c.cell_overflow,
          styles: { root: { height: 48 }, cellName: { color: cssVar('$neutralPrimary') } },
          isResizable: true,
          isMultiline: c.cell_overflow === 'wrap',
          filters: c.filterable ? c.filters : undefined,
        }
      }, [onColumnClick, selectedFilters]),
      [columns, setColumns] = React.useState(m.columns.map(tableToWaveColumn)),
      primaryColumnKey = m.columns.find(c => c.link)?.name || (m.columns[0].link === false ? undefined : m.columns[0].name),
      onRenderDetailsHeader = React.useCallback((props?: Fluent.IDetailsHeaderProps) => {
        if (!props) return <span />
        return (
          <Fluent.Sticky stickyPosition={Fluent.StickyPositionType.Header} isScrollSynced>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Fluent.DetailsHeader
                {...props}
                isAllCollapsed={groups?.every(group => group.isCollapsed)}
                styles={{
                  ...props.styles,
                  root: {
                    padding: 0,
                    height: 48,
                    lineHeight: '48px',
                    background: cssVar('$neutralLight'),
                    borderBottom: 'none',
                  },
                  cellSizerEnd: {
                    marginLeft: -8,
                  },
                  cellIsGroupExpander: {
                    // HACK: fixed size of expand/collapse button in column header
                    height: 48,
                  },
                }}
              />
            </div>
          </Fluent.Sticky>
        )        
      }, [groups]),
      onRenderGroupHeader = React.useCallback((props?: Fluent.IDetailsGroupDividerProps) => {
        if (!props) return <span />

        return (
          <Fluent.GroupHeader
            {...props}
            styles={stylesProps => ({
              root: [
                {
                  position: 'sticky',
                  top: 48,
                  backgroundColor: cssVar('$card'),
                  zIndex: Z_INDEX.TABLE_GROUPS_HEADER
                },
                stylesProps.selected
                  ? {
                    background: important(cssVar('$neutralLighter')),
                    '.ms-GroupHeader-check': { opacity: 1 }
                  }
                  : undefined
              ]
            })
            } />
        )
      }, []),
      onToggleCollapseAll = (isAllCollapsed: B) => expandedRefs.current = isAllCollapsed ? {} : null,
      onToggleCollapse = ({ key, isCollapsed }: Fluent.IGroup) => {
        if (expandedRefs.current) {
          isCollapsed
            ? expandedRefs.current[key] = false
            : delete expandedRefs.current[key]
        } else {
          expandedRefs.current = { [key]: false }
        }
      },
      onRenderRow = (props?: Fluent.IDetailsRowProps) => props
        ? <Fluent.DetailsRow {...props} styles={styleProps =>
        ({
          cell: { alignSelf: 'center', fontSize: 14, lineHeight: 20, color: cssVar('$text9') },
          checkCell: { display: 'flex', alignItems: 'center' },
          root: [
            {
              width: '100%',
              border: border(2, 'transparent'),
              borderTop: border(2, cssVar('$neutralLight')),
              background: cssVar('$card'),
              minHeight: 48,
              '&:hover': {
                background: cssVar('$neutralLighter'),
                border: important(border(2, cssVar('$themePrimary')))
              }
            },
            styleProps.isSelected ? { background: cssVar('$neutralLighter') } : undefined
          ]
        })
        } />
        : null,
      onItemInvoked = (item: Fluent.IObjectWithKey & Dict<any>) => {
        wave.args[m.name] = [item.key as S]
        wave.push()
      },
      getCellComponent = (item?: Fluent.IObjectWithKey & Dict<any>, _idx?: U, col?: WaveColumn) => {
        if (!item || !col) return <span />

        let v = item[col.fieldName as S]
        if (col.cellType?.progress) return <XProgressTableCellType model={col.cellType.progress} progress={item[col.key]} />
        if (col.cellType?.icon) return <XIconTableCellType model={col.cellType.icon} icon={item[col.key]} />
        if (col.cellType?.tag) return <XTagTableCellType model={col.cellType.tag} serializedTags={item[col.key]} isMultiline={col.isMultiline} />
        if (col.cellType?.menu) return <XMenuTableCellType model={{ ...col.cellType.menu, rowId: String(item.key) }} />
        if (col.cellType?.markdown) return (
          <TooltipWrapper cellOverflow={col.cellOverflow}>
            <XMarkdownTableCellType model={{ ...col.cellType.markdown, content: item[col.key] }} />
          </TooltipWrapper>
        )

        if (col.dataType === 'time') v = valueToDateString(v)

        if (col.key === primaryColumnKey) {
          const onClick = () => {
            wave.args[m.name] = [item.key as S]
            wave.push()
          }
          return (
            <TooltipWrapper cellOverflow={col.cellOverflow}>
              <Fluent.Link onClick={onClick} styles={{ root: { textAlign: col?.align || 'left' } }}>{v}</Fluent.Link>
            </TooltipWrapper>
          )
        }

        return <TooltipWrapper cellOverflow={col.cellOverflow}>{v}</TooltipWrapper>
      },
      onRenderItemColumn = (item?: Fluent.IObjectWithKey & Dict<any>, _idx?: U, col?: WaveColumn) => {
        const align = col?.align || 'left'
        return <div style={{ display: 'flex', justifyContent: align, textAlign: align }}>{getCellComponent(item, _idx, col)}</div>
      },
      // HACK: fixed jumping scrollbar issue when scrolling into the end of list with all groups expanded - https://github.com/microsoft/fluentui/pull/5204 
      getGroupHeight = (group: Fluent.IGroup) => {
        const
          rowHeight = m.columns.some(c => c.cell_type?.progress) ? 76 : 48,
          groupHeaderHeight = 48
        return groupHeaderHeight + (group.isCollapsed ? 0 : rowHeight * group.count)
      }

    React.useEffect(() => {
      setColumns(cols => m.columns.map(tableToWaveColumn).map((col, idx) => ({ ...cols[idx], ...col })))
    }, [m.columns, tableToWaveColumn])
    React.useImperativeHandle(ref, () => ({
      resetSortIcons: () => {
        setColumns(columns => columns.map(col => {
          if (col.iconName) col.iconName = undefined
          return col
        }))
      }
    }))

    return (
      <>
        <Fluent.DetailsList
          styles={styles}
          items={filteredItems}
          columns={columns}
          constrainMode={Fluent.ConstrainMode.unconstrained}
          layoutMode={Fluent.DetailsListLayoutMode.fixedColumns}
          groups={groups}
          groupProps={{
            onToggleCollapseAll,
            onRenderHeader: onRenderGroupHeader,
            headerProps: { onToggleCollapse },
            isAllGroupsCollapsed: m.groups?.every(({ collapsed = true }) => collapsed),
            showEmptyGroups: true
          }}
          getGroupHeight={getGroupHeight}
          selection={selection}
          selectionMode={isSingle ? Fluent.SelectionMode.single : isMultiple ? Fluent.SelectionMode.multiple : Fluent.SelectionMode.none}
          selectionPreservedOnEmptyClick
          onItemInvoked={isMultiple || isSingle ? undefined : onItemInvoked}
          onRenderRow={onRenderRow}
          onRenderItemColumn={onRenderItemColumn}
          onRenderDetailsHeader={onRenderDetailsHeader}
          checkboxVisibility={checkboxVisibilityMap[m.checkbox_visibility || 'on-hover']}
        />
        {colContextMenuList && <Fluent.ContextualMenu {...colContextMenuList} />}
      </>
    )
  }),
  Pagination = ({ currentPage, onPageChange, pagination }: PaginationProps) => {
    const
      { total_rows, rows_per_page } = pagination,
      lastPage = Math.ceil(total_rows / rows_per_page),
      btnStyles: Fluent.IButtonStyles = { rootDisabled: { background: 'transparent' }, root: { marginLeft: -8 } },
      isLastPage = currentPage === lastPage || lastPage === 0

    return (
      <span>
        <span style={{ marginRight: 15 }}>
          {
            total_rows
              ? <><b>{((currentPage - 1) * rows_per_page) + 1}</b> to <b>{isLastPage ? total_rows : currentPage * rows_per_page}</b> of <b>{total_rows}</b></>
              : <><b>0</b> to <b>0</b> of <b>0</b></>
          }
        </span>
        <Fluent.IconButton iconProps={{ iconName: 'DoubleChevronLeft' }} disabled={currentPage === 1} onClick={() => onPageChange(1)} styles={btnStyles} title='First page' />
        <Fluent.IconButton iconProps={{ iconName: 'ChevronLeft' }} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} styles={btnStyles} title='Previous page' />
        <span style={{ margin: margin(0, 8) }}>Page <b>{currentPage}</b> of <b>{lastPage || 1}</b></span>
        <Fluent.IconButton iconProps={{ iconName: 'ChevronRight' }} disabled={isLastPage} onClick={() => onPageChange(currentPage + 1)} styles={btnStyles} title='Next page' />
        <Fluent.IconButton iconProps={{ iconName: 'DoubleChevronRight' }} disabled={isLastPage} onClick={() => onPageChange(lastPage)} styles={btnStyles} title='Last page' />
      </span>
    )
  },
  Footer = ({ m, isFilterable, isSearchable, displayedRows, reset, currentPage, onPageChange }: FooterProps) => {
    const
      footerItems: Fluent.ICommandBarItemProps[] = [],
      buttonStyles = { root: { background: cssVar('$card') } },
      download = () => {
        if (m.pagination && m.events?.includes('download')) {
          wave.emit(m.name, 'download', true)
          return
        }
        // TODO: Prompt a dialog for name, encoding, etc.
        const
          dataRows = (m.groups ? m.groups.flatMap(({ rows }) => rows) : m.rows)?.map(({ cells }) => cells) || [],
          data = toCSV([m.columns.map(({ label, name }) => label || name), ...dataRows]),
          a = document.createElement('a'),
          // Add BOM prefix to data. This is required to export unicode characters in the table correctly
          // Reference: https://stackoverflow.com/a/18251283/1970068
          blob = new Blob(['\uFEFF', data], { type: "text/csv;charset=utf-8," }),
          url = window.URL.createObjectURL(blob)

        a.href = url
        a.download = 'exported_data.csv'
        a.click()

        window.URL.revokeObjectURL(url)
      }

    if (m.downloadable) footerItems.push({ key: 'download', text: 'Download data', iconProps: { iconName: 'Download' }, onClick: download, buttonStyles })
    if (m.resettable) footerItems.push({ key: 'reset', text: 'Reset table', iconProps: { iconName: 'Refresh' }, onClick: reset, buttonStyles })

    return (
      <Fluent.Stack
        horizontal
        horizontalAlign='space-between'
        verticalAlign='center'
        className='wave-s12'
        styles={{
          root: {
            background: cssVar('$neutralLight'),
            borderRadius: '0 0 4px 4px',
            paddingLeft: 12,
            height: 46,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
          }
        }}>
        {
          !m.pagination && (isFilterable || isSearchable) && (
            <Fluent.Text variant='smallPlus' block styles={{ root: { whiteSpace: 'nowrap', color: cssVar('$text') } }}>
              <b style={{ paddingLeft: 5 }}>{displayedRows}</b>
            </Fluent.Text>
          )
        }
        {m.pagination && <Pagination pagination={m.pagination} currentPage={currentPage} onPageChange={onPageChange} />}
        {
          !!footerItems.length && (
            <Fluent.StackItem grow={1}>
              <Fluent.CommandBar items={footerItems} styles={{
                root: { background: cssVar('$neutralLight'), '.ms-Button--commandBar': { background: 'transparent' } },
                primarySet: { justifyContent: 'flex-end' }
              }} />
            </Fluent.StackItem>
          )
        }
      </Fluent.Stack>
    )
  }

export const
  XTable = ({ model: m }: { model: Table }) => {
    const
      groupable = m.groupable && (!m.groups || m.pagination),
      getItem = React.useCallback((r: TableRow) => {
        const item: Fluent.IObjectWithKey & Dict<any> = { key: r.name }
        for (let i = 0, n = r.cells.length; i < n; i++) {
          const col = m.columns[i]
          item[col.name] = r.cells[i]
        }
        return item
      }, [m.columns]),
      items = React.useMemo(() =>
        m.groups
          ? m.groups.reduce((acc, { rows, label, collapsed = true }) => {
            acc.push(...rows.map(r => ({ ...getItem(r), group: label, collapsed })))
            return acc
          }, [] as (Fluent.IObjectWithKey & { group?: S, collapsed?: B })[])
          : (m.rows || []).map(getItem)
        , [m.rows, m.groups, getItem]),
      isMultiple = Boolean(m.values?.length || m.multiple),
      isSingle = Boolean(m.value || m.single),
      isFullHeight = m.height === '1',
      [filteredItems, setFilteredItems] = React.useState(items),
      [currentPage, setCurrentPage] = React.useState(1),
      searchableKeys = React.useMemo(() => m.columns.filter(({ searchable }) => searchable).map(({ name }) => name), [m.columns]),
      [searchStr, setSearchStr] = React.useState(''),
      [selectedFilters, setSelectedFilters] = React.useState<Dict<S[]> | null>(null),
      // TODO: Add support for multi-col sort.
      [currentSort, setCurrentSort] = React.useState<{ column: WaveColumn, sortAsc: B } | null>(null),
      [groups, setGroups] = React.useState<Fluent.IGroup[] | undefined>(),
      expandedRefs = React.useRef<{ [key: S]: B } | null>({}),
      [groupByKey, setGroupByKey] = React.useState('*'),
      contentRef = React.useRef<Fluent.IScrollablePane | null>(null),
      tableRef = React.useRef<{ resetSortIcons: () => void } | null>(null),
      skipNextEventEmit = React.useRef<B>(false),
      groupByOptions: Fluent.IDropdownOption[] = React.useMemo(() =>
        groupable ? [{ key: '*', text: '(No Grouping)' }, ...m.columns.map(col => ({ key: col.name, text: col.label }))] : [], [m.columns, groupable]
      ),
      filter = React.useCallback((selectedFilters: Dict<S[]> | null) => {
        // If we have filters, check if any of the data-item's props (filter's keys) equals to any of its filter values.
        setFilteredItems(selectedFilters
          ? items.filter(item => Object.keys(selectedFilters)
            .every(filterKey => !selectedFilters[filterKey].length || selectedFilters[filterKey].some(filterVal => String(item[filterKey]).includes(filterVal)))
          )
          : items
        )
      }, [items]),
      getIsCollapsed = (key: S, expandedRefs: { [key: S]: B } | null) => {
        if (expandedRefs === null) return false
        const expandedRef = expandedRefs[key]
        return expandedRef === undefined || expandedRef
      },
      groupNames = React.useMemo(() => {
        return m.groups
          ? m.groups.reduce((acc, { label }) => acc.add(label), new Set<S>())
          : groupByKey !== '*'
            ? (items as Dict<S>[]).reduce((acc, item) => acc.add(item[groupByKey]), new Set<S>())
            : new Set<S>()
      }, [m.groups, groupByKey, items]),
      makeGroups = React.useCallback((groupByKey: S, filteredItems: (Fluent.IObjectWithKey & Dict<any>)[]) => {
        const allGroups = [...groupNames].reduce((acc, groupName) => {
          acc[groupName] = { key: groupName, name: groupName, startIndex: 0, count: 0, isCollapsed: getIsCollapsed(groupName, expandedRefs.current) }
          return acc
        }, {} as Dict<Fluent.IGroup>)
        let
          groups: Fluent.IGroup[],
          groupedBy: Dict<any> = []

        if (m.groups) {
          filteredItems.forEach(({ group }, idx) => {
            allGroups[group].count === 0
              ? allGroups[group] = { ...allGroups[group], startIndex: idx, count: 1 }
              : allGroups[group].count++
          })
          groups = Object.values(allGroups)
        } else {
          let prevSum = 0
          groupedBy = groupByF(filteredItems, groupByKey)
          const
            groupedByKeys = Object.keys(groupedBy),
            groupByColType = m.columns.find(c => c.name === groupByKey)?.data_type

          groupedByKeys.forEach((key, i) => {
            if (i !== 0) {
              const prevKey = groupedByKeys[i - 1]
              prevSum += groupedBy[prevKey].length
            }
            allGroups[key] = { key, name: key, startIndex: prevSum, count: groupedBy[key].length, isCollapsed: getIsCollapsed(key, expandedRefs.current) }
          })

          if (groupByColType === 'time') Object.keys(allGroups).forEach(key => { allGroups[key].name = valueToDateString(key) })

          groups = Object.values(allGroups).sort(({ name: name1 }, { name: name2 }) => {
            const numName1 = Number(name1), numName2 = Number(name2)
            if (!isNaN(numName1) && !isNaN(numName2)) return numName1 - numName2

            const dateName1 = Date.parse(name1), dateName2 = Date.parse(name2)
            if (!isNaN(dateName1) && !isNaN(dateName2)) return dateName1 - dateName2

            return name2 < name1 ? 1 : -1
          })
        }
        return { groupedBy, groups }
      }, [groupNames, m.columns, m.groups]),
      initGroups = React.useCallback(() => {
        setGroupByKey(groupByKey => {
          setFilteredItems(filteredItems => {
            const { groupedBy, groups } = makeGroups(groupByKey, filteredItems)
            setGroups(groups)
            return m.groups ? filteredItems : Object.values(groupedBy).flatMap(arr => arr)
          })
          return groupByKey
        })
      }, [m.groups, makeGroups]),
      search = React.useCallback(() => {
        setSearchStr(searchString => {
          const _searchStr = searchString.toLowerCase()
          if (!_searchStr || !searchableKeys.length) return searchString || ''

          setFilteredItems(filteredItems => filteredItems.filter(i => searchableKeys.some(key => (i[key] as S).toLowerCase().includes(_searchStr))))
          return searchString || ''
        })
      }, [searchableKeys]),
      fireSearchEvent = (searchStr: S) => {
        wave.emit(m.name, 'search', { value: searchStr, cols: searchableKeys })
        setCurrentPage(1)
      },
      onSortChange = React.useCallback((column: WaveColumn, sortAsc: B) => {
        if (m.pagination && m.events?.includes('sort')) {
          wave.emit(m.name, 'sort', { [column.fieldName || column.name]: sortAsc })
          setCurrentPage(1)
          return
        }
        setGroups(groups => {
          if (groups) {
            setFilteredItems(filteredItems => [...groups]
              // sorts groups by startIndex to match its order in filteredItems
              .sort((group1, group2) => group1.startIndex - group2.startIndex)
              .reduce((acc, group) => [...acc, ...filteredItems.slice(group.startIndex, acc.length + group.count).sort(sortingF(column, sortAsc))],
                [] as any[]) || [])
          }
          else setFilteredItems(filteredItems => [...filteredItems].sort(sortingF(column, sortAsc)))
          return groups
        })
        setCurrentSort({ column, sortAsc })
      }, [m.events, m.name, m.pagination]),
      debouncedFireSearchEvent = React.useRef(wave.debounce(500, fireSearchEvent)),
      onSearchChange = React.useCallback((_e?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, searchStr = '') => {
        setSearchStr(searchStr)

        if (m.pagination && m.events?.includes('search')) {
          debouncedFireSearchEvent.current(searchStr)
          return
        }
        if (!searchStr && !selectedFilters) {
          if (currentSort) setFilteredItems([...items].sort(sortingF(currentSort.column, currentSort.sortAsc)))
          else setFilteredItems(items)
          setGroups(groups => {
            if (groups) initGroups()
            return groups
          })
          return
        }

        filter(selectedFilters)
        search()
        if (currentSort) setFilteredItems(filteredItems => [...filteredItems].sort(sortingF(currentSort.column, currentSort.sortAsc)))

        setGroups(groups => {
          if (groups) initGroups()
          return groups
        })
      }, [m.pagination, m.events, selectedFilters, filter, search, currentSort, items, initGroups]),
      onGroupByChange = (_e: React.FormEvent<HTMLDivElement>, option?: Fluent.IDropdownOption) => {
        if (!option) return
        if (m.pagination) {
          wave.emit(m.name, 'group_by', option.key)
          setCurrentPage(1)
          setGroupByKey(option.key as S)
          return
        }
        reset()
        if (option.key === '*') return

        setGroupByKey(option.key as S)
        expandedRefs.current = {}
        initGroups()
      },
      onPageChange = React.useCallback((newPage: U) => {
        if (m.pagination && m.events?.includes('page_change')) {
          setCurrentPage(newPage)
          wave.emit(m.name, 'page_change', { offset: (newPage - 1) * m.pagination.rows_per_page })
          if (contentRef?.current) {
            // Scroll table content to top after page change.
            // @ts-ignore
            contentRef.current._contentContainer.current.scrollTop = 0
          }
        }
      }, [m.events, m.name, m.pagination]),
      isSearchable = !!searchableKeys.length,
      isFilterable = m.columns.some(c => c.filterable),
      shouldShowFooter = m.downloadable || m.resettable || isSearchable || isFilterable || !!m.pagination,
      onFilterChange = React.useCallback((filterKey: S, filterVal: S, checked?: B) => {
        setSelectedFilters(selectedFilters => {
          const filters = selectedFilters || {}
          if (checked) {
            if (filters[filterKey]) filters[filterKey].push(filterVal)
            else filters[filterKey] = [filterVal]
          } else {
            filters[filterKey] = filters[filterKey].filter(f => f !== filterVal)
          }
          if (m.pagination && m.events?.includes('filter')) {
            wave.emit(m.name, 'filter', filters)
            setCurrentPage(1)
          } else {
            filter(filters)
            search()
            if (currentSort) setFilteredItems(filteredItems => [...filteredItems].sort(sortingF(currentSort.column, currentSort.sortAsc)))
            setGroups(groups => {
              if (groups) initGroups()
              return groups
            })
          }
          return filters
        })
      }, [currentSort, filter, initGroups, m.events, m.name, m.pagination, search]),
      // TODO: Make filter options in dropdowns dynamic.
      reset = React.useCallback(() => {
        setSelectedFilters(null)
        setSearchStr('')
        setGroups(undefined)
        setCurrentSort(null)
        if (m.groups) initGroups()
        expandedRefs.current = {}
        setGroupByKey('*')
        tableRef.current?.resetSortIcons()

        if (m.pagination && m.events?.includes('reset')) {
          wave.emit(m.name, 'reset', true)
          setCurrentPage(1)
          return
        }

        filter(null)
        search()
      }, [filter, initGroups, m.events, m.groups, m.name, m.pagination, search]),
      selection = React.useMemo(() => new Fluent.Selection({
        onSelectionChanged: () => {
          const selectedItemKeys = selection.getSelection().map(item => item.key as S)
          wave.args[m.name] = selectedItemKeys
          if (!skipNextEventEmit.current && m.events?.includes('select')) wave.emit(m.name, 'select', selectedItemKeys)
        }
      }), [m.name, m.events]),
      computeHeight = () => {
        if (m.height) return m.height
        if (items.length > 10) return 500

        const
          topToolbarHeight = searchableKeys.length || groupable ? (groupable ? 74 : 48) : 0,
          headerHeight = 50,
          rowHeight = m.columns.some(c => c.cell_type?.progress) ? 76 : 48,
          footerHeight = m.downloadable || m.resettable || searchableKeys.length || m.columns.some(c => c.filterable) ? 46 : 0,
          bottomBorder = 2

        return topToolbarHeight + headerHeight + (items.length * rowHeight) + footerHeight + bottomBorder
      },
      setFiltersInBulk = React.useCallback((colKey: S, filters: S[]) => {
        setSelectedFilters(selectedFilters => {
          const newFilters = {
            ...selectedFilters,
            [colKey]: filters
          }
          if (m.pagination && m.events?.includes('filter')) {
            wave.emit(m.name, 'filter', newFilters)
            setCurrentPage(1)
          }
          else {
            filter(newFilters)
            search()
            if (currentSort) setFilteredItems(filteredItems => [...filteredItems].sort(sortingF(currentSort.column, currentSort.sortAsc)))
            setGroups(groups => {
              if (groups) initGroups()
              return groups
            })
          }
          return newFilters
        })
      }, [m.pagination, m.events, m.name, filter, search, currentSort, initGroups])

    React.useEffect(() => {
      wave.args[m.name] = []
      if (isSingle && m.value) {
        skipNextEventEmit.current = true
        selection.setKeySelected(m.value, true, false)
        skipNextEventEmit.current = false
        wave.args[m.name] = [m.value]
      }
      else if (isMultiple && m.values) {
        skipNextEventEmit.current = true
        m.values.forEach(v => selection.setKeySelected(v, true, false))
        skipNextEventEmit.current = false
        wave.args[m.name] = m.values
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useUpdateOnlyEffect(() => {
      setFilteredItems(items)
      if (!m.pagination) reset()
    }, [items])

    useUpdateOnlyEffect(() => { if (groupNames.size) initGroups() }, [groupNames, initGroups])

    React.useEffect(() => {
      if (m.groups) {
        expandedRefs.current = m.groups?.reduce((acc, { label, collapsed = true }) => {
          if (!collapsed) acc[label] = false
          return acc
        }, {} as { [key: S]: B })
        initGroups()
      }
    }, [initGroups, m.groups])

    const dataTableProps: DataTable = React.useMemo(() => ({
      model: m,
      onFilterChange,
      items,
      filteredItems,
      selectedFilters,
      groups,
      expandedRefs,
      selection,
      onSortChange,
      isMultiple,
      isSingle,
      setFiltersInBulk
    }), [filteredItems, groups, expandedRefs, isMultiple, isSingle, items, m, onFilterChange, selectedFilters, selection, onSortChange, setFiltersInBulk])

    return (
      <div data-test={m.name} style={{
        position: 'relative',
        flexGrow: isFullHeight ? 1 : 0,
        height: isFullHeight ? 'auto' : computeHeight()
      }}>
        <Fluent.Stack horizontal>
          {
            groupable && (
              <Fluent.Dropdown
                data-test='groupby'
                label='Group by'
                selectedKey={groupByKey}
                onChange={onGroupByChange}
                options={groupByOptions}
                styles={{ root: { width: 300, marginRight: 'auto' } }}
              />
            )
          }
          {
            !!searchableKeys.length && (
              <Fluent.SearchBox
                data-test='search'
                placeholder='Search'
                onChange={onSearchChange}
                value={searchStr}
                styles={{ root: { width: '50%', maxWidth: 500, marginLeft: 'auto', alignSelf: 'flex-end' } }}
              />
            )
          }
        </Fluent.Stack >
        <Fluent.ScrollablePane
          componentRef={contentRef}
          scrollbarVisibility={Fluent.ScrollbarVisibility.auto}
          styles={{
            root: { top: groupable || searchableKeys.length ? (groupable ? 74 : 48) : 0, bottom: shouldShowFooter ? 46 : 0 },
            stickyAbove: { right: important('12px'), border: border(2, 'transparent'), zIndex: Z_INDEX.TABLE_HEADER },
            contentContainer: { border: border(2, cssVar('$neutralLight')), borderRadius: '4px 4px 0 0' }
          }}>
          {
            isMultiple
              ? <Fluent.MarqueeSelection selection={selection}><DataTable ref={tableRef} {...dataTableProps} /></Fluent.MarqueeSelection>
              : <DataTable ref={tableRef} {...dataTableProps} />
          }
        </Fluent.ScrollablePane>
        {shouldShowFooter && (
          <Footer
            m={m}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isSearchable={isSearchable}
            isFilterable={isFilterable}
            displayedRows={`${formatNum(filteredItems.length)} of ${formatNum(items.length)}`}
            reset={reset}
          />
        )}
      </div >
    )
  }
