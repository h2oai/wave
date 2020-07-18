import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XDropdown, Dropdown } from './dropdown';
import * as T from './telesync';
import { initializeIcons } from '@fluentui/react';

const defaultProps: Dropdown = {
  name: 'dropdown-test',
  label: 'dropdown-test',
  choices: [
    { name: 'A', label: 'Choice A' },
    { name: 'B', label: 'Choice B' },
    { name: 'C', label: 'Choice C' },
    { name: 'D', label: 'Choice D' },
  ]
}
describe('Dropdown.tsx', () => {

  beforeAll(() => initializeIcons())

  it('Calls telesync.sync() when trigger is on', () => {
    const
      syncMock = jest.fn(),
      { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, trigger: true }} />)

    fireEvent.click(getByTestId('dropdown-test'))
    T.telesync.sync = syncMock
    fireEvent.click(getByText('Choice A'))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not call telesync.sync() when trigger is off', () => {
    const
      syncMock = jest.fn(),
      { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

    fireEvent.click(getByTestId('dropdown-test'))
    T.telesync.sync = syncMock
    fireEvent.click(getByText('Choice A'))

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Returns a single item when selected', () => {
    const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

    fireEvent.click(getByTestId('dropdown-test'))
    fireEvent.click(getByText('Choice A'))

    expect(T.telesync.args['dropdown-test']).toBe('A')
  })

  it('Returns a single item on init', () => {
    render(<XDropdown model={{ ...defaultProps, value: 'A' }} />)
    expect(T.telesync.args['dropdown-test']).toBe('A')
  })

  it('Returns the last item when selected more than once', () => {
    const { getByTestId, getByText } = render(<XDropdown model={defaultProps} />)

    fireEvent.click(getByTestId('dropdown-test'))
    fireEvent.click(getByText('Choice A'))
    fireEvent.click(getByTestId('dropdown-test'))
    fireEvent.click(getByText('Choice B'))

    expect(T.telesync.args['dropdown-test']).toBe('B')
  })

  it('Returns multiple items on init', () => {
    render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)
    expect(T.telesync.args['dropdown-test']).toMatchObject(['A', 'B'])
  })

  it('Returns multiple items on select', () => {
    const { getByTestId, getByText } = render(<XDropdown model={{ ...defaultProps, values: [] }} />)

    fireEvent.click(getByTestId('dropdown-test'))
    fireEvent.click(getByText('Choice A').parentElement!)
    fireEvent.click(getByText('Choice B').parentElement!)

    expect(T.telesync.args['dropdown-test']).toMatchObject(['A', 'B'])
  })

  it('Returns empty array on deselect', () => {
    const { getByTestId, getByText, getAllByText } = render(<XDropdown model={{ ...defaultProps, values: ['A', 'B'] }} />)

    fireEvent.click(getByTestId('dropdown-test'))
    fireEvent.click(getByText('Choice A').parentElement!)
    fireEvent.click(getAllByText('Choice B')[1].parentElement!)

    expect(T.telesync.args['dropdown-test']).toMatchObject([])
  })
})