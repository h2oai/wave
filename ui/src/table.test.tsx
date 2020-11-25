import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XTable, Table } from './table'
import * as T from './qd'

const
  name = 'table',
  cell11 = 'Quick brown fox.',
  cell21 = 'Jumps over a dog.',
  cell31 = 'Wooo hooo.'

let tableProps: Table

describe('Table.tsx', () => {
  beforeEach(() => {
    tableProps = {
      name,
      columns: [
        { name: 'colname1', label: 'Col1', sortable: true, searchable: true },
        { name: 'colname2', label: 'Col2', sortable: true, filterable: true },
      ],
      rows: [
        { name: 'rowname1', cells: [cell11, '2'] },
        { name: 'rowname2', cells: [cell21, '1'] },
        { name: 'rowname3', cells: [cell31, '3'] }
      ]
    }
    jest.clearAllMocks()
    T.qd.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTable model={tableProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display table when visible is false', () => {
    const { queryByTestId } = render(<XTable model={{ ...tableProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  describe('Height compute', () => {

    it('Computes properly for simple table - header, rows', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1' },
          { name: 'colname2', label: 'Col2' },
        ],
      }
      const { getByTestId } = render(<XTable model={tableProps} />)
      expect(getByTestId(name).style.height).toBe('189px')

    })

    it('Computes properly for searchable table - toptoolbar, header, rows, footer', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1', searchable: true },
          { name: 'colname2', label: 'Col2' },
        ],
      }
      const { getByTestId } = render(<XTable model={tableProps} />)
      expect(getByTestId(name).style.height).toBe('293px')
    })

    it('Computes properly for custom progress cell - toptoolbar, header, rows, footer', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1', searchable: true },
          { name: 'colname2', label: 'Col2', cell_type: { progress: {} } },
        ],
      }
      const { getByTestId } = render(<XTable model={tableProps} />)
      expect(getByTestId(name).style.height).toBe('368px')
    })

    it('Computes properly for custom icon cell - toptoolbar, header, rows, footer', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1', searchable: true },
          { name: 'colname2', label: 'Col2', cell_type: { icon: {} } },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, 'BoxMultiplySolid'] },
          { name: 'rowname2', cells: [cell21, 'BoxMultiplySolid'] },
          { name: 'rowname3', cells: [cell31, 'BoxMultiplySolid'] }
        ]
      }
      const { getByTestId } = render(<XTable model={tableProps} />)
      expect(getByTestId(name).style.height).toBe('314px')
    })

  })

  describe('Q calls', () => {
    it('Sets args on init - values not specified', () => {
      render(<XTable model={tableProps} />)
      expect(T.qd.args[name]).toMatchObject([])
    })

    it('Sets args on init - values specified', () => {
      render(<XTable model={{ ...tableProps, values: ['rowname1'], multiple: true }} />)
      expect(T.qd.args[name]).toMatchObject(['rowname1'])
    })

    it('Sets args and calls sync on doubleclick', () => {
      const syncMock = jest.fn()
      T.qd.sync = syncMock

      const { getAllByRole } = render(<XTable model={tableProps} />)
      fireEvent.doubleClick(getAllByRole('row')[1])

      expect(T.qd.args[name]).toMatchObject(['rowname1'])
      expect(syncMock).toHaveBeenCalled()
    })

    it('Sets args and calls sync on first col click', () => {
      const syncMock = jest.fn()
      T.qd.sync = syncMock

      const { getByText } = render(<XTable model={tableProps} />)
      fireEvent.click(getByText(cell21))

      expect(T.qd.args[name]).toMatchObject(['rowname2'])
      expect(syncMock).toHaveBeenCalled()
    })

    it('Sets args - multiple selection', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true }} />)
      const checkboxes = getAllByRole('checkbox')

      fireEvent.click(checkboxes[1])
      fireEvent.click(checkboxes[2])

      expect(T.qd.args[name]).toMatchObject(['rowname1', 'rowname2'])
    })

    it('Clicks a column - link set on second col', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1' },
          { name: 'colname2', label: 'Col2', link: true },
        ]
      }
      const syncMock = jest.fn()
      T.qd.sync = syncMock

      const { getByText } = render(<XTable model={tableProps} />)
      fireEvent.click(getByText(cell21))
      expect(syncMock).not.toHaveBeenCalled()

      fireEvent.click(getByText('1'))
      expect(T.qd.args[name]).toMatchObject(['rowname2'])
      expect(syncMock).toHaveBeenCalled()
    })
  })

  it('Does not click a column - link exlpicitly turned off', () => {
    tableProps = {
      ...tableProps,
      columns: [
        { name: 'colname1', label: 'Col1', link: false },
        { name: 'colname2', label: 'Col2' },
      ]
    }
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByText } = render(<XTable model={tableProps} />)

    fireEvent.click(getByText(cell21))
    expect(syncMock).not.toHaveBeenCalled()
    expect(T.qd.args[name]).toMatchObject([])
  })

  describe('sort', () => {
    it('Sorts by column - string', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('gridcell')[0].textContent).toBe(cell11)
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe(cell21)
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe(cell31)
    })

    it('Sorts by column - iso date', () => {
      const date1 = '1971-07-08T23:09:33', date2 = '1976-11-05T19:12:18', date3 = '2001-03-28T03:09:31'
      tableProps = {
        ...tableProps,
        rows: [
          { name: 'rowname1', cells: [date3] },
          { name: 'rowname2', cells: [date2] },
          { name: 'rowname3', cells: [date1] }
        ],
        columns: [
          { name: 'colname1', label: 'Col1', sortable: true, searchable: true, data_type: 'time' },
          { name: 'colname2', label: 'Col2', sortable: true, filterable: true, data_type: 'time' },
        ],
      }
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('gridcell')[0].textContent).toBe(date3)
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe(date1)
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe(date3)
    })

    it('Sorts by column and rerenders icon col', () => {
      const xIcon = 'BoxMultiplySolid', checkIcon = 'BoxCheckmarkSolid'
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1', sortable: true },
          { name: 'colname2', label: 'Col2', cell_type: { icon: {} } },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, xIcon] },
          { name: 'rowname2', cells: [cell21, checkIcon] },
          { name: 'rowname3', cells: [cell31, xIcon] }
        ]
      }
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('gridcell')[1].querySelector('i')?.getAttribute('data-icon-name')).toBe(xIcon)
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[1].querySelector('i')?.getAttribute('data-icon-name')).toBe(checkIcon)
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[1].querySelector('i')?.getAttribute('data-icon-name')).toBe(xIcon)
    })

    it('Sorts by column - number', () => {
      tableProps = {
        ...tableProps,
        rows: [
          { name: 'rowname1', cells: ['111'] },
          { name: 'rowname2', cells: ['25'] },
          { name: 'rowname3', cells: ['9'] }
        ],
        columns: [
          { name: 'colname1', label: 'Col1', sortable: true, searchable: true, data_type: 'number' },
          { name: 'colname2', label: 'Col2', sortable: true, filterable: true, data_type: 'number' },
        ],
      }
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('gridcell')[0].textContent).toBe('111')
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('9')
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('111')
    })
  })

  describe('search', () => {
    it('Searches correctly', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(2)
    })

    it('Searches correctly - no match', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })
      expect(getAllByRole('row')).toHaveLength(1)
    })

    it('Searches correctly - clear search', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })
      expect(getAllByRole('row')).toHaveLength(1)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
    })

    it('Searches correctly - search uppercase, contain lowercase', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.change(getByTestId('search'), { target: { value: cell21.toUpperCase() } })
      expect(getAllByRole('row')).toHaveLength(2)
    })

    it('Searches correctly - search lowercase, contain uppercase', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.change(getByTestId('search'), { target: { value: cell21.toLowerCase() } })
      expect(getAllByRole('row')).toHaveLength(2)
    })

    it('Does not render search when no col is searchable', () => {
      tableProps = {
        ...tableProps, columns: [
          { name: 'colname1', label: 'col1' },
          { name: 'colname2', label: 'col2' },
        ]
      }

      const { queryByTestId } = render(<XTable model={tableProps} />)
      expect(queryByTestId('search')).not.toBeInTheDocument()
    })
  })

  describe('filter', () => {
    it('Filters correctly - single option', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2)
    })
    it('Filters correctly - multiple options', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      fireEvent.click(getAllByText('2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
    })

    it('Filters correctly - multiple filters', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'col1', searchable: true },
          { name: 'colname2', label: 'col2', filterable: true },
          { name: 'colname3', label: 'col3', filterable: true },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, '2', 'On'] },
          { name: 'rowname2', cells: [cell21, '1', 'Off'] },
          { name: 'rowname3', cells: [cell31, '3', 'On'] }
        ]
      }
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      fireEvent.click(getAllByText('2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
    })
  })

  describe('filter & search combination', () => {
    beforeEach(() => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'col1', searchable: true },
          { name: 'colname2', label: 'col2', filterable: true },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, '2'] },
          { name: 'rowname2', cells: [cell21, '1'] },
          { name: 'rowname3', cells: [cell31, '1'] }
        ]
      }
    })

    it('Filter -> search', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(3)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(2)
    })

    it('Filter -> search - no search match', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(3)

      fireEvent.change(getByTestId('search'), { target: { value: cell11 } })
      expect(getAllByRole('row')).toHaveLength(1)
    })

    it('Filter -> search clear', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(3)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(2)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(3)
    })

    it('Search -> filter', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)

      fireEvent.change(getByTestId('search'), { target: { value: 'w' } })
      expect(getAllByRole('row')).toHaveLength(3)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2)
    })

    it('Search -> filter clear', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)

      fireEvent.change(getByTestId('search'), { target: { value: 'w' } })
      expect(getAllByRole('row')).toHaveLength(3)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(3)
    })
  })

  describe('Group by', () => {
    beforeEach(() => {
      tableProps = {
        ...tableProps,
        groupable: true,
        rows: [
          { name: 'rowname1', cells: [cell11, 'Group1'] },
          { name: 'rowname2', cells: [cell21, 'Group1'] },
          { name: 'rowname3', cells: [cell31, 'Group2'] }
        ]
      }
    })

    it('Renders grouped list after selection', () => {
      const { container, getAllByText, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      expect(container.querySelectorAll('.ms-GroupedList-group')).toHaveLength(tableProps.rows.length)
    })

    it('Sorts grouped list', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      let gridcell1 = getAllByRole('gridcell')[0]
      expect(gridcell1.textContent).toBe(cell11)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle i[class*=sortingIcon]')!)

      gridcell1 = getAllByRole('gridcell')[0]
      expect(gridcell1.textContent).toBe(cell21)
    })

    it('Searches grouped list', () => {

      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(1)
    })

    it('Filters grouped list - single option', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('Group2')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1)
    })

    it('Filters grouped list - multiple options', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('Group1')[1].parentElement!)
      fireEvent.click(getAllByText('Group2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
    })

    it('Filters grouped list - multiple options', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('Group1')[1].parentElement!)
      fireEvent.click(getAllByText('Group2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length)
    })

  })

})