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

import { fireEvent, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Dropdown, XDropdown } from './dropdown'
import { wave } from './ui'
import { Choice } from './choice_group'

describe('Dropdown.tsx', () => {
  const
    name = 'dropdown-test',
    choicesDisabled: Choice[] = [
      { name: '1', label: 'Choice 1' },
      { name: '2', label: 'Choice 2', disabled: true },
      { name: '3', label: 'Choice 3' }
    ],
    // Need to test if wave.args are correct after calling push so mock the implementation.
    pushMock = jest.fn(() => wave.args = {})

  let defaultProps: Dropdown
  beforeAll(() => { wave.push = pushMock })
  beforeEach(() => {
    // Reset due to model.value mutations.
    defaultProps = {
      name,
      choices: [
        { name: 'A', label: 'Choice A' },
        { name: 'B', label: 'Choice B' },
        { name: 'C', label: 'Choice C' },
        { name: 'D', label: 'Choice D' },
      ]
    }
    pushMock.mockClear()
  })

  describe('Base dropdown', () => {
    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XDropdown model={defaultProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Calls sync when trigger is on', async () => {
      const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, trigger: true }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice A'))

      await waitFor(() => expect(pushMock).toHaveBeenCalledTimes(1))

      expect(wave.args[name]).toBe(undefined)
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
      const { getByText } = render(<XDropdown model={{ ...defaultProps, choices: choicesDisabled, values: ['1'] }} />)

      fireEvent.click(getByText('Select All'))

      expect(wave.args[name]).toMatchObject(['1', '3'])
    })

    it('Do not select all options on Select all - dropdown disabled', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], disabled: true }} />)

      expect(wave.args[name]).toMatchObject(['A'])

      fireEvent.click(getByText('Select All'))

      expect(wave.args[name]).toMatchObject(['A'])
    })

    it('Calls sync on Select all - trigger enabled', async () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)

      fireEvent.click(getByText('Select All'))

      expect(wave.args[name]).toMatchObject(['A', 'B', 'C', 'D'])
      await waitFor(() => expect(pushMock).toHaveBeenCalledTimes(1))
    })

    it('Deselects all options on Deselect all - trigger enabled', async () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)

      fireEvent.click(getByText('Deselect All'))

      expect(wave.args[name]).toMatchObject([])
      await waitFor(() => expect(pushMock).toHaveBeenCalledTimes(1))
    })

    it('Do not deselect all options on Deselect all - dropdown disabled', () => {
      const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], disabled: true }} />)

      expect(wave.args[name]).toMatchObject(['A'])

      fireEvent.click(getByText('Deselect All'))

      expect(wave.args[name]).toMatchObject(['A'])
    })

    describe('Prop changes', () => {
      describe('Single-valued', () => {
        it('Displays new value when "value" prop is updated', () => {
          const { getByRole, rerender } = render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice A')
          expect(wave.args[name]).toBe('A')

          rerender(<XDropdown model={{ ...defaultProps, value: 'B' }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice B')
          expect(wave.args[name]).toBe('B')
        })

        it('Clears input when "value" prop is updated to empty string', () => {
          const { getByRole, rerender } = render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
          expect(getByRole('combobox').children[0]).toHaveTextContent('Choice A')

          rerender(<XDropdown model={{ ...defaultProps, value: '' }} />)
          expect(getByRole('combobox').children[0]).toBeEmptyDOMElement()
        })

        it('Sets wave args to empty string when "value" prop is updated to an empty string', () => {
          const { rerender } = render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
          expect(wave.args[name]).toBe('A')

          rerender(<XDropdown model={{ ...defaultProps, value: '' }} />)
          expect(wave.args[name]).toBe('')
        })

        it('Clears input when "value" prop is updated to undefined (None)', () => {
          const { getByRole, rerender } = render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
          expect(getByRole('combobox').children[0]).toHaveTextContent('Choice A')

          rerender(<XDropdown model={{ ...defaultProps }} />)
          expect(getByRole('combobox').children[0]).toBeEmptyDOMElement()
        })

        it('Sets wave args to null when "value" prop is updated to undefined (None)', () => {
          const { rerender } = render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
          expect(wave.args[name]).toBe('A')

          rerender(<XDropdown model={{ ...defaultProps }} />)
          expect(wave.args[name]).toBeNull()
        })

        it('Displays new value when option is selected and "value" prop is updated', () => {
          const { getByRole, getByText, rerender } = render(<XDropdown model={defaultProps} />)

          fireEvent.click(getByRole('combobox'))
          fireEvent.click(getByText('Choice A'))
          expect(getByRole('combobox')).toHaveTextContent('Choice A')
          expect(wave.args[name]).toBe('A')

          rerender(<XDropdown model={{ ...defaultProps, value: 'B' }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice B')
          expect(wave.args[name]).toBe('B')
        })

        it('Sets wave args when an option is selected and "value" prop updated', () => {
          const { getByRole, getByText, rerender } = render(<XDropdown model={{ ...defaultProps }} />)
          fireEvent.click(getByRole('combobox'))
          fireEvent.click(getByText('Choice A'))
          expect(getByRole('combobox')).toHaveTextContent('Choice A')
          expect(wave.args[name]).toBe('A')

          rerender(<XDropdown model={{ ...defaultProps, value: 'B' }} />)
          expect(wave.args[name]).toBe('B')
        })

        // Tests bug where user selects same option twice and "value" prop updates don't change dropdown value.
        // For more info, read the comment in "onChange" function. 
        it('Sets wave args when same option is selected twice and "value" prop is updated', () => {
          const { getByRole, getAllByText, rerender } = render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)

          fireEvent.click(getByRole('combobox'))
          fireEvent.click(getAllByText('Choice C')[0])
          expect(getByRole('combobox')).toHaveTextContent('Choice C')
          expect(wave.args[name]).toEqual('C')

          fireEvent.click(getByRole('combobox'))
          fireEvent.click(getAllByText('Choice C')[1])
          expect(getByRole('combobox')).toHaveTextContent('Choice C')
          expect(wave.args[name]).toEqual('C')

          rerender(<XDropdown model={{ ...defaultProps, value: 'B' }} />)
          expect(wave.args[name]).toEqual('B')
        })

        it('Allows setting the same value multiple times', () => {
          const { getByRole, getAllByText, rerender } = render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)

          fireEvent.click(getByRole('combobox'))
          fireEvent.click(getAllByText('Choice C')[0])
          expect(getByRole('combobox')).toHaveTextContent('Choice C')
          expect(wave.args[name]).toEqual('C')

          rerender(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice A')
          expect(wave.args[name]).toEqual('A')
        })
      })

      describe('Multi-valued', () => {
        it('Displays new value when "values" prop is updated', () => {
          const { getByRole, rerender } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice A')

          rerender(<XDropdown model={{ ...defaultProps, values: ['B'] }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice B')
        })

        it('Sets wave args when "values" prop is updated', () => {
          const { rerender } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)
          expect(wave.args[name]).toEqual(['A'])

          rerender(<XDropdown model={{ ...defaultProps, values: ['B'] }} />)
          expect(wave.args[name]).toEqual(['B'])
        })

        it('Displays new values when "values" prop is updated to array with 2 items', () => {
          const { getByRole, rerender } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice A')

          rerender(<XDropdown model={{ ...defaultProps, values: ['B', 'C'] }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice B, Choice C')
        })

        it('Displays new value when option is selected and "values" prop is updated', () => {
          const { getByRole, getByText, rerender } = render(<XDropdown model={defaultProps} />)

          fireEvent.click(getByRole('combobox'))
          fireEvent.click(getByText('Choice A'))
          expect(getByRole('combobox')).toHaveTextContent('Choice A')

          rerender(<XDropdown model={{ ...defaultProps, values: ['B', 'C'] }} />)
          expect(getByRole('combobox')).toHaveTextContent('Choice B, Choice C')
        })

        it('Sets wave args when option is selected and "values" prop is updated', () => {
          const { getByRole, getByText, rerender } = render(<XDropdown model={{ ...defaultProps, values: [] }} />)
          fireEvent.click(getByRole('combobox'))
          fireEvent.click(getByText('Choice A'))
          expect(getByRole('combobox')).toHaveTextContent('Choice A')
          expect(wave.args[name]).toEqual(['A'])

          rerender(<XDropdown model={{ ...defaultProps, values: ['B'] }} />)
          expect(wave.args[name]).toEqual(['B'])
        })

      })
    })
  })

  describe('Dialog dropdown', () => {
    let dialogProps: Dropdown

    const createChoices = (size: number) => Array.from(Array(size).keys()).map(key => ({ name: String(key), label: `Choice ${key}` }))
    const overOneHundredChoices = createChoices(101)
    const choices = createChoices(10)

    beforeEach(() => {
      dialogProps = {
        ...defaultProps,
        popup: 'always',
        choices
      }
    })

    it('Renders data-test attr', () => {
      const { queryByTestId } = render(<XDropdown model={dialogProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Calls sync on Deselect all - trigger enabled', async () => {
      const { getByText, getByTestId } = render(<XDropdown model={{ ...dialogProps, values: ['1'], trigger: true }} />)

      fireEvent.click(getByTestId(name))
      expect(wave.args[name]).toMatchObject(['1'])
      fireEvent.click(getByText('Deselect All'))
      fireEvent.click(getByText('Select'))
      expect(wave.args[name]).toMatchObject([])
      await waitFor(() => expect(pushMock).toHaveBeenCalledTimes(1))
    })

    it('Sets wave args to empty array when values is an empty array - init', () => {
      render(<XDropdown model={{ ...dialogProps, values: [] }} />)
      expect(wave.args[name]).toEqual([])
    })

    it('Returns multiple items on select', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getAllByRole('checkbox')[1])
      fireEvent.click(getAllByRole('checkbox')[2])
      fireEvent.click(getByText('Select'))

      expect(wave.args[name]).toMatchObject(['1', '2'])
    })

    it('Selects all options on Select all in a dialog dropdown - except disabled', () => {
      const { getByText, getByTestId } = render(<XDropdown model={{ ...dialogProps, choices: choicesDisabled, values: ['1'] }} />)

      expect(wave.args[name]).toMatchObject(['1'])
      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Select All'))
      fireEvent.click(getByText('Select'))

      expect(wave.args[name]).toMatchObject(['1', '3'])
    })

    it('Does not modify disabled choice on Select/Deselect all', () => {
      const { getByText, getByTestId } = render(<XDropdown model={{ ...dialogProps, choices: choicesDisabled, values: ['2', '3'] }} />)

      expect(wave.args[name]).toMatchObject(['2', '3'])

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Select All'))
      fireEvent.click(getByText('Select'))
      expect(wave.args[name]).toMatchObject(['1', '2', '3'])

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Deselect All'))
      fireEvent.click(getByText('Select'))
      expect(wave.args[name]).toMatchObject(['2'])
    })

    it('Sets correct args after filter', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '9' } })
      fireEvent.click(getAllByRole('checkbox')[0])
      fireEvent.click(getByText('Select'))

      expect(wave.args[name]).toMatchObject(['1', '9'])
    })

    it('Shows correct selection in the dropdown input - init single value', () => {
      const { getByDisplayValue } = render(<XDropdown model={{ ...dialogProps, value: '1' }} />)
      expect(getByDisplayValue('Choice 1')).toBeInTheDocument()
    })

    it('Shows correct selection in the dropdown dialog - init single value', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, value: '1' }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('checkbox')[1]).toBeChecked()
    })

    it('Shows correct selection in the dropdown input - init multi values', () => {
      const { getByDisplayValue } = render(<XDropdown model={{ ...dialogProps, values: ['1', '2'] }} />)
      expect(getByDisplayValue('Choice 1, Choice 2')).toBeInTheDocument()
    })

    it('Shows correct selection in the dropdown dialog - init multi values', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1', '2'] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('checkbox')[1]).toBeChecked()
      expect(getAllByRole('checkbox')[2]).toBeChecked()
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
      fireEvent.click(getAllByRole('checkbox')[3])
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
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)

      fireEvent.click(getByTestId(name))

      expect(getAllByRole('checkbox', { checked: true })).toHaveLength(1)
    })

    it('Has correct number of checked checkboxes - check and cancel', () => {
      const { getByText, getByTestId, queryAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(queryAllByRole('checkbox', { checked: true })).toHaveLength(0)

      fireEvent.click(getByText('Choice 3'))
      fireEvent.click(getByText('Choice 4'))
      fireEvent.click(getByText('Choice 5'))
      fireEvent.click(getByText('Cancel'))
      fireEvent.click(getByTestId(name))

      expect(queryAllByRole('checkbox', { checked: true })).toHaveLength(0)
    })

    it('Has correct number of checked checkboxes - check and submit', () => {
      const { getByText, getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      fireEvent.click(getByText('Choice 3'))
      fireEvent.click(getByText('Choice 4'))
      fireEvent.click(getByText('Choice 5'))
      fireEvent.click(getByText('Select'))
      fireEvent.click(getByTestId(name))

      expect(getAllByRole('checkbox', { checked: true })).toHaveLength(3)
    })

    it('Filters correctly', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '9' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
    })

    it('Virtualizes combobox when over 100 choices', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [], choices: overOneHundredChoices }} />)

      fireEvent.click(getByTestId(name))
      // Only displays 40 options
      expect(getAllByRole('listitem')).toHaveLength(40)
    })

    it('Shows correct number of selected items even during filtering', () => {
      const { getByTestId, getAllByRole, getByText } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getByText('Selected: 0')).toBeInTheDocument()
      fireEvent.click(getAllByRole('checkbox')[2])
      expect(getByText('Selected: 1')).toBeInTheDocument()
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '9' } })
      expect(getByText('Selected: 1')).toBeInTheDocument()
    })

    it('Filters correctly - reset filter', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '9' } })
      expect(getAllByRole('listitem')).toHaveLength(1)

      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '' } })
      expect(getAllByRole('listitem')).toHaveLength(10)
    })

    it('Resets filtered items on cancel', () => {
      const { getByTestId, getAllByRole, getByText } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '9' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
      fireEvent.click(getByText('Cancel'))
      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
    })

    it('Resets filtered items on submit', () => {
      const { getByTestId, getAllByRole, getByText } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '9' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
      fireEvent.click(getByText('Select'))
      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
    })

    it('Resets filtered items on single valued submit', () => {
      const { getByTestId, getAllByRole } = render(<XDropdown model={dialogProps} />)

      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
      fireEvent.change(getByTestId(`${name}-search`), { target: { value: '9' } })
      expect(getAllByRole('listitem')).toHaveLength(1)
      fireEvent.click(getAllByRole('checkbox')[0])
      fireEvent.click(getByTestId(name))
      expect(getAllByRole('listitem')).toHaveLength(10)
    })

    it(`Displays dialog when choices > 100 and 'popup' prop is not provided`, () => {
      const { getByTestId, queryByRole } = render(<XDropdown model={{ ...dialogProps, popup: undefined, choices: overOneHundredChoices }} />)

      expect(queryByRole('dialog')).not.toBeInTheDocument()
      fireEvent.click(getByTestId(name))
      expect(queryByRole('dialog')).toBeInTheDocument()
    })

    it(`Displays dialog when choices > 100 and 'popup' prop is set as 'auto'`, () => {
      const { getByTestId, queryByRole } = render(<XDropdown model={{ ...dialogProps, choices: overOneHundredChoices, popup: 'auto' }} />)

      expect(queryByRole('dialog')).not.toBeInTheDocument()
      fireEvent.click(getByTestId(name))
      expect(queryByRole('dialog')).toBeInTheDocument()
    })

    it(`Displays dialog when choices < 100 and 'popup' prop is set as 'always'`, () => {
      const { getByTestId, queryByRole } = render(<XDropdown model={dialogProps} />)

      expect(queryByRole('dialog')).not.toBeInTheDocument()
      fireEvent.click(getByTestId(name))
      expect(queryByRole('dialog')).toBeInTheDocument()
    })

    it(`Does not displays dialog when choices > 100 and 'popup' prop is set as 'never'`, () => {
      const { getByTestId, queryByRole } = render(<XDropdown model={{ ...dialogProps, choices: overOneHundredChoices, popup: 'never' }} />)

      fireEvent.click(getByTestId(name))

      expect(queryByRole('dialog')).not.toBeInTheDocument()
    })

    describe('Props changes', () => {
      describe('Single-valued', () => {
        it('Displays new value when "value" prop is updated', () => {
          const { getByTestId, rerender } = render(<XDropdown model={{ ...dialogProps, popup: 'always', value: '1' }} />)
          expect(getByTestId(name)).toHaveValue('Choice 1')

          rerender(<XDropdown model={{ ...dialogProps, value: '2' }} />)
          expect(getByTestId(name)).toHaveValue('Choice 2')
        })

        it('Selects option and updates "value"', () => {
          const { getByTestId, getByText, rerender } = render(<XDropdown model={dialogProps} />)

          fireEvent.click(getByTestId(name))
          fireEvent.click(getByText('Choice 1'))
          expect(getByTestId(name)).toHaveValue('Choice 1')

          rerender(<XDropdown model={{ ...dialogProps, value: '2' }} />)
          expect(getByTestId(name)).toHaveValue('Choice 2')
        })

        it('Sets wave args when "value" prop changes', () => {
          const { rerender } = render(<XDropdown model={{ ...dialogProps, value: 'A' }} />)
          expect(wave.args[name]).toBe('A')

          rerender(<XDropdown model={{ ...dialogProps, value: 'B' }} />)
          expect(wave.args[name]).toBe('B')
        })

        it('Sets wave args when selecting a value and "value" prop changes', () => {
          const { getByTestId, getByText, rerender } = render(<XDropdown model={{ ...dialogProps }} />)
          fireEvent.click(getByTestId(name))
          fireEvent.click(getByText('Choice 1'))
          expect(wave.args[name]).toBe('1')

          rerender(<XDropdown model={{ ...dialogProps, value: '2' }} />)
          expect(wave.args[name]).toBe('2')
        })

        it('Allows setting the same value multiple times', async () => {
          const { getByText, getByTestId, rerender } = render(<XDropdown model={{ ...dialogProps, value: '1' }} />)
          expect(wave.args[name]).toEqual('1')
          await waitFor(() => expect(getByTestId(name)).toHaveValue('Choice 1'))

          fireEvent.click(getByTestId(name))
          fireEvent.click(getByText('Choice 2'))

          expect(wave.args[name]).toEqual('2')
          await waitFor(() => expect(getByTestId(name)).toHaveValue('Choice 2'))

          rerender(<XDropdown model={{ ...dialogProps, value: '1' }} />)
          expect(wave.args[name]).toEqual('1')
        })
      })

      describe('Multi-valued', () => {
        it('Displays new value when "values" prop is updated', () => {
          const { getByTestId, rerender } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)
          expect(getByTestId(name)).toHaveValue('Choice 1')

          rerender(<XDropdown model={{ ...dialogProps, values: ['2'] }} />)
          expect(getByTestId(name)).toHaveValue('Choice 2')
        })

        it('Displays new values when "values" prop is updated to array with 2 items', () => {
          const { getByTestId, rerender } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)
          expect(getByTestId(name)).toHaveValue('Choice 1')

          rerender(<XDropdown model={{ ...dialogProps, values: ['2', '3'] }} />)
          expect(getByTestId(name)).toHaveValue('Choice 2, Choice 3')
        })

        it('Displays new values when option is selected and "values" prop is updated', () => {
          const { getByTestId, getByText, rerender } = render(<XDropdown model={dialogProps} />)

          fireEvent.click(getByTestId(name))
          fireEvent.click(getByText('Choice 1'))
          expect(getByTestId(name)).toHaveValue('Choice 1')

          rerender(<XDropdown model={{ ...dialogProps, values: ['2', '3'] }} />)
          expect(getByTestId(name)).toHaveValue('Choice 2, Choice 3')
        })

        it('Sets wave args when "values" prop is updated', () => {
          const { rerender } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)
          expect(wave.args[name]).toEqual(['1'])

          rerender(<XDropdown model={{ ...dialogProps, values: ['2'] }} />)
          expect(wave.args[name]).toEqual(['2'])
        })

        it('Sets wave args when option is selected and "values" prop is updated', () => {
          const { getByTestId, getByText, rerender } = render(<XDropdown model={{ ...dialogProps, values: [] }} />)
          fireEvent.click(getByTestId(name))
          fireEvent.click(getByText('Choice 1'))
          fireEvent.click(getByText('Select'))
          expect(wave.args[name]).toEqual(['1'])

          rerender(<XDropdown model={{ ...dialogProps, values: ['2'] }} />)
          expect(wave.args[name]).toEqual(['2'])
        })

        it('Display all selected values in input when "value" prop is update and select all is clicked, select is clicked', () => {
          const { getByText, getByTestId, rerender } = render(<XDropdown model={{ ...dialogProps, values: ['1'] }} />)
          expect(wave.args[name]).toEqual(['1'])

          rerender(<XDropdown model={{ ...dialogProps, values: ['2'] }} />)
          expect(wave.args[name]).toEqual(['2'])

          fireEvent.click(getByTestId(name))
          fireEvent.click(getByText('Select All'))
          fireEvent.click(getByText('Select'))

          expect(getByTestId(name)).toHaveValue(choices.map(c => c.label).join(', '))
        })

        it('Display all selected values in input when "value" prop is updated, searchbox is used, and select all is clicked, select is clicked', () => {
          const choices = [{ name: 'aa', label: 'Choice aa' }, { name: 'ab', label: 'Choice ab' }, { name: 'c', label: 'Choice c' }]
          const { getByRole, getByText, getByTestId, rerender } = render(<XDropdown model={{ ...dialogProps, values: ['aa'], choices }} />)
          expect(getByTestId(name)).toHaveValue('Choice aa')

          rerender(<XDropdown model={{ ...dialogProps, values: ['ab'], choices }} />)
          expect(getByTestId(name)).toHaveValue('Choice ab')

          fireEvent.click(getByTestId(name))
          userEvent.type(getByRole('searchbox'), 'a')
          fireEvent.click(getByText('Select All'))
          fireEvent.click(getByText('Select'))

          expect(getByTestId(name)).toHaveValue('Choice aa, Choice ab')
        })

        it('Checks all filtered values when "value" prop is updated, searchbox is used, and select all is clicked', () => {
          const choices = [{ name: 'aa', label: 'Choice aa' }, { name: 'ab', label: 'Choice ab' }, { name: 'c', label: 'Choice c' }]
          const { getByRole, getByText, getByTestId, rerender, getAllByRole } = render(<XDropdown model={{ ...dialogProps, values: ['aa'], choices }} />)
          expect(getByTestId(name)).toHaveValue('Choice aa')

          rerender(<XDropdown model={{ ...dialogProps, values: ['ab'], choices }} />)
          expect(getByTestId(name)).toHaveValue('Choice ab')

          fireEvent.click(getByTestId(name))
          userEvent.type(getByRole('searchbox'), 'a')
          fireEvent.click(getByText('Select All'))

          const checkboxes = getAllByRole('checkbox')
          expect(checkboxes).toHaveLength(2)
          expect(checkboxes[0]).toBeChecked()
          expect(checkboxes[1]).toBeChecked()
        })
      })
    })
  })
})