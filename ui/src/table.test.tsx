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

import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Table, XTable } from './table'
import { wave } from './ui'

const
  name = 'table',
  cell11 = 'Quick brown fox.',
  cell21 = 'Jumps over a dog.',
  cell31 = 'Wooo hooo.',
  headerRow = 1

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
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTable model={tableProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders time column correctly', () => {
    tableProps = {
      ...tableProps,
      rows: [{ name: 'rowname1', cells: ['1971-07-08T23:09:33'] }],
      columns: [{ name: 'colname1', label: 'Col1', sortable: true, searchable: true, data_type: 'time' }]
    }
    const { getAllByRole } = render(<XTable model={tableProps} />)
    expect(getAllByRole('gridcell')[0].textContent).toBe('7/8/1971, 11:09:33 PM')
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
      expect(getByTestId(name).style.height).toBe('196px')

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
      expect(getByTestId(name).style.height).toBe('322px')
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
      expect(getByTestId(name).style.height).toBe('406px')
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
      expect(getByTestId(name).style.height).toBe('322px')
    })

  })

  describe('Wave calls', () => {
    it('Sets args on init - values not specified', () => {
      render(<XTable model={tableProps} />)
      expect(wave.args[name]).toMatchObject([])
    })

    it('Sets args on init - values specified', () => {
      render(<XTable model={{ ...tableProps, values: ['rowname1'], multiple: true }} />)
      expect(wave.args[name]).toMatchObject(['rowname1'])
    })

    it('Sets args and calls sync on doubleclick', () => {
      const pushMock = jest.fn()
      wave.push = pushMock

      const { getAllByRole } = render(<XTable model={tableProps} />)
      fireEvent.doubleClick(getAllByRole('row')[1])

      expect(wave.args[name]).toMatchObject(['rowname1'])
      expect(pushMock).toHaveBeenCalled()
    })

    it('Sets args and calls sync on first col click', () => {
      const pushMock = jest.fn()
      wave.push = pushMock

      const { getByText } = render(<XTable model={tableProps} />)
      fireEvent.click(getByText(cell21))

      expect(wave.args[name]).toMatchObject(['rowname2'])
      expect(pushMock).toHaveBeenCalled()
    })

    it('Sets args - multiple selection', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true }} />)
      const checkboxes = getAllByRole('checkbox')

      fireEvent.click(checkboxes[1])
      fireEvent.click(checkboxes[2])

      expect(wave.args[name]).toMatchObject(['rowname1', 'rowname2'])
    })

    it('Clicks a column - link set on second col', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1' },
          { name: 'colname2', label: 'Col2', link: true },
        ]
      }
      const pushMock = jest.fn()
      wave.push = pushMock

      const { getByText } = render(<XTable model={tableProps} />)
      fireEvent.click(getByText(cell21))
      expect(pushMock).not.toHaveBeenCalled()

      fireEvent.click(getByText('1'))
      expect(wave.args[name]).toMatchObject(['rowname2'])
      expect(pushMock).toHaveBeenCalled()
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
    const pushMock = jest.fn()
    wave.push = pushMock

    const { getByText } = render(<XTable model={tableProps} />)

    fireEvent.click(getByText(cell21))
    expect(pushMock).not.toHaveBeenCalled()
    expect(wave.args[name]).toMatchObject([])
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
        columns: [{ name: 'colname1', label: 'Col1', sortable: true, searchable: true, data_type: 'time' }]
      }
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('gridcell')[0].textContent).toBe('3/28/2001, 3:09:31 AM')
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('7/8/1971, 11:09:33 PM')
      fireEvent.click(container.querySelector('i[class*=sortingIcon]')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('3/28/2001, 3:09:31 AM')
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
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Searches correctly - no match', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })
      expect(getAllByRole('row')).toHaveLength(headerRow)
    })

    it('Searches correctly - clear search', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })
      expect(getAllByRole('row')).toHaveLength(headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
    })

    it('Searches correctly - search uppercase, contain lowercase', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: cell21.toUpperCase() } })
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Searches correctly - search lowercase, contain uppercase', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: cell21.toLowerCase() } })
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
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

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Filters correctly - multiple options', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      fireEvent.click(getAllByText('2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
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

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      fireEvent.click(getAllByText('2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
    })
  })

  describe('filter - tags', () => {
    beforeEach(() => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'col1' },
          {
            name: 'colname2',
            label: 'col2',
            filterable: true,
            cell_type: {
              tag: {
                name: 'tags',
                tags: [
                  { label: 'TAG1', color: 'red' },
                  { label: 'TAG2', color: 'green' },
                  { label: 'TAG3', color: 'blue' },
                ]
              }
            }
          },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, 'TAG1'] },
          { name: 'rowname2', cells: [cell21, 'TAG2,TAG3'] },
          { name: 'rowname3', cells: [cell31, 'TAG2'] }
        ]
      }
    })

    it('Filters correctly - tags - correct tags are selected', () => {
      const { getByTestId, container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('TAG3')[1].parentElement!)
      // Mimic close and reopen filter context menu.
      fireEvent.click(getByTestId(name))
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      const [tag1, tag2, tag3] = getAllByRole('checkbox')
      expect(tag1).not.toBeChecked()
      expect(tag2).not.toBeChecked()
      expect(tag3).toBeChecked()
    })

    it('Filters correctly - tags - multiple filters', () => {
      const { container, getAllByText, getByText, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('TAG1')[1].parentElement!)
      fireEvent.click(getByText('TAG3').parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
    })

    it('Filters correctly - tags - single', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('TAG1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
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

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Filter -> search - no search match', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: cell11 } })
      expect(getAllByRole('row')).toHaveLength(headerRow)
    })

    it('Filter -> search clear', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
    })

    it('Search -> filter', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: 'w' } })
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Search -> filter clear', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: 'w' } })
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
    })
  })

  describe('Group by', () => {
    const groupByRow = 1
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

      expect(container.querySelectorAll('.ms-GroupedList-group')).toHaveLength(tableProps.rows!.length)
    })

    it('Renders alphabetically sorted group by list - strings', () => {
      const { container, getAllByText, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      const groupHeaders = container.querySelectorAll('.ms-GroupHeader-title')
      expect(groupHeaders[0]).toHaveTextContent(`${cell21}(1)`)
      expect(groupHeaders[1]).toHaveTextContent(`${cell11}(1)`)
      expect(groupHeaders[2]).toHaveTextContent(`${cell31}(1)`)
    })

    it('Renders alphabetically sorted group by list - numbers', () => {
      tableProps = {
        ...tableProps,
        rows: [
          { name: 'rowname1', cells: ['2', 'Group1'] },
          { name: 'rowname2', cells: ['3', 'Group1'] },
          { name: 'rowname3', cells: ['1', 'Group2'] }
        ]
      }
      const { container, getAllByText, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      const groupHeaders = container.querySelectorAll('.ms-GroupHeader-title')
      expect(groupHeaders[0]).toHaveTextContent('1(1)')
      expect(groupHeaders[1]).toHaveTextContent('2(1)')
      expect(groupHeaders[2]).toHaveTextContent('3(1)')
    })

    it('Renders alphabetically sorted group by list - dates', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1', sortable: true, searchable: true, data_type: 'time' },
          { name: 'colname2', label: 'Col2', sortable: true, filterable: true },
        ],
        rows: [
          { name: 'rowname1', cells: ['1994-04-19T23:56:40', 'Group1'] },
          { name: 'rowname2', cells: ['2012-09-14T18:26:01', 'Group1'] },
          { name: 'rowname3', cells: ['1970-04-30T18:02:01', 'Group2'] }
        ]
      }
      const { container, getAllByText, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      const groupHeaders = container.querySelectorAll('.ms-GroupHeader-title')
      expect(groupHeaders[0]).toHaveTextContent(`${new Date('1970-04-30T18:02:01').toLocaleString()}(1)`)
      expect(groupHeaders[1]).toHaveTextContent(`${new Date('1994-04-19T23:56:40').toLocaleString()}(1)`)
      expect(groupHeaders[2]).toHaveTextContent(`${new Date('2012-09-14T18:26:01').toLocaleString()}(1)`)
    })

    it('Does not format dates during group by if data_type != time', () => {
      tableProps = {
        ...tableProps,
        rows: [
          { name: 'rowname1', cells: ['1994-04-19T23:56:40', 'Group1'] },
          { name: 'rowname2', cells: ['2012-09-14T18:26:01', 'Group1'] },
          { name: 'rowname3', cells: ['1970-04-30T18:02:01', 'Group2'] }
        ]
      }
      const { container, getAllByText, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      const groupHeaders = container.querySelectorAll('.ms-GroupHeader-title')
      expect(groupHeaders[0]).toHaveTextContent('1970-04-30T18:02:01(1)')
      expect(groupHeaders[1]).toHaveTextContent('1994-04-19T23:56:40(1)')
      expect(groupHeaders[2]).toHaveTextContent('2012-09-14T18:26:01(1)')
    })

    it('Sorts grouped list', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      let gridcell1 = getAllByRole('gridcell')[3]
      expect(gridcell1.textContent).toBe(cell11)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle i[class*=sortingIcon]')!)

      gridcell1 = getAllByRole('gridcell')[3]
      expect(gridcell1.textContent).toBe(cell21)
    })

    it('Searches grouped list', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow + groupByRow)
      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      const filteredItems = tableProps.rows!.filter(row => row.cells.find(cell => cell === cell21)).length
      expect(getAllByRole('row')).toHaveLength(headerRow + groupByRow + filteredItems)
    })

    it('Filters grouped list - single option', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow + groupByRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('Group2')[1].parentElement!)
      const filteredItems = tableProps.rows!.filter(row => row.cells.find(cell => cell === cell21)).length
      expect(getAllByRole('row')).toHaveLength(headerRow + groupByRow + filteredItems)
    })

    it('Filters grouped list - multiple options', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow + groupByRow)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-filterChevron')!)
      fireEvent.click(getAllByText('Group1')[1].parentElement!)
      fireEvent.click(getAllByText('Group2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow + groupByRow)
    })
  })
})