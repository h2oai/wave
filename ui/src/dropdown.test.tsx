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

const name = 'dropdown-test'
const defaultProps: Dropdown = {
  name,
  label: name,
  choices: [
    { name: 'A', label: 'Choice A' },
    { name: 'B', label: 'Choice B' },
    { name: 'C', label: 'Choice C' },
    { name: 'D', label: 'Choice D' },
  ]
}
describe('Dropdown.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XDropdown model={defaultProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Calls qd.sync() when trigger is on', () => {
    const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, trigger: true }} />)
    const pushMock = jest.fn()
    wave.push = pushMock

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A'))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not call qd.sync() when trigger is off', () => {
    const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)
    const pushMock = jest.fn()
    wave.push = pushMock

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A'))

    expect(pushMock).toHaveBeenCalledTimes(0)
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

  it('Returns the last item when selected more than once', () => {
    const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A'))
    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice B'))

    expect(wave.args[name]).toBe('B')
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
    const pushMock = jest.fn()
    wave.push = pushMock

    fireEvent.click(getByText('Select All'))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Deselects all options on Deselect all', () => {
    const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A', 'B', 'C', 'D'] }} />)

    fireEvent.click(getByText('Deselect All'))

    expect(wave.args[name]).toMatchObject([])
  })

  it('Calls sync on Deselect all - trigger enabled', () => {
    const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)
    const pushMock = jest.fn()
    wave.push = pushMock

    fireEvent.click(getByText('Deselect All'))

    expect(pushMock).toHaveBeenCalled()
  })
})