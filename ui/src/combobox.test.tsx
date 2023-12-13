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
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Combobox, XCombobox } from './combobox'
import { wave } from './ui'

const
  name = 'combobox',
  comboboxProps: Combobox = { name, choices: ['A', 'B', 'C'] },
  pushMock = jest.fn()
wave.push = pushMock

describe('Combobox.tsx', () => {
  beforeEach(() => pushMock.mockReset())

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XCombobox model={comboboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  describe('Single Select', () => {
    it('Sets new option on hitting enter', () => {
      const { getByRole } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
      expect(wave.args[name]).toEqual('A')

      userEvent.type(getByRole('combobox'), '{backspace}D{enter}')
      expect(wave.args[name]).toEqual('D')
    })

    it('Displays new option when clicking away after typing', () => {
      const { getByRole } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
      const combobox = getByRole('combobox')

      userEvent.type(combobox, '{backspace}D')

      // Need to update JSDOM to 16.3+ to use fireEvent.blur().
      combobox.blur()
      fireEvent.focusOut(combobox)

      expect(combobox).toHaveValue('D')
      expect(wave.args[name]).toEqual('D')
    })

    it('Adds new typed option only once to options list', () => {
      const { getAllByRole, getByRole, queryAllByText } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
      fireEvent.click(getByRole('presentation', { hidden: true }))
      expect(getAllByRole('option')).toHaveLength(3)
      expect(queryAllByText('D')).toHaveLength(0)

      userEvent.type(getByRole('combobox'), '{backspace}D{enter}')
      fireEvent.click(getByRole('presentation', { hidden: true }))
      expect(getAllByRole('option')).toHaveLength(4)
      expect(queryAllByText('D')).toHaveLength(1)
    })

    describe('Wave args', () => {
      it('Sets args to null when initial value is not specified', () => {
        render(<XCombobox model={comboboxProps} />)
        expect(wave.args[name]).toBeNull()
      })
      it('Sets args to initial value', () => {
        render(<XCombobox model={{ ...comboboxProps, value: 'D' }} />)
        expect(wave.args[name]).toBe('D')
      })

      it('Sets args to manually selected option', () => {
        const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps }} />)
        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('A'))
        expect(wave.args[name]).toBe('A')

        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('B'))
        expect(wave.args[name]).toBe('B')
      })

      it('Calls sync when trigger is on', () => {
        const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps, trigger: true }} />)

        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('A'))

        expect(pushMock).toHaveBeenCalled()
      })

      it('Sets wave args as string when a new valued is typed and enter is pressed - after init', () => {
        const { getByRole } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
        expect(wave.args[name]).toBe('A')
        userEvent.type(getByRole('combobox'), '{backspace}D{enter}')
        expect(wave.args[name]).toBe('D')
      })

      it('Sets wave args as string when a new valued is typed and user clicks away - after init', () => {
        const { getByRole } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
        const combobox = getByRole('combobox')

        expect(wave.args[name]).toBe('A')

        userEvent.type(getByRole('combobox'), '{backspace}D')
        // Need to update JSDOM to 16.3+ to use fireEvent.blur().
        combobox.blur()
        fireEvent.focusOut(combobox)

        expect(getByRole('combobox')).not.toHaveFocus()
        expect(wave.args[name]).toBe('D')
      })

      it('Sets wave args as string when a new value is typed and tab is pressed - after init', () => {
        const { getByRole } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)

        expect(wave.args[name]).toBe('A')

        userEvent.type(getByRole('combobox'), '{backspace}D')
        userEvent.tab()

        expect(getByRole('combobox')).not.toHaveFocus()
        expect(wave.args[name]).toBe('D')
      })
    })

    describe('Prop changes - update values dynamically from Wave app', () => {
      it('Displays new options in options list when "choices" prop is updated', () => {
        const { getByRole, getAllByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(getAllByRole('option')).toHaveLength(3)

        rerender(<XCombobox model={{ ...comboboxProps, choices: ['A', 'B'] }} />)
        expect(getAllByRole('option')).toHaveLength(2)
      })

      it('Updates combobox value when "value" prop changes', () => {
        const { getByRole, getByText, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
        expect(getByRole('combobox')).toHaveValue('A')
        expect(wave.args[name]).toEqual('A')

        rerender(<XCombobox model={{ ...comboboxProps, value: 'B' }} />)
        expect(getByRole('combobox')).toHaveValue('B')
        expect(wave.args[name]).toEqual('B')

        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('C'))
        expect(getByRole('combobox')).toHaveValue('C')
        expect(wave.args[name]).toEqual('C')

        rerender(<XCombobox model={{ ...comboboxProps, value: 'B' }} />)
        expect(getByRole('combobox')).toHaveValue('B')
        expect(wave.args[name]).toEqual('B')
      })

      it('Updates "choices" prop and "value" prop to value different than the initial one', () => {
        const { getByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
        expect(wave.args[name]).toEqual('A')
        expect(getByRole('combobox')).toHaveValue('A')

        rerender(<XCombobox model={{ ...comboboxProps, choices: ['A', 'B'], value: 'B' }} />)
        expect(getByRole('combobox')).toHaveValue('B')
      })

      it('Clears all "choices"', () => {
        const { getByRole, queryByText, rerender } = render(<XCombobox model={comboboxProps} />)
        expect(getByRole('combobox')).not.toHaveValue()

        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(queryByText('A')).toBeInTheDocument()
        expect(queryByText('B')).toBeInTheDocument()
        expect(queryByText('C')).toBeInTheDocument()

        rerender(<XCombobox model={{ ...comboboxProps, choices: undefined }} />)
        expect(getByRole('combobox')).not.toHaveValue()

        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(queryByText('A')).not.toBeInTheDocument()
        expect(queryByText('B')).not.toBeInTheDocument()
        expect(queryByText('C')).not.toBeInTheDocument()
      })

      it('Types new option and then updates combobox value when "value" prop changes', () => {
        const { getByRole, getByText, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
        expect(getByRole('combobox')).toHaveValue('A')
        expect(wave.args[name]).toEqual('A')

        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('B'))
        fireEvent.blur(getByRole('presentation', { hidden: true }))
        userEvent.type(getByRole('combobox'), 'B{Enter}')
        expect(getByRole('combobox')).toHaveValue('BB')
        expect(wave.args[name]).toEqual('BB')

        rerender(<XCombobox model={{ ...comboboxProps, value: 'C' }} />)
        expect(getByRole('combobox')).toHaveValue('C')
        expect(wave.args[name]).toEqual('C')
      })

      it('Adds initial value to options if it\'s not included in "choices" prop', () => {
        const { getByText, getAllByRole, getByRole } = render(<XCombobox model={{ ...comboboxProps, value: 'Z' }} />)
        expect(wave.args[name]).toEqual('Z')
        expect(getByRole('combobox')).toHaveValue('Z')
        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(getAllByRole('option')).toHaveLength(4)
        expect(getByText('Z')).toBeDefined()
      })

      it('Adds value to choices when both are updated and value was included in previous choices but not in the new choices', () => {
        const { getByRole, getAllByRole, getByText, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
        expect(getByRole('combobox')).toHaveValue('A')

        rerender(<XCombobox model={{ ...comboboxProps, value: 'C', choices: ['A', 'B'] }} />)
        expect(getByRole('combobox')).toHaveValue('C')
        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(getAllByRole('option')).toHaveLength(3)
        expect(getByText('C')).toBeDefined()
      })

      it('Display same value if choices change and value is included in choices', () => {
        const { getByRole, rerender, } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />, {})
        expect(getByRole('combobox')).toHaveValue('A')
        rerender(<XCombobox model={{ ...comboboxProps, choices: ['A', 'B'], value: 'A' }} />)
        expect(getByRole('combobox')).toHaveValue('A')
      })
    })
  })

  describe('Multi Select', () => {
    it('Selects and unselects a user typed option', () => {
      const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps, values: [] }} />)
      userEvent.type(getByRole('combobox'), 'D{Enter}')
      expect(wave.args[name]).toEqual(['D'])
      fireEvent.click(getByRole('presentation', { hidden: true }))
      fireEvent.click(getByText('D'))
      expect(wave.args[name]).toEqual([])
    })

    it('Displays new typed option', () => {
      const { getByRole } = render(<XCombobox model={{ ...comboboxProps, values: ['A'] }} />)
      expect(wave.args[name]).toEqual(['A'])

      userEvent.type(getByRole('combobox'), 'D{enter}')
      expect(wave.args[name]).toEqual(['A', 'D'])
    })

    it('Unselects every option and types a new one', () => {
      const { getByText, getByRole } = render(<XCombobox model={{ ...comboboxProps, values: ['A', 'B'] }} />)
      expect(wave.args[name]).toEqual(['A', 'B'])

      fireEvent.click(getByRole('presentation', { hidden: true }))
      fireEvent.click(getByText('A'))
      fireEvent.click(getByText('B'))
      expect(wave.args[name]).toEqual([])

      userEvent.type(getByRole('combobox'), 'D{Enter}')
      expect(wave.args[name]).toEqual(['D'])
    })

    describe('Wave args', () => {
      it('Sets args to null when "values" is empty', () => {
        render(<XCombobox model={{ ...comboboxProps, values: [] }} />)
        expect(wave.args[name]).toBeNull()
      })

      it('Sets args to initial values', () => {
        render(<XCombobox model={{ ...comboboxProps, values: ['A', 'B'] }} />)
        expect(wave.args[name]).toEqual(['A', 'B'])
      })

      it('Sets args to manually selected options', () => {
        const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps, values: [] }} />)
        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('A'))
        fireEvent.click(getByText('B'))

        expect(wave.args[name]).toEqual(['A', 'B'])
      })

      it('Calls sync when trigger is on', () => {
        const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps, values: [], trigger: true }} />)

        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('A'))
        fireEvent.click(getByText('B'))

        expect(pushMock).toHaveBeenCalled()
      })
    })

    describe('Prop changes - update values dynamically from Wave app', () => {
      it('Types new option and then updates combobox value when "values" prop changes', () => {
        const { getByRole, getByText, rerender } = render(<XCombobox model={{ ...comboboxProps, values: ['A', 'B'] }} />)
        expect(getByRole('combobox')).toHaveValue('A, B')

        rerender(<XCombobox model={{ ...comboboxProps, values: ['C'] }} />)
        expect(getByRole('combobox')).toHaveValue('C')

        fireEvent.click(getByRole('presentation', { hidden: true }))
        fireEvent.click(getByText('B'))
        fireEvent.blur(getByRole('presentation', { hidden: true }))
        expect(getByRole('combobox')).toHaveValue('B, C')

        rerender(<XCombobox model={{ ...comboboxProps, values: ['A', 'B'] }} />)
        expect(getByRole('combobox')).toHaveValue('A, B')
      })

      it('Displays new options in options list when "choices" prop is updated', () => {
        const { getByRole, getAllByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, values: ['A'] }} />)
        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(getAllByRole('option')).toHaveLength(3)

        rerender(<XCombobox model={{ ...comboboxProps, choices: ['A', 'B'] }} />)
        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(getAllByRole('option')).toHaveLength(2)
      })

      it('Adds initial values to options if they are not already included in options ', () => {
        const { getByText, getAllByRole, getByRole } = render(<XCombobox model={{ ...comboboxProps, value: 'Z' }} />)
        expect(wave.args[name]).toEqual('Z')
        expect(getByRole('combobox')).toHaveValue('Z')
        fireEvent.click(getByRole('presentation', { hidden: true }))
        expect(getAllByRole('option')).toHaveLength(4)
        expect(getByText('Z')).toBeDefined()
      })
    })
  })
})