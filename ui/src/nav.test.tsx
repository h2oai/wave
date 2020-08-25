import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { View } from './nav'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const
  name = 'nav',
  hashName = `#${name}`,
  navProps: T.Card<any> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name, label: 'label1' }] }
      ]
    },
    changed: T.box(false)
  },
  navPropsHash: T.Card<any> = {
    name,
    state: {
      items: [
        { label: 'group1', items: [{ name: hashName, label: 'label1' }] }
      ]
    },
    changed: T.box(false)
  }
describe('Nav.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...navProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<View {...navProps} />)
    expect(T.qd.args[name]).toBeNull()
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByTitle } = render(<View {...navProps} />)
    fireEvent.click(getByTitle('label1'))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click when name starts with hash', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle('label1'))

    expect(T.qd.args[name]).toBeNull()
    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Does set window window location hash when name starts with hash', () => {
    const { getByTitle } = render(<View {...navPropsHash} />)
    fireEvent.click(getByTitle('label1'))

    expect(window.location.hash).toBe(hashName)
  })

})