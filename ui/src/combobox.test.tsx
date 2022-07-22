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

const name = 'combobox'
const comboboxProps: Combobox = { name, choices: ['A', 'B', 'C'] }
describe('Combobox.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XCombobox model={comboboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - value not specified', () => {
    render(<XCombobox model={comboboxProps} />)
    expect(wave.args[name]).toBeNull()
  })
  it('Sets args - init - value specified', () => {
    render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
    expect(wave.args[name]).toBe('A')
  })

  it('Sets args - selection', () => {
    const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps }} />)
    fireEvent.click(getByRole('presentation', { hidden: true }))
    fireEvent.click(getByText('A'))

    expect(wave.args[name]).toBe('A')
  })

  it('Sets args - multiple selection', () => {
    const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps, values: [] }} />)
    fireEvent.click(getByRole('presentation', { hidden: true }))
    fireEvent.click(getByText('A'))
    fireEvent.click(getByText('B'))

    expect(wave.args[name]).toEqual(['A', 'B'])
  })

  it('Types new option', () => {
    const { getByRole } = render(<XCombobox model={{ ...comboboxProps, values: ['A'] }} />)
    expect(wave.args[name]).toEqual(['A'])
    
    userEvent.type(getByRole('combobox'), 'D{Enter}')
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

  it('Calls sync when trigger is on', () => {
    const pushMock = jest.fn()
    wave.push = pushMock
    const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps, trigger: true }} />)

    fireEvent.click(getByRole('presentation', { hidden: true }))
    fireEvent.click(getByText('A'))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Selects and unselects a user typed option', () => {
    const { getByRole, getByText } = render(<XCombobox model={{ ...comboboxProps, values: [] }} />)
    userEvent.type(getByRole('combobox'), 'D{Enter}')
    expect(wave.args[name]).toEqual(['D'])
    fireEvent.click(getByRole('presentation', { hidden: true }))
    fireEvent.click(getByText('D'))
    expect(wave.args[name]).toEqual([])
  })

  describe('Prop changes - update values dynamically from Wave app', () => {
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

    it('Types new option and then updates combobox value when "values" prop changes - multi select', () => {
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

    it('Updates "choices" single select', () => {
      const { getByRole, getAllByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
      fireEvent.click(getByRole('presentation', { hidden: true }))
      expect(getAllByRole('option')).toHaveLength(3)

      rerender(<XCombobox model={{ ...comboboxProps, choices: ['A', 'B'] }} />)
      expect(getAllByRole('option')).toHaveLength(2)
    })

    it('Updates "choices" prop - multi select', () => {
      const { getByRole, getAllByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, values: ['A'] }} />)
      fireEvent.click(getByRole('presentation', { hidden: true }))
      expect(getAllByRole('option')).toHaveLength(3)

      rerender(<XCombobox model={{ ...comboboxProps, choices: ['A', 'B'] }} />)
      fireEvent.click(getByRole('presentation', { hidden: true }))
      expect(getAllByRole('option')).toHaveLength(2)
    })

    it('Updates "choices" prop and "value" prop to value different than the initial one', () => {
      const { getByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
      expect(wave.args[name]).toEqual('A')
      expect(getByRole('combobox')).toHaveValue('A')

      rerender(<XCombobox model={{ ...comboboxProps, choices: ['A', 'B'], value: 'B' }} />)
      expect(getByRole('combobox')).toHaveValue('B')
    })

    it('Clears combobox if "value" is not included in choices', () => {
      const { getByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, value: 'A' }} />)
      expect(wave.args[name]).toEqual('A')
      expect(getByRole('combobox')).toHaveValue('A')

      rerender(<XCombobox model={{ ...comboboxProps, value: 'D' }} />)
      expect(getByRole('combobox')).toHaveValue('')
      expect(wave.args[name]).toBeNull()
    })

    it('Clears combobox if none of the value in "values" are included in "choices"', () => {
      const { getByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, values: ['A'] }} />)
      expect(wave.args[name]).toEqual(['A'])
      expect(getByRole('combobox')).toHaveValue('A')
      expect(wave.args[name]).toEqual(['A'])

      rerender(<XCombobox model={{ ...comboboxProps, values: ['D'] }} />)
      expect(getByRole('combobox')).toHaveValue('')
      expect(wave.args[name]).toEqual([])
    })

    it('Selects only "values" present in "choices" - intersection of "values" and "choices"', () => {
      const { getByRole, rerender } = render(<XCombobox model={{ ...comboboxProps, values: ['A', 'B'] }} />)
      expect(wave.args[name]).toEqual(['A', 'B'])
      expect(getByRole('combobox')).toHaveValue('A, B')

      rerender(<XCombobox model={{ ...comboboxProps, values: ['B', 'D'] }} />)
      expect(getByRole('combobox')).toHaveValue('B')
      expect(wave.args[name]).toEqual(['B'])
    })
  })
})