import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XDropdown, Dropdown } from './dropdown';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

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

  beforeAll(() => initializeIcons())

  it('Calls qd.sync() when trigger is on', () => {
    const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, trigger: true }} />)
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A'))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not call qd.sync() when trigger is off', () => {
    const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A'))

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Returns a single item when selected', () => {
    const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A'))

    expect(T.qd.args[name]).toBe('A')
  })

  it('Returns a single item on init', () => {
    render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
    expect(T.qd.args[name]).toBe('A')
  })

  it('Returns the last item when selected more than once', () => {
    const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A'))
    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice B'))

    expect(T.qd.args[name]).toBe('B')
  })

  it('Returns multiple items on init', () => {
    render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)
    expect(T.qd.args[name]).toMatchObject(['A', 'B'])
  })

  it('Returns null when value not specified - init', () => {
    render(<XDropdown model={defaultProps} />)
    expect(T.qd.args[name]).toBeNull()
  })

  it('Returns multiple items on select', () => {
    const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, values: [] }} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A').parentElement!)
    fireEvent.click(getByText('Choice B').parentElement!)

    expect(T.qd.args[name]).toMatchObject(['A', 'B'])
  })

  it('Returns empty array on deselect', () => {
    const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)

    fireEvent.click(getByTestId(name))
    fireEvent.click(getByText('Choice A').parentElement!)
    fireEvent.click(getByText('Choice B').parentElement!)

    expect(T.qd.args[name]).toMatchObject([])
  })

  it('Selects all options on Select all', () => {
    const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'] }} />)

    fireEvent.click(getByText('Select All'))

    expect(T.qd.args[name]).toMatchObject(['A', 'B', 'C', 'D'])
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

    expect(T.qd.args[name]).toMatchObject(['A', 'B', 'D'])
  })

  it('Calls sync on Select all - trigger enabled', () => {
    const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.click(getByText('Select All'))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Deselects all options on Deselect all', () => {
    const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A', 'B', 'C', 'D'] }} />)

    fireEvent.click(getByText('Deselect All'))

    expect(T.qd.args[name]).toMatchObject([])
  })

  it('Calls sync on Deselect all - trigger enabled', () => {
    const { getByText } = render(<XDropdown model={{ ...defaultProps, values: ['A'], trigger: true }} />)
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.click(getByText('Deselect All'))

    expect(syncMock).toHaveBeenCalled()
  })
})