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
import { Dropdown, XDropdown } from './dropdown'
import { wave } from './ui'

const
  name = 'dropdown-test',
  defaultProps: Dropdown = {
    name,
    label: name,
    choices: [
      { name: 'A', label: 'Choice A' },
      { name: 'B', label: 'Choice B' },
      { name: 'C', label: 'Choice C' },
      { name: 'D', label: 'Choice D' },
    ]
  },
  pushMock = jest.fn()

describe('Dropdown.tsx', () => {
  beforeAll(() => { wave.push = pushMock })
  beforeEach(() => pushMock.mockReset())

  describe('Base dropdown', () => {
    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XDropdown model={defaultProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Calls sync when trigger is on', () => {
      const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, trigger: true }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A'))

      expect(pushMock).toHaveBeenCalled()
    })

    it('Does not call sync when trigger is off', () => {
      const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A'))

      expect(pushMock).not.toHaveBeenCalled()
    })

    it('Returns a single item when selected', () => {
      const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A'))

      expect(wave.args[name]).toBe('A')
    })

    it('Returns a single item on init', () => {
      render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
      expect(wave.args[name]).toBe('A')
    })

    it('Returns multiple items on init', () => {
      render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)
      expect(wave.args[name]).toMatchObject(['A', 'B'])
    })

    it('Returns null when value not specified - init', () => {
      render(<XDropdown model={defaultProps} />)
      expect(wave.args[name]).toBeNull()
    })

    it('Returns multiple items on select', () => {
      const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, values: [] }} />)
      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A').parentElement!)
      fireEvent.click(getByText('Choice B').parentElement!)

      expect(wave.args[name]).toMatchObject(['A', 'B'])
    })

    it('Returns multiple items on init', () => {
      render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)
      expect(wave.args[name]).toMatchObject(['A', 'B'])
    })

    it('Returns null when value not specified - init', () => {
      render(<XDropdown model={defaultProps} />)
      expect(wave.args[name]).toBeNull()
    })

    it('Shows correct selection in UI on select', () => {
      const { getByTestId, getByText, getAllByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByText('Choice B')[0].parentElement!)

      expect(wave.args[name]).toMatchObject(['A', 'B'])
      expect(getByText('Choice A, Choice B')).toBeInTheDocument()
    })

    it('Selects all options on Select all', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)

      fireEvent.click(getByText('Select All'))

      expect(wave.args[name]).toMatchObject(['A', 'B', 'C', 'D'])
    })

    it('Selects all options on Select all - except disabled', () => {
      const choices = [
        { name: 'A', label: 'Choice A' },
        { name: 'B', label: 'Choice B' },
        { name: 'C', label: 'Choice C', disabled: true },
        { name: 'D', label: 'Choice D' },
      ]
      const { getByText } = render(<XDropdown model={{ ...defaultProps, choices, values: ['A'] }} />)

      fireEvent.click(getByText('Select All'))

      expect(wave.args[name]).toMatchObject(['A', 'B', 'D'])
    })

    it('Calls sync on Select all - trigger enabled', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)

      fireEvent.click(getByText('Select All'))

      expect(pushMock).toHaveBeenCalled()
      expect(wave.args[name]).toMatchObject(['A', 'B', 'C', 'D'])
    })

    it('Deselects all options on Deselect all', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)

      fireEvent.click(getByText('Deselect All'))

      expect(wave.args[name]).toMatchObject([])
      expect(pushMock).toHaveBeenCalled()
    })
  })


  describe('Dialog dropdown', () => {
    const dialogProps: Dropdown = {
      ...defaultProps,
      choices: Array.from(Array(101).keys()).map(key => ({ name: String(key), label: `Choice ${key}` }))
    }

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XDropdown model={dialogProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Calls sync on Deselect all - trigger enabled', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['1'], trigger: true }} />)

      expect(wave.args[name]).toMatchObject(['1'])
      fireEvent.click(getByText('Deselect All'))
      expect(wave.args[name]).toMatchObject([])
    })

    it('Returns null when value not specified - init', () => {
      render(<XDropdown model={dialogProps} />)
      expect(wave.args[name]).toBeNull()
    })

    it('Returns multiple items on select', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getByText('Select'))

      expect(wave.args[name]).toMatchObject(['1', '2'])
    })

    it('Sets correct args after filter', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      fireEvent.click(getAllByRole('checkbox')[0])
      fireEvent.click(getByText('Select'))

      expect(wave.args[name]).toMatchObject(['1', '22'])
    })

    it('Shows correct selection in UI - init single value', () => {
      const { getByDisplayValue } = render(<XDropdown model={{ ...dialogProps, value: '1' }} />)
      expect(getByDisplayValue('Choice 1')).toBeInTheDocument()
    })

    it('Shows correct selection in UI - init multi values', () => {
      const { getByDisplayValue } = render(<XDropdown model={{ ...dialogProps, values: ['1', '2'] }} />)
      expect(getByDisplayValue('Choice 1, Choice 2')).toBeInTheDocument()
    })

    it('Shows none selection in UI - deselect', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1', '2'] }} />)
      expect(getByTestId(name)).toHaveValue('Choice 1, Choice 2')

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getByText('Select'))

      expect(getByTestId(name)).toHaveTextContent('')
    })

    it('Shows correct selection in UI - submit', () => {
      const { getByTestId, getByText, queryByDisplayValue, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getByText('Select'))

      expect(queryByDisplayValue('Choice 1, Choice 2')).toBeInTheDocument()
    })

    it('Does not submit values on cancel', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getByText('Cancel'))

      expect(getByTestId(name)).toHaveValue('Choice 1')
    })

    it('Closes dialog on cancel', () => {
      const { getByText, getByTestId, getByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Cancel'))

      expect(getByTestId(name)).toHaveValue('Choice 1')
      expect(getByRole('dialog')).not.toBeVisible()
    })

    it('Closes dialog on submit', () => {
      const { getByText, getByTestId, getByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Select'))

      expect(getByRole('dialog')).not.toBeVisible()
    })

    it('Submits after selection when single valued', () => {
      const { getByTestId, getAllByRole, getByRole } = render(<XDropdown model={dialogProps} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])

      expect(wave.args[name]).toBe('1')
      expect(getByRole('dialog')).not.toBeVisible()
    })

    it('Has correct number of initially checked checkboxes', () => {
      const { getAllByRole, getByTestId } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))

      expect(getAllByRole('checkbox').filter(c => c.getAttribute('aria-checked') === 'true')).toHaveLength(1)
    })

    it('Has correct number of checked checkboxes - check and cancel', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('checkbox').filter(i => i.getAttribute('aria-checked') === 'true')).toHaveLength(0)

      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getAllByRole('checkbox')[3])
      fireEvent.click(getAllByRole('checkbox')[4])
      fireEvent.click(getByText('Cancel'))
      fireEvent.click(getByTestId(name))

      expect(getAllByRole('checkbox').filter(i => i.getAttribute('aria-checked') === 'true')).toHaveLength(0)
    })

    it('Has correct number of checked checkboxes - check and submit', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getAllByRole('checkbox')[3])
      fireEvent.click(getAllByRole('checkbox')[4])
      fireEvent.click(getByText('Select'))
      fireEvent.click(getByTestId(name))

      expect(getAllByRole('checkbox').filter(c => c.getAttribute('aria-checked') === 'true')).toHaveLength(3)
    })

    it('Filters correctly', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
    })

    it('Shows correct number of selected items even during filtering', () => {
      const { getByTestId, getAllByRole, getByText } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getByText('Selected: 0')).toBeInTheDocument()
      fireEvent.click(getAllByRole('checkbox')[2])
      expect(getByText('Selected: 1')).toBeInTheDocument()
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getByText('Selected: 1')).toBeInTheDocument()
    })

    it('Filters correctly - reset filter', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getAllByRole('listitem')).toHaveLength(1)

      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '' } })
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
    })

    it('Resets filtered items on cancel', () => {
      const { getByTestId, getAllByRole, getByText } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
      fireEvent.click(getByText('Cancel'))
      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
    })

    it('Resets filtered items on submit', () => {
      const { getByTestId, getAllByRole, getByText } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
      fireEvent.click(getByText('Select'))
      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
    })

    it('Resets filtered items on single valued submit', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={dialogProps} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '22' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
      fireEvent.click(getAllByRole('checkbox')[0])
      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(40) // Fluent Detaillist uses virtualization, so only first 40 listitems are rendered.
    })

    it(`Displays dialog when choices > 100 and 'popup' prop is not provided`, () => {
      const { getByTestId, queryByRole } = render(<XDropdown model={dialogProps} />)

      expect(queryByRole('dialog')).not.toBeInTheDocument()
      fireEvent.click(getByTestId(name))
      expect(queryByRole('dialog')).toBeInTheDocument()
    })

    it(`Displays dialog when choices > 100 and 'popup' prop is set as 'auto'`, () => {
      const { getByTestId, queryByRole } = render(<XDropdown model={dialogProps} />)

      expect(queryByRole('dialog')).not.toBeInTheDocument()
      fireEvent.click(getByTestId(name))
      expect(queryByRole('dialog')).toBeInTheDocument()
    })

    it(`Displays dialog when choices < 100 and 'popup' prop is set as 'always'`, () => {
      dialogProps.popup = 'always'
      dialogProps.choices = [{ name: 'A' }]
      const { getByTestId, queryByRole } = render(<XDropdown model={dialogProps} />)

      expect(queryByRole('dialog')).not.toBeInTheDocument()
      fireEvent.click(getByTestId(name))
      expect(queryByRole('dialog')).toBeInTheDocument()
    })

    it(`Does not displays dialog when choices > 100 and 'popup' prop is set as 'never'`, () => {
      dialogProps.popup = 'never'
      const { getByTestId, queryByRole } = render(<XDropdown model={dialogProps} />)

      fireEvent.click(getByTestId(name))

      expect(queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})