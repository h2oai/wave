import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XTable, Table } from './table'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'table'
const tableProps: Table = {
  name,
  columns: [{ name: 'colname1', label: 'col1' }],
  rows: [{ name: 'rowname1', cells: ['cell1'] }, { name: 'rowname2', cells: ['cell2'] }]
}

describe('Table.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    jest.clearAllMocks()
    T.qd.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTable model={tableProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
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
    fireEvent.doubleClick(getByText('cell1'))

    expect(T.qd.args[name]).toMatchObject(['rowname1'])
    expect(syncMock).toHaveBeenCalled()
  })

  it('Sets args - multiple selection', () => {
    const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true }} />)
    const checkboxes = getAllByRole('checkbox')

    fireEvent.click(checkboxes[1])
    fireEvent.click(checkboxes[2])

    expect(T.qd.args[name]).toMatchObject(['rowname1', 'rowname2'])
  })

})