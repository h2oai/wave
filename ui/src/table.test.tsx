import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XTable, Table } from './table'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const
  name = 'table',
  cell11 = 'Quick brown fox.',
  cell21 = 'Jumps over a dog.',
  cell31 = 'Wooo hooo.'

let tableProps: Table

describe('Table.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    tableProps = {
      name,
      columns: [
        { name: 'colname1', label: 'col1', sortable: true, searchable: true },
        { name: 'colname2', label: 'col2', sortable: true, filterable: true },
      ],
      rows: [
        { name: 'rowname1', cells: [cell11, '2'] },
        { name: 'rowname2', cells: [cell21, '1'] },
        { name: 'rowname2', cells: [cell31, '3'] }
      ]
    }
    jest.clearAllMocks()
    T.qd.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTable model={tableProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  describe('Q calls', () => {
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
      fireEvent.doubleClick(getByText(cell21))

      expect(T.qd.args[name]).toMatchObject(['rowname2'])
      expect(syncMock).toHaveBeenCalled()
    })

    it('Sets args - multiple selection', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true }} />)
      const checkboxes = getAllByRole('checkbox');

      fireEvent.click(checkboxes[1])
      fireEvent.click(checkboxes[2])

      expect(T.qd.args[name]).toMatchObject(['rowname1', 'rowname2'])
    })
  })

  describe('sort', () => {
    it('Sorts by collumn - string', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      let gridcell1 = getAllByRole('gridcell')[0]
      expect(gridcell1.textContent).toBe(cell11)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle i[class*=sortingIcon]')!)

      gridcell1 = getAllByRole('gridcell')[0]
      expect(gridcell1.textContent).toBe(cell21)
    })

    it('Sorts by collumn - number', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      let gridcell1 = getAllByRole('gridcell')[1]
      expect(gridcell1.textContent).toBe('2')

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle i[class*=sortingIcon]')!)

      gridcell1 = getAllByRole('gridcell')[1]
      expect(gridcell1.textContent).toBe('1')
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

    it('Does not search when no col is searchable', () => {
      tableProps = {
        ...tableProps, columns: [
          { name: 'colname1', label: 'col1' },
          { name: 'colname2', label: 'col2' },
        ]
      }

      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      // Header row is row as well so expect + 1.
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
      fireEvent.change(getByTestId('search'), { target: { value: '1' } })
      expect(getAllByRole('row')).toHaveLength(tableProps.rows.length + 1)
    })
  })

  describe('filtering', () => {
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
  })
})