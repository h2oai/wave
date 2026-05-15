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
import { KeyCodes } from '@fluentui/react'

const
  name = 'table',
  cell11 = 'Quick brown fox.',
  cell21 = 'Jumps over a dog.',
  cell31 = 'Wooo hooo.',
  path = 'https://wave.h2o.ai/img/logo.svg',
  headerRow = 1,
  groupHeaderRowsCount = 2,
  filteredItem = 1,
  emitMock = jest.fn(),
  tagsColumn = {
    name: 'tagsColumn',
    label: 'tagsColumn',
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
  filterSelectorName = 'i[class^="filterIcon"]'

let tableProps: Table
let sortTableProps: Table

describe('Table.tsx', () => {
  beforeAll(() => {
    wave.debounce = jest.fn((_t, f) => (...args: any[]) => f(...args))
    wave.emit = emitMock
  })
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
    emitMock.mockClear()
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
      columns: [{ name: 'colname1', label: 'Col1', data_type: 'time' }]
    }
    const { getAllByRole } = render(<XTable model={tableProps} />)
    expect(getAllByRole('gridcell')[0].textContent).toBe('7/8/1971, 11:09:33 PM')
  })

  it('Renders time column correctly - unix epoch', () => {
    tableProps = {
      ...tableProps,
      rows: [{ name: 'rowname1', cells: ['1655941828434'] }],
      columns: [{ name: 'colname1', label: 'Col1', data_type: 'time' }]
    }
    const { getAllByRole } = render(<XTable model={tableProps} />)
    expect(getAllByRole('gridcell')[0].textContent).toBe('6/23/2022, 12:50:28 AM')
  })

  it('Renders tags correctly', () => {
    tableProps = {
      ...tableProps,
      columns: [tagsColumn],
      rows: [
        { name: 'rowname1', cells: ['TAG1'] },
        { name: 'rowname2', cells: ['TAG2,TAG3'] },
        { name: 'rowname3', cells: ['TAG2'] }
      ]
    }

    const { container, getAllByRole, getAllByTestId } = render(<XTable model={tableProps} />)
    fireEvent.click(container.querySelector(filterSelectorName)!)

    const checkboxes = getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)

    checkboxes.forEach(c => expect(c).not.toBeChecked())

    expect(getAllByTestId('tags')[0].childElementCount).toBe(1)
    expect(getAllByTestId('tags')[1].childElementCount).toBe(2)
    expect(getAllByTestId('tags')[2].childElementCount).toBe(1)
  })

  it('Does not render empty tags', () => {
    tableProps = {
      ...tableProps,
      columns: [tagsColumn],
      rows: [
        { name: 'rowname1', cells: ['TAG1'] },
        { name: 'rowname2', cells: ['TAG2,TAG1'] },
        { name: 'rowname3', cells: [''] }
      ]
    }

    const { container, getAllByRole, getAllByTestId } = render(<XTable model={tableProps} />)

    fireEvent.click(container.querySelector(filterSelectorName)!)

    expect(getAllByRole('checkbox')).toHaveLength(2)

    const [tags1, tags2, tags3] = getAllByTestId('tags')
    expect(tags1.childElementCount).toBe(1)
    expect(tags2.childElementCount).toBe(2)
    expect(tags3.childElementCount).toBe(0)
  })

  it('Ignores items when menu command has download link specified', () => {
    tableProps = {
      ...tableProps,
      columns: [
        { name: 'colname1', label: 'Col1' },
        {
          name: 'colname2', label: 'Col2', cell_type: {
            menu: {
              name: 'commands', commands: [
                { name: 'command1', label: 'Command 1', items: [{ name: 'commandItem1', label: 'Command item 1' }] },
                { name: 'command2', label: 'Command 2', path, download: true, items: [{ name: 'commandItem2', label: 'Command item 2' }] },
              ]
            }
          }
        },
      ],
    }
    const { container, queryByText } = render(<XTable model={tableProps} />)
    const contextMenuButton = container.querySelectorAll('i[data-icon-name="MoreVertical"]')[0] as HTMLLIElement
    fireEvent.click(contextMenuButton)

    expect(queryByText('Command item 1')).not.toBeInTheDocument()
    const menuItem1 = document.querySelectorAll('button.ms-ContextualMenu-link')[0] as HTMLButtonElement
    fireEvent.click(menuItem1)
    expect(queryByText('Command item 1')).toBeInTheDocument()

    expect(queryByText('Command item 2')).not.toBeInTheDocument()
    const menuItem2 = document.querySelectorAll('button.ms-ContextualMenu-link')[1] as HTMLButtonElement
    fireEvent.click(menuItem2)
    expect(queryByText('Command item 2')).not.toBeInTheDocument()
  })

  it('Opens link in a new tab when menu command has path specified', () => {
    const windowOpenMock = jest.fn()
    window.open = windowOpenMock
    tableProps = {
      ...tableProps,
      columns: [
        { name: 'colname1', label: 'Col1' },
        {
          name: 'colname2', label: 'Col2', cell_type: {
            menu: {
              name: 'commands', commands: [
                { name: 'command1', label: 'Command 1', path },
              ]
            }
          }
        },
      ],
    }
    const { container } = render(<XTable model={tableProps} />)
    const contextMenuButton = container.querySelectorAll('i[data-icon-name="MoreVertical"]')[0] as HTMLLIElement

    fireEvent.click(contextMenuButton)
    const menuItem = document.querySelectorAll('button.ms-ContextualMenu-link')[0] as HTMLButtonElement
    fireEvent.click(menuItem)

    expect(windowOpenMock).toHaveBeenCalled()
    expect(windowOpenMock).toHaveBeenCalledWith(path, '_blank')
  })

  // TODO: Add a test to check that no event is emitted on rows update. Would result in infinite loop.

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
      expect(getByTestId(name).style.height).toBe('290px')
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
      expect(getByTestId(name).style.height).toBe('374px')
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
      expect(getByTestId(name).style.height).toBe('290px')
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

    it('Sets args on init - value specified', () => {
      render(<XTable model={{ ...tableProps, value: 'rowname1', single: true }} />)
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

    it('Sets args and calls sync on first col click - single selection', () => {
      const pushMock = jest.fn()
      wave.push = pushMock

      const { getByText } = render(<XTable model={{ ...tableProps, single: true }} />)
      fireEvent.click(getByText(cell21))

      expect(wave.args[name]).toMatchObject(['rowname2'])
      expect(pushMock).toHaveBeenCalled()
    })

    it('Sets args and calls sync on first col click - multiple selection', () => {
      const pushMock = jest.fn()
      wave.push = pushMock

      const { getByText } = render(<XTable model={{ ...tableProps, multiple: true }} />)
      fireEvent.click(getByText(cell21))

      expect(wave.args[name]).toMatchObject(['rowname2'])
      expect(pushMock).toHaveBeenCalled()
    })

    it('Do not set args and call sync on doubleclick - single selection', () => {
      const pushMock = jest.fn()
      wave.push = pushMock

      const { getAllByRole } = render(<XTable model={{ ...tableProps, single: true }} />)
      fireEvent.doubleClick(getAllByRole('row')[1])

      expect(wave.args[name]).not.toMatchObject(['rowname1'])
      expect(pushMock).not.toHaveBeenCalled()
    })

    it('Do not set args and call sync on doubleclick - multiple selection', () => {
      const pushMock = jest.fn()
      wave.push = pushMock

      const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true }} />)
      fireEvent.doubleClick(getAllByRole('row')[1])

      expect(wave.args[name]).not.toMatchObject(['rowname1'])
      expect(pushMock).not.toHaveBeenCalled()
    })

    it('Sets args - multiple selection', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true }} />)
      const checkboxes = getAllByRole('checkbox')

      fireEvent.click(checkboxes[1])
      fireEvent.click(checkboxes[2])

      expect(wave.args[name]).toMatchObject(['rowname1', 'rowname2'])
    })

    it('Sets args - single selection', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, single: true }} />)
      const radioButtons = getAllByRole('radio')

      fireEvent.click(radioButtons[0])
      expect(wave.args[name]).toMatchObject(['rowname1'])

      fireEvent.click(radioButtons[1])
      expect(wave.args[name]).toMatchObject(['rowname2'])
    })

    it('Updates single selection', () => {
      const { getAllByRole, rerender } = render(<XTable model={{ ...tableProps, single: true }} />)
      const radioButtons = getAllByRole('radio')

      rerender(<XTable model={{ ...tableProps, single: true, value: 'rowname1' }} />)

      expect(radioButtons[0].firstChild).toHaveClass('is-checked')
      expect(wave.args[name]).toMatchObject(['rowname1'])
    })

    it('Updates multiple selection', () => {
      const { getAllByRole, rerender } = render(<XTable model={{ ...tableProps, multiple: true }} />)
      const checkboxes = getAllByRole('checkbox')

      rerender(<XTable model={{ ...tableProps, multiple: true, values: ['rowname1', 'rowname2'] }} />)

      expect(checkboxes[1].firstChild).toHaveClass('is-checked')
      expect(checkboxes[2].firstChild).toHaveClass('is-checked')
      expect(wave.args[name]).toMatchObject(['rowname1', 'rowname2'])
    })

    it('Clears single selection', () => {
      const { getAllByRole, rerender } = render(<XTable model={{ ...tableProps, single: true, value: 'rowname1' }} />)
      const radioButtons = getAllByRole('radio')

      expect(radioButtons[0].firstChild).toHaveClass('is-checked')
      expect(wave.args[name]).toMatchObject(['rowname1'])

      rerender(<XTable model={{ ...tableProps, single: true, value: undefined }} />)

      expect(radioButtons[0].firstChild).not.toHaveClass('is-checked')
      expect(wave.args[name]).toMatchObject([])
    })

    it('Clears multiple selection', () => {
      const { getAllByRole, rerender } = render(<XTable model={{ ...tableProps, multiple: true, values: ['rowname1', 'rowname2'] }} />)
      const checkBoxes = getAllByRole('checkbox')

      expect(checkBoxes[1].firstChild).toHaveClass('is-checked')
      expect(checkBoxes[2].firstChild).toHaveClass('is-checked')
      expect(wave.args[name]).toMatchObject(['rowname1', 'rowname2'])

      rerender(<XTable model={{ ...tableProps, multiple: true, values: [] }} />)

      expect(checkBoxes[1].firstChild).not.toHaveClass('is-checked')
      expect(checkBoxes[2].firstChild).not.toHaveClass('is-checked')
      expect(wave.args[name]).toMatchObject([])
    })

    it('Does not fire event on single selection update', () => {
      const { rerender } = render(<XTable model={{ ...tableProps, single: true, events: ['select'] }} />)

      rerender(<XTable model={{ ...tableProps, single: true, events: ['select'], value: 'rowname1', }} />)

      expect(emitMock).toHaveBeenCalledTimes(0)
    })

    it('Does not fire event on multiple selection update', () => {
      const { rerender } = render(<XTable model={{ ...tableProps, multiple: true, events: ['select'] }} />)

      rerender(<XTable model={{ ...tableProps, multiple: true, events: ['select'], values: ['rowname1', 'rowname2'] }} />)

      expect(emitMock).toHaveBeenCalledTimes(0)
    })

    it('Fires event - multiple selection - select single', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true, events: ['select'] }} />)
      const checkboxes = getAllByRole('checkbox')

      fireEvent.click(checkboxes[1])

      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'select', ['rowname1'])
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Fires event - multiple selection - select multiple', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, multiple: true, events: ['select'] }} />)
      const checkboxes = getAllByRole('checkbox')

      fireEvent.click(checkboxes[1])
      fireEvent.click(checkboxes[2])

      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'select', ['rowname1', 'rowname2'])
      expect(emitMock).toHaveBeenCalledTimes(2)
    })

    it('Fires event - single selection', () => {
      const { getAllByRole } = render(<XTable model={{ ...tableProps, single: true, events: ['select'] }} />)
      const radioButtons = getAllByRole('radio')

      fireEvent.click(radioButtons[0])
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'select', ['rowname1'])
      expect(emitMock).toHaveBeenCalledTimes(1)

      emitMock.mockClear()

      fireEvent.click(radioButtons[1])
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'select', ['rowname2'])
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Fires event - single selection with initial value', async () => {
      const
        props = { ...tableProps, single: true, events: ['select'], value: 'rowname2' },
        { getAllByRole } = render(<XTable model={{ ...props }} />),
        radioButtons = getAllByRole('radio')
      fireEvent.click(radioButtons[0])
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'select', ['rowname1'])
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Fires event - multiple selection - select single with initial values', async () => {
      const
        values = ['rowname2', 'rowname3'],
        props = { ...tableProps, multiple: true, events: ['select'], values },
        { getAllByRole } = render(<XTable model={{ ...props }} />),
        checkboxes = getAllByRole('checkbox')
      fireEvent.click(checkboxes[1])
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'select', ['rowname1', ...values])
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Does not fire select event when using search', () => {
      const { getAllByRole, getByTestId } = render(<XTable model={{ ...tableProps, multiple: true, events: ['select'] }} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)

      // Select item.
      fireEvent.click(getAllByRole('checkbox')[1])
      expect(emitMock).toHaveBeenCalledTimes(1)

      // Exclude selected item by using search.
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })

      expect(getAllByRole('row')).toHaveLength(headerRow)
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Does not fire select event when using filter', () => {
      const { container, getAllByRole, getAllByText } = render(<XTable model={{ ...tableProps, multiple: true, events: ['select'] }} />)

      // Select item.
      fireEvent.click(getAllByRole('checkbox')[0])
      expect(emitMock).toHaveBeenCalledTimes(1)

      // Exclude selected item by using filter.
      fireEvent.click(container.querySelector(filterSelectorName) as HTMLElement)
      fireEvent.click(getAllByText('2')[1].parentElement as HTMLDivElement)

      expect(getAllByRole('gridcell')[1].textContent).toBe('Quick brown fox.')
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Does not remove selection when searching for text matching selected row', () => {
      const { getAllByRole, getByTestId } = render(<XTable model={{ ...tableProps, multiple: true, events: ['select'] }} />)
      const checkboxes = getAllByRole('checkbox')

      fireEvent.click(checkboxes[1])
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: 'fox' } })
      expect(getAllByRole('row')).toHaveLength(headerRow + filteredItem)
      expect(getAllByRole('checkbox')[1]).toBeChecked()
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

    it('Does not set args and calls sync on click when menu command has download link specified', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1' },
          {
            name: 'colname2', label: 'Col2', cell_type: {
              menu: {
                name: 'commands', commands: [
                  { name: 'command1', label: 'Command 1' },
                  { name: 'command2', label: 'Command 2', path, download: true },
                ]
              }
            }
          },
        ],
      }
      const { container, queryAllByText } = render(<XTable model={tableProps} />)
      const contextMenuButton = container.querySelectorAll('i[data-icon-name="MoreVertical"]')[0] as HTMLLIElement

      expect(wave.args['command1']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(queryAllByText('Command 1')[1])

      expect(wave.args['command1']).toBe('rowname2')

      expect(wave.args['command2']).toBe(false)
      fireEvent.click(contextMenuButton)
      fireEvent.click(queryAllByText('Command 2')[1])

      expect(wave.args['command2']).toBe(false)
    })
  })


  describe('sort', () => {
    beforeEach(() => {
      sortTableProps = {
        ...tableProps,
        rows: [
          { name: '4', cells: ['d', 'closed'] },
          { name: '3', cells: ['c', 'closed'] },
          { name: '2', cells: ['b', 'open'] },
          { name: '1', cells: ['a', 'open'] }
        ],
        columns: [
          { name: 'colname1', label: 'Col1', sortable: true },
          { name: 'colname2', label: 'Col2', filterable: true, searchable: true },
        ],
      }
    })

    it('Does not render sort arrow on sortable columns by default', () => {
      const { container } = render(<XTable model={tableProps} />)

      expect(container.querySelector("[data-icon-name='SortUp']")!).not.toBeInTheDocument()
      expect(container.querySelector("[data-icon-name='SortDown']")!).not.toBeInTheDocument()
    })

    it('Renders sort arrow after clicking on sortable column header', () => {
      const { container } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(container.querySelector("[data-icon-name='SortUp']")!).toBeInTheDocument()
    })

    it('Checks if sort arrow disappears after clicking on another sortable column header', () => {
      const { container } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(container.querySelectorAll("[data-icon-name='SortUp']")!).toHaveLength(1)

      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[1])
      expect(container.querySelectorAll("[data-icon-name='SortUp']")!).toHaveLength(1)
    })

    it('Sorts by column - string', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('gridcell')[0].textContent).toBe(cell11)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe(cell21)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
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
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('7/8/1971, 11:09:33 PM')
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
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
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('gridcell')[1].querySelector('i')?.getAttribute('data-icon-name')).toBe(checkIcon)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
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
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('9')
      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('111')
    })

    it('Fires event when pagination enabled', () => {
      const { container } = render(<XTable model={{ ...tableProps, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['sort'] }} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'sort', { 'colname1': true })
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Keep sort order when applying filters - no groups', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={sortTableProps} />)

      // Sort by first column
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')

      // Open filter menu
      fireEvent.click(container.querySelector(filterSelectorName) as HTMLElement)

      fireEvent.click(getAllByText('closed')[2].parentElement as HTMLDivElement)
      expect(getAllByRole('gridcell')[0].textContent).toBe('c')

      fireEvent.click(getAllByText('closed')[2].parentElement as HTMLDivElement)
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')

      fireEvent.click(getAllByText('open')[2].parentElement as HTMLDivElement)
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')
    })

    it('Keep sort order after Select/Deselect All filters - no groups', () => {
      const { container, getByText, getAllByRole } = render(<XTable model={sortTableProps} />)

      // Sort by first column
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')

      // Open filter menu
      fireEvent.click(container.querySelector(filterSelectorName) as HTMLElement)

      fireEvent.click(getByText('Select All'))
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')

      fireEvent.click(getByText('Deselect All'))
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')
    })

    it('Keep sort order when applying filters - groups', () => {
      tableProps = {
        ...sortTableProps,
        groupable: true,
      }
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('gridcell')[3].textContent).toBe('d')
      expect(getAllByRole('gridcell')[6].textContent).toBe('c')
      expect(getAllByRole('gridcell')[11].textContent).toBe('b')
      expect(getAllByRole('gridcell')[14].textContent).toBe('a')

      // Sort by first column
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])

      expect(getAllByRole('gridcell')[3].textContent).toBe('c')
      expect(getAllByRole('gridcell')[6].textContent).toBe('d')
      expect(getAllByRole('gridcell')[11].textContent).toBe('a')
      expect(getAllByRole('gridcell')[14].textContent).toBe('b')

      // Open filter menu
      fireEvent.click(container.querySelector(filterSelectorName) as HTMLElement)

      fireEvent.click(getAllByText('closed')[3].parentElement as HTMLDivElement)
      expect(getAllByRole('gridcell')[3].textContent).toBe('c')
      expect(getAllByRole('gridcell')[6].textContent).toBe('d')
      expect(getAllByRole('gridcell')[11]).toBeUndefined()
      expect(getAllByRole('gridcell')[14]).toBeUndefined()

      fireEvent.click(getAllByText('closed')[3].parentElement as HTMLDivElement)
      expect(getAllByRole('gridcell')[3].textContent).toBe('c')
      expect(getAllByRole('gridcell')[6].textContent).toBe('d')
      expect(getAllByRole('gridcell')[11]?.textContent).toBe('a')
      expect(getAllByRole('gridcell')[14]?.textContent).toBe('b')
    })

    it('Keep sort order after Select/Deselect All filters - groups', () => {
      tableProps = {
        ...sortTableProps,
        groupable: true,
      }
      const { container, getByText, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)
      const expectCorrectSortOrder = () => {
        expect(getAllByRole('gridcell')[3].textContent).toBe('c')
        expect(getAllByRole('gridcell')[6].textContent).toBe('d')
        expect(getAllByRole('gridcell')[11].textContent).toBe('a')
        expect(getAllByRole('gridcell')[14].textContent).toBe('b')
      }

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('gridcell')[3].textContent).toBe('d')
      expect(getAllByRole('gridcell')[6].textContent).toBe('c')
      expect(getAllByRole('gridcell')[11].textContent).toBe('b')
      expect(getAllByRole('gridcell')[14].textContent).toBe('a')

      // Sort by first column
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])
      expectCorrectSortOrder()

      // Open filter menu
      fireEvent.click(container.querySelector(filterSelectorName) as HTMLElement)

      fireEvent.click(getByText('Select All'))
      expectCorrectSortOrder()

      fireEvent.click(getByText('Deselect All'))
      expectCorrectSortOrder()
    })

    it('Reset filtered items sorting after table reset', () => {
      tableProps = {
        ...sortTableProps,
        resettable: true
      }
      const { container, getAllByText, getAllByRole, getByText } = render(<XTable model={tableProps} />)

      // Sort by first column
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')

      fireEvent.click(getByText('Reset table'))

      // Open filter menu
      fireEvent.click(container.querySelector(filterSelectorName) as HTMLElement)

      fireEvent.click(getAllByText('open')[2].parentElement as HTMLDivElement)
      expect(getAllByRole('gridcell')[0].textContent).toBe('b')
    })

    it('Keep sort order after applying search - no groups', () => {
      tableProps = sortTableProps
      const { container, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      // Sort by first column
      expect(getAllByRole('gridcell')[0].textContent).toBe('d')
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')

      // Search
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })
      expect(getAllByRole('row')).toHaveLength(headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: 'open' } })
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length - 2 + headerRow)
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')
    })

    it('Keep sort order after removing search - no groups', () => {
      tableProps = sortTableProps
      const { container, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      // Sort by first column
      expect(getAllByRole('gridcell')[0].textContent).toBe('d')
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')

      // Search
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })
      expect(getAllByRole('row')).toHaveLength(headerRow)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(getAllByRole('gridcell')[0].textContent).toBe('a')
    })

    it('Keep sort after applying search - groups', () => {
      tableProps = {
        ...sortTableProps,
        groupable: true
      }
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('gridcell')[3].textContent).toBe('d')
      expect(getAllByRole('gridcell')[6].textContent).toBe('c')
      expect(getAllByRole('gridcell')[11].textContent).toBe('b')
      expect(getAllByRole('gridcell')[14].textContent).toBe('a')

      // Sort by first column
      fireEvent.click(container.querySelectorAll('.ms-DetailsHeader-cellTitle')[0])

      expect(getAllByRole('gridcell')[3].textContent).toBe('c')
      expect(getAllByRole('gridcell')[6].textContent).toBe('d')
      expect(getAllByRole('gridcell')[11].textContent).toBe('a')
      expect(getAllByRole('gridcell')[14].textContent).toBe('b')

      // Search
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow + groupHeaderRowsCount)
      fireEvent.change(getByTestId('search'), { target: { value: 'No match!' } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow + groupHeaderRowsCount)

      expect(getAllByRole('gridcell')[3].textContent).toBe('c')
      expect(getAllByRole('gridcell')[6].textContent).toBe('d')
      expect(getAllByRole('gridcell')[11].textContent).toBe('a')
      expect(getAllByRole('gridcell')[14].textContent).toBe('b')
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

    it('Fires event when pagination enabled', () => {
      const { getByTestId } = render(<XTable model={{ ...tableProps, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['search'] }} />)

      fireEvent.change(getByTestId('search'), { target: { value: cell21.toLowerCase() } })
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'search', { value: cell21.toLowerCase(), cols: ['colname1'] })
      expect(emitMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('filter', () => {

    it('Renders correct filters when explicitly specified', () => {
      tableProps = {
        ...tableProps,
        pagination: { total_rows: 10, rows_per_page: 5 },
        columns: [{ name: 'colname1', label: 'Col1', filterable: true, filters: ['foo', 'bar'] }],
        rows: [
          { name: 'rowname1', cells: [cell11] },
          { name: 'rowname2', cells: [cell21] },
          { name: 'rowname3', cells: [cell31] }
        ]
      }
      const { container, getByText, getAllByText } = render(<XTable model={tableProps} />)
      fireEvent.click(container.querySelector(filterSelectorName) as HTMLElement)
      fireEvent.click(getAllByText('1')[1].parentElement as HTMLDivElement)
      expect(getByText('foo')).toBeInTheDocument()
      expect(getByText('bar')).toBeInTheDocument()
    })

    it('Filters correctly - single option', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Filters correctly - select all', () => {
      const { container, getAllByText, getAllByRole, getByText } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      fireEvent.click(getByText('Select All'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
    })

    it('Filters correctly - deselect all', () => {
      const { container, getAllByText, getAllByRole, getByText } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      fireEvent.click(getByText('Deselect All'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
    })

    it('Filters correctly - multiple options', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
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
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      fireEvent.click(getAllByText('2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
    })

    it('Select All on 2nd filter selects all filter checkboxes', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'col1', searchable: true },
          { name: 'colname2', label: 'col2', filterable: true },
          { name: 'colname3', label: 'col3', filterable: true },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, 'col2-val2', 'On'] },
          { name: 'rowname2', cells: [cell21, 'col2-val1', 'Off'] },
          { name: 'rowname3', cells: [cell31, 'col2-val3', 'On'] },
        ]
      }
      const { container, getByLabelText, getAllByRole, getByText, queryByText } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelectorAll(filterSelectorName)[0]!)
      fireEvent.click(getByLabelText('col2-val3'))
      expect(getAllByRole('checkbox', { checked: true })).toHaveLength(1)

      // FluentUI uses a deprecated 'which' property instead of the 'key' prop.
      // Close the menu with escape (does not close when clicking other menu in test).
      fireEvent.keyDown(window, { which: KeyCodes.escape })
      expect(queryByText('Show only')).not.toBeInTheDocument()

      fireEvent.click(container.querySelectorAll(filterSelectorName)[1]!)
      fireEvent.click(getByText('Select All'))
      expect(queryByText('Show only')).toBeInTheDocument()
      expect(getAllByRole('checkbox', { checked: true })).toHaveLength(getAllByRole('checkbox').length)
    })

    it('Fires event when pagination enabled', () => {
      const { container, getAllByText } = render(<XTable model={{ ...tableProps, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['filter'] }} />)

      fireEvent.click(container.querySelector(filterSelectorName) as HTMLDivElement)
      fireEvent.click(getAllByText('1')[3].parentElement as HTMLDivElement)

      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'filter', { 'colname2': ['1'] })
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Fires event when pagination enabled - select all', () => {
      const { container, getByText } = render(<XTable model={{ ...tableProps, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['filter'] }} />)

      fireEvent.click(container.querySelector(filterSelectorName) as HTMLDivElement)
      fireEvent.click(getByText('Select All'))

      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'filter', { 'colname2': ['2', '1', '3'] })
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Fires event when pagination enabled - deselect all', () => {
      const { container, getByText } = render(<XTable model={{ ...tableProps, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['filter'] }} />)

      fireEvent.click(container.querySelector(filterSelectorName) as HTMLDivElement)
      fireEvent.click(getByText('Deselect All'))

      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'filter', { 'colname2': [] })
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Filter counts - manual select', () => {
      const { container, getAllByRole, getByLabelText, queryByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      //select 2 options
      fireEvent.click(getByLabelText('1'))
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('1')
      fireEvent.click(getByLabelText('2'))
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('2')
    })

    it('Filter counts - manual deselect', () => {
      const { container, getAllByRole, getByLabelText, queryByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      //select 2 options
      fireEvent.click(getByLabelText('1'))
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('1')
      fireEvent.click(getByLabelText('2'))
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('2')

      //deselect the 2 options
      fireEvent.click(getByLabelText('1'))
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('1')
      fireEvent.click(getByLabelText('2'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(queryByTestId('filter-count')).toBeNull
    })

    it('Filter counts - select all', () => {
      const { container, getAllByRole, queryByTestId, getByText } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)

      fireEvent.click(getByText('Select All'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent(tableProps.rows!.length.toString())
    })

    it('Filter counts - deselect all', () => {
      const { container, getAllByRole, queryByTestId, getByText } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)

      fireEvent.click(getByText('Select All'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent(tableProps.rows!.length.toString())

      fireEvent.click(getByText('Deselect All'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(queryByTestId('filter-count')).toBeNull
    })

    it('Filter counts - more than 9 selections', () => {

      tableProps = {
        ...tableProps,
        rows: [
          { name: 'rowname1', cells: ['col1a', 'col2a'] },
          { name: 'rowname2', cells: ['col1b', 'col2b'] },
          { name: 'rowname3', cells: ['col1c', 'col2c'] },
          { name: 'rowname4', cells: ['col1d', 'col2d'] },
          { name: 'rowname5', cells: ['col1e', 'col2e'] },
          { name: 'rowname6', cells: ['col1f', 'col2f'] },
          { name: 'rowname7', cells: ['col1g', 'col2g'] },
          { name: 'rowname8', cells: ['col1h', 'col2h'] },
          { name: 'rowname9', cells: ['col1i', 'col2i'] },
          { name: 'rowname10', cells: ['col1j', 'col2j'] },
        ]
      }

      const { container, getAllByRole, queryByTestId, getByText } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)

      fireEvent.click(getByText('Select All'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('9+')

      fireEvent.click(getByText('Deselect All'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(queryByTestId('filter-count')).toBeNull
    })

    it('Filter counts - clear selection with reset', () => {
      const { container, getAllByRole, getByLabelText, queryByTestId, getByText } = render(<XTable model={{ ...tableProps, resettable: true }} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      //select 2 options
      fireEvent.click(getByLabelText('1'))
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('1')
      fireEvent.click(getByLabelText('2'))
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
      expect(queryByTestId('filter-count')).toHaveTextContent('2')

      //hit reset to clear the 2 options
      fireEvent.click(getByText('Reset table'))
      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      expect(queryByTestId('filter-count')).toBeNull
    })
  })


  describe('filter - tags', () => {
    beforeEach(() => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'col1' },
          tagsColumn
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

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('TAG3')[1].parentElement!)
      // Mimic close and reopen filter context menu.
      fireEvent.click(getByTestId(name))
      fireEvent.click(container.querySelector(filterSelectorName)!)
      const [tag1, tag2, tag3] = getAllByRole('checkbox')
      expect(tag1).not.toBeChecked()
      expect(tag2).not.toBeChecked()
      expect(tag3).toBeChecked()
    })

    it('Filters correctly - tags - multiple filters', () => {
      const { container, getAllByText, getByText, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('TAG1')[1].parentElement!)
      fireEvent.click(getByText('TAG3').parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
    })

    it('Filters correctly - tags - single', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('TAG1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Fires event when pagination enabled', () => {
      const { container, getAllByText } = render(<XTable model={{ ...tableProps, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['filter'] }} />)

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('TAG1')[1].parentElement!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'filter', { 'tagsColumn': ['TAG1'] })
      expect(emitMock).toHaveBeenCalledTimes(1)
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
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Filter -> search - no search match', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('1')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: cell11 } })
      expect(getAllByRole('row')).toHaveLength(headerRow)
    })

    it('Filter -> search clear', () => {
      const { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)

      fireEvent.click(container.querySelector(filterSelectorName)!)
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

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
    })

    it('Search -> filter clear', () => {
      const { container, getAllByRole, getByTestId, getByLabelText } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(tableProps.rows!.length + headerRow)

      fireEvent.change(getByTestId('search'), { target: { value: 'w' } })
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getByLabelText('1'))
      expect(getAllByRole('row')).toHaveLength(1 + headerRow)
      fireEvent.click(getByLabelText('1'))
      expect(getAllByRole('row')).toHaveLength(2 + headerRow)
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

      expect(container.querySelectorAll('.ms-GroupedList-group')).toHaveLength(tableProps.rows!.length)
    })

    it('Renders grouped list after selection, removes grouping when "No Grouping" chosen', () => {
      const { container, getAllByText, getByTestId, getByText } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      expect(container.querySelectorAll('.ms-GroupedList-group')).toHaveLength(tableProps.rows!.length)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getByText('(No Grouping)')!)

      expect(container.querySelectorAll('.ms-GroupedList-group')).toHaveLength(0)
    })

    it('Checks if grouped list is collapsed after selection', () => {
      const { getAllByRole, getAllByText, getByTestId } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      expect(getAllByRole('row')).toHaveLength(headerRow + tableProps.rows!.length)
    })

    it("Checks if empty groups are shown - filter", () => {
      const
        { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />),
        expectAllGroupsToBeVisible = () => {
          expect(getAllByText('Group1')[0]).toBeVisible()
          expect(getAllByText('Group2')[0]).toBeVisible()
        },
        expectAllItemsToBePresent = () => {
          const [firstGroupHeader, secondGroupHeader] = container.querySelectorAll('.ms-GroupHeader-title')
          expect(firstGroupHeader).toHaveTextContent('Group1(2)')
          expect(secondGroupHeader).toHaveTextContent('Group2(1)')
          expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
        }

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('Group1')[3].parentElement!)

      expectAllGroupsToBeVisible()
      expect(container.querySelectorAll('.ms-GroupHeader-title')[0]).toHaveTextContent('Group1(2)')
      expect(container.querySelectorAll('.ms-GroupHeader-title')[1]).toHaveTextContent('Group2(0)')
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length - 1)

      fireEvent.click(getAllByText('Group1')[3].parentElement!)

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()
    })

    it("Checks if empty groups are shown - search", () => {
      const
        { container, getAllByText, getAllByRole, getByTestId } = render(<XTable model={tableProps} />),
        expectAllGroupsToBeVisible = () => {
          expect(getAllByText('Group1')[0]).toBeVisible()
          expect(getAllByText('Group2')[0]).toBeVisible()
        },
        expectAllItemsToBePresent = () => {
          const [firstGroupHeader, secondGroupHeader] = container.querySelectorAll('.ms-GroupHeader-title')
          expect(firstGroupHeader).toHaveTextContent('Group1(2)')
          expect(secondGroupHeader).toHaveTextContent('Group2(1)')
          expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
        }

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()

      fireEvent.change(getByTestId('search'), { target: { value: cell31 } })

      expectAllGroupsToBeVisible()
      expect(container.querySelectorAll('.ms-GroupHeader-title')[0]).toHaveTextContent('Group1(0)')
      expect(container.querySelectorAll('.ms-GroupHeader-title')[1]).toHaveTextContent('Group2(1)')
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)

      fireEvent.change(getByTestId('search'), { target: { value: '' } })

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()
    })

    it('Does not render group by dropdown when groups are set but pagination is not', () => {
      const { queryByTestId } = render(<XTable model={{ ...tableProps, groups: [] }} />)
      expect(queryByTestId('groupby')).not.toBeInTheDocument()
    })

    it('Fires event when pagination enabled', () => {
      const { getByTestId, getAllByText } = render(<XTable model={{ ...tableProps, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['group_by'] }} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_by', 'colname1')
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Checks if groups are correct when grouping by multiple times', () => {
      const
        { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />),
        groupBy = (col: string) => {
          fireEvent.click(getByTestId('groupby'))
          fireEvent.click(getAllByText(col)[1]!)
          fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
        }

      groupBy('Col1')

      expect(getAllByRole('row')).toHaveLength(headerRow + 2 * tableProps.rows!.length)
      const groupHeaders = container.querySelectorAll('.ms-GroupHeader-title')
      expect(groupHeaders[0]).toHaveTextContent(`${cell21}(1)`)
      expect(groupHeaders[1]).toHaveTextContent(`${cell11}(1)`)
      expect(groupHeaders[2]).toHaveTextContent(`${cell31}(1)`)

      groupBy('Col2')

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
      expect(container.querySelectorAll('.ms-GroupHeader-title')[0]).toHaveTextContent(`${'Group1'}(2)`)
      expect(container.querySelectorAll('.ms-GroupHeader-title')[1]).toHaveTextContent(`${'Group2'}(1)`)
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

    it('Sorts rows inside the group of the grouped list', () => {
      // test with non-alphabetical groups order to check whether group alphabetical sorting on groupby is considered
      tableProps = {
        ...tableProps,
        rows: [
          { name: 'rowname1', cells: [cell11, 'Group2'] },
          { name: 'rowname2', cells: [cell21, 'Group2'] },
          { name: 'rowname3', cells: [cell31, 'Group1'] }
        ]
      }
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('gridcell')[8].textContent).toBe(cell11)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)

      expect(getAllByRole('gridcell')[8].textContent).toBe(cell21)
    })

    it('Searches grouped list', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Filters grouped list - single option', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('Group2')[2].parentElement!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Filters grouped list - multiple options', () => {
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('Group1')[1].parentElement!)
      fireEvent.click(getAllByText('Group2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
    })

    it('Checks if group name is correct when grouped by column width time data', () => {
      tableProps = {
        ...tableProps,
        groupable: true,
        columns: [
          { name: 'colname1', label: 'Col1' },
          { name: 'colname2', label: 'Col2', data_type: 'time' },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, '1655927271'] },
          { name: 'rowname2', cells: [cell21, '1655927271000'] },
        ]
      }
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)
      expect(container.querySelectorAll('.ms-GroupHeader-title')[0]).toHaveTextContent('1/20/1970, 4:58:47 AM(1)')
      expect(container.querySelectorAll('.ms-GroupHeader-title')[1]).toHaveTextContent('6/22/2022, 8:47:51 PM(1)')
    })

    it('Checks if name of empty group is correct when grouped by column width time data', () => {
      tableProps = {
        ...tableProps,
        groupable: true,
        columns: [
          { name: 'colname1', label: 'Col1' },
          { name: 'colname2', label: 'Col2', data_type: 'time', filterable: true },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, '1655927271'] },
          { name: 'rowname2', cells: [cell21, '1655927271000'] },
        ]
      }
      const { container, getAllByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col2')[1]!)
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + tableProps.rows!.length)

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('6/22/2022, 8:47:51 PM')[2].parentElement!)

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
      expect(container.querySelectorAll('.ms-GroupHeader-title')[0]).toHaveTextContent('1/20/1970, 4:58:47 AM(0)')
      expect(container.querySelectorAll('.ms-GroupHeader-title')[1]).toHaveTextContent('6/22/2022, 8:47:51 PM(1)')
    })

    it('Collapses all group by list - fire event', () => {
      const { container, getAllByText, getByTestId } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      //open all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      emitMock.mockClear()

      //collapse all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', [cell21, cell11, cell31])
    })

    it('Expands all group by list - fire event', () => {
      const { container, getAllByText, getByTestId } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      //open all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', [cell21, cell11, cell31])
    })

    it('Collapses group by list - fire event', () => {
      const { container, getAllByText, getByTestId } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      //open all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      emitMock.mockClear()

      //collapse 1st group
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', [cell21])
    })

    it('Expands group by list - fire event', () => {
      const { container, getAllByText, getByTestId } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      //open 1st group
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', [cell21])
    })
  })

  describe('Groups', () => {
    const
      items = 3,
      firstGroupLabel = 'GroupA',
      secondGroupLabel = 'GroupB',
      groupA = {
        label: firstGroupLabel,
        rows: [
          { name: 'rowname1', cells: [cell11, 'Group2'] },
          { name: 'rowname2', cells: [cell21, 'Group1'] }
        ],
        collapsed: false
      },
      groupB = {
        label: secondGroupLabel,
        rows: [
          { name: 'rowname3', cells: [cell31, 'Group2'] }
        ],
        collapsed: false
      }
    beforeEach(() => {
      tableProps = {
        name,
        columns: [
          { name: 'colname1', label: 'Col1', sortable: true, searchable: true },
          { name: 'colname2', label: 'Col2', sortable: true, filterable: true },
        ],
        groups: [groupA, groupB]
      }
    })

    it('Renders groups', () => {
      const { getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
    })


    it('Searches grouped list', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Sorts rows inside the group of the grouped list', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      expect(getAllByRole('gridcell')[3].textContent).toBe(cell11)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('gridcell')[3].textContent).toBe(cell21)
    })

    it('Filters grouped list - single option', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('Group1')[1].parentElement!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Filters grouped list - multiple options', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('Group1')[1].parentElement!)
      fireEvent.click(getAllByText('Group2')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
    })

    it('Collapses all groups', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)
    })

    it('Expands all groups', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.doubleClick(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
    })

    it('Collapses group', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Expands group', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items - filteredItem)
    })

    it('Collapses all groups - fire event', () => {
      const { container, getAllByRole } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      //collapse all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupA', 'GroupB'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)
    })

    it('Expands all groups - fire event', () => {
      const { container, getAllByRole } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      //collapse all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      emitMock.mockClear()

      //open all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupA', 'GroupB'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
    })

    it('Collapses group - fire event', () => {
      const { container, getAllByRole } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupA'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Expands group - fire event', () => {
      const { container, getAllByRole } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      emitMock.mockClear()

      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupA'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items - filteredItem)
    })

    it('Collapses all groups when some already collapsed - fire event', () => {
      const { container, getAllByRole } = render(<XTable model={{ ...tableProps, events: ['group_change'] }} />)

      //collapse all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupA', 'GroupB'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)
      emitMock.mockClear()

      //open all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupA', 'GroupB'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
      emitMock.mockClear()

      //collapse GroupA
      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupA'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
      emitMock.mockClear()

      //collapse all groups
      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'group_change', ['GroupB'])
      expect(emitMock).toHaveBeenCalledTimes(1)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)
    })

    it('Checks if expanded state is preserved after sort', () => {
      const { container, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
    })

    it('Checks if collapsed state is preserved after filter', () => {
      const { container, getAllByText, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('Group1')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)

      fireEvent.click(getAllByText('Group1')[0].parentElement!)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Checks if expanded state is preserved during search', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it('Checks if expanded state is preserved after search', () => {
      const { getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
    })

    it('Checks if collapsed state is preserved during search', () => {
      const { container, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)
    })

    it('Checks if collapsed state is preserved after search', () => {
      const { container, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount)
    })

    it("Checks if group collapsed in middle of search preserves collapsed state after search", () => {
      const { container, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.change(getByTestId('search'), { target: { value: cell21 } })

      fireEvent.click(container.querySelector('.ms-GroupHeader-expand')!)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it("Checks if group expanded in middle of search preserves expanded state after search", () => {
      const { container, getByTestId, getAllByRole } = render(<XTable model={tableProps} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-collapseButton')!)
      fireEvent.change(getByTestId('search'), { target: { value: cell31 } })
      fireEvent.click(container.querySelectorAll('.ms-GroupHeader-expand')[1]!)
      fireEvent.change(getByTestId('search'), { target: { value: '' } })
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)
    })

    it("Checks if empty custom groups are shown - filter", () => {
      const
        { container, getByText, getAllByText, getAllByRole } = render(<XTable model={tableProps} />),
        groupHeaders = container.querySelectorAll('.ms-GroupHeader-title'),
        expectAllGroupsToBeVisible = () => {
          expect(getByText(firstGroupLabel)).toBeVisible()
          expect(getByText(secondGroupLabel)).toBeVisible()
        },
        expectAllItemsToBePresent = () => {
          expect(groupHeaders[0]).toHaveTextContent(`${firstGroupLabel}(2)`)
          expect(groupHeaders[1]).toHaveTextContent(`${secondGroupLabel}(1)`)
          expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
        }

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()

      fireEvent.click(container.querySelector(filterSelectorName)!)
      fireEvent.click(getAllByText('Group1')[1].parentElement!)

      expectAllGroupsToBeVisible()
      expect(groupHeaders[0]).toHaveTextContent(`${firstGroupLabel}(1)`)
      expect(groupHeaders[1]).toHaveTextContent(`${secondGroupLabel}(0)`)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)

      fireEvent.click(getAllByText('Group1')[1].parentElement!)

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()
    })

    it("Checks if empty custom groups are shown - search", () => {
      const
        { container, getByText, getByTestId, getAllByRole } = render(<XTable model={tableProps} />),
        groupHeaders = container.querySelectorAll('.ms-GroupHeader-title'),
        expectAllGroupsToBeVisible = () => {
          expect(getByText(firstGroupLabel)).toBeVisible()
          expect(getByText(secondGroupLabel)).toBeVisible()
        },
        expectAllItemsToBePresent = () => {
          expect(groupHeaders[0]).toHaveTextContent(`${firstGroupLabel}(2)`)
          expect(groupHeaders[1]).toHaveTextContent(`${secondGroupLabel}(1)`)
          expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + items)
        }

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()

      fireEvent.change(getByTestId('search'), { target: { value: cell31 } })

      expectAllGroupsToBeVisible()
      expect(groupHeaders[0]).toHaveTextContent(`${firstGroupLabel}(0)`)
      expect(groupHeaders[1]).toHaveTextContent(`${secondGroupLabel}(1)`)
      expect(getAllByRole('row')).toHaveLength(headerRow + groupHeaderRowsCount + filteredItem)

      fireEvent.change(getByTestId('search'), { target: { value: '' } })

      expectAllGroupsToBeVisible()
      expectAllItemsToBePresent()
    })

    it("Sort items correctly when empty custom group is present", () => {
      const
        props = { ...tableProps, groups: [groupA, groupB, { label: 'GroupC', rows: [], collapsed: false }] },
        { container, getAllByRole } = render(<XTable model={props} />)

      expect(getAllByRole('gridcell')[3].textContent).toBe(cell11)
      expect(getAllByRole('gridcell')[6].textContent).toBe(cell21)
      expect(getAllByRole('gridcell')[11].textContent).toBe(cell31)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)

      expect(getAllByRole('gridcell')[3].textContent).toBe(cell21)
      expect(getAllByRole('gridcell')[6].textContent).toBe(cell11)
      expect(getAllByRole('gridcell')[11].textContent).toBe(cell31)
    })
  })

  describe('Reset', () => {

    it('Fires event when pagination enabled', () => {
      const { getByText } = render(<XTable model={{ ...tableProps, resettable: true, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['reset'] }} />)
      fireEvent.click(getByText('Reset table'))
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'reset', true)
      expect(emitMock).toHaveBeenCalledTimes(1)
    })

    it('Removes sort arrow after reset', () => {
      const { container, getByText } = render(<XTable model={{ ...tableProps, resettable: true }} />)

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      fireEvent.click(getByText('Reset table'))
      expect(container.querySelector("[data-icon-name='SortUp']")!).not.toBeInTheDocument()
    })

    it('Does not keep sort after reset', () => {
      const { container, getByText, getAllByRole } = render(<XTable model={{ ...tableProps, resettable: true }} />)

      expect(getAllByRole('gridcell')[0].textContent).toBe('Quick brown fox.')
      expect(getAllByRole('gridcell')[2].textContent).toBe('Jumps over a dog.')
      expect(getAllByRole('gridcell')[4].textContent).toBe('Wooo hooo.')

      fireEvent.click(container.querySelector('.ms-DetailsHeader-cellTitle')!)
      expect(getAllByRole('gridcell')[0].textContent).toBe('Jumps over a dog.')
      expect(getAllByRole('gridcell')[2].textContent).toBe('Quick brown fox.')
      expect(getAllByRole('gridcell')[4].textContent).toBe('Wooo hooo.')

      fireEvent.click(getByText('Reset table'))
      expect(getAllByRole('gridcell')[0].textContent).toBe('Quick brown fox.')
      expect(getAllByRole('gridcell')[2].textContent).toBe('Jumps over a dog.')
      expect(getAllByRole('gridcell')[4].textContent).toBe('Wooo hooo.')
    })

    it('Does not keep groups rendered after reset', () => {
      const { container, getAllByText, getByTestId, getByText } = render(<XTable model={{ ...tableProps, groupable: true, resettable: true }} />)

      fireEvent.click(getByTestId('groupby'))
      fireEvent.click(getAllByText('Col1')[1]!)

      expect(container.querySelectorAll('.ms-GroupedList-group')).toHaveLength(3)
      fireEvent.click(getByText('Reset table'))
      expect(container.querySelectorAll('.ms-GroupedList-group')).toHaveLength(0)
    })

  })

  describe('Download', () => {

    it('Fires event when pagination enabled', () => {
      const { getByText } = render(<XTable model={{ ...tableProps, downloadable: true, pagination: { total_rows: 10, rows_per_page: 5 }, events: ['download'] }} />)
      fireEvent.click(getByText('Download data'))
      expect(emitMock).toHaveBeenCalledWith(tableProps.name, 'download', true)
      expect(emitMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Tooltip', () => {
    it('renders info icon only when tooltip prop is specified', () => {
      tableProps = {
        ...tableProps,
        columns: [
          { name: 'colname1', label: 'Col1', sortable: true, searchable: true, tooltip: 'Tooltip for Col1' },
          { name: 'colname2', label: 'Col2', sortable: true, filterable: true },
        ],
        rows: [
          { name: 'rowname1', cells: [cell11, '2'] },
          { name: 'rowname2', cells: [cell21, '1'] },
        ],
      }
      
      const { container, getAllByRole } = render(<XTable model={tableProps} />)
      const headers = getAllByRole('columnheader')
      const infoIcons = container.querySelectorAll("[data-icon-name='info-icon']") as NodeListOf<HTMLElement>
      expect(infoIcons).toHaveLength(1)
  
      const headerKey1 = headers[0].getAttribute('data-item-key')
      if (headerKey1 === 'colname1') {
        expect(headers[0]).toContainElement(infoIcons[0])
      } else {
        expect(headers[0]).not.toContainElement(infoIcons[0])
      }
      const headerKey2 = headers[1].getAttribute('data-item-key')
      if (headerKey2 === 'colname1') {
        expect(headers[1]).toContainElement(infoIcons[0])
      } else {
        expect(headers[1]).not.toContainElement(infoIcons[0])
      }
    })
  })
})
