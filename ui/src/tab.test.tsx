import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { View } from './tab'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const
  name = 'tab',
  hashName = `#${name}`,
  tabProps: T.Card<any> = {
    name,
    state: {
      items: [{ name }]
    },
    changed: T.box(false)
  }

describe('Meta.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    T.qd.args[name] = null
    jest.clearAllMocks()
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...tabProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByRole } = render(<View {...tabProps} />)
    fireEvent.click(getByRole('tab'))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not set args and calls sync on click - hash name', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByRole } = render(<View {...{ ...tabProps, state: { items: [{ name: hashName }] } }} />)
    fireEvent.click(getByRole('tab'))

    expect(T.qd.args[name]).toBeNull()
    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Sets url hash - hash name', () => {
    const { getByRole } = render(<View {...{ ...tabProps, state: { items: [{ name: hashName }] } }} />)
    fireEvent.click(getByRole('tab'))

    expect(window.location.hash).toBe(hashName)
  })

  it('Sets default tab', () => {
    const items = [{ name: 'tab1' }, { name: 'tab2' }]
    const { getAllByRole } = render(<View {...{ ...tabProps, state: { items, value: 'tab2' } }} />)

    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Sets correct tab according to hash', () => {
    window.location.hash = 'tab2'
    const items = [{ name: 'tab1' }, { name: '#tab2' }]
    const { getAllByRole } = render(<View {...{ ...tabProps, state: { items } }} />)

    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

  it('Sets correct tab according to hash change', () => {
    const items = [{ name: 'tab1' }, { name: '#tab2' }]
    const { getAllByRole } = render(<View {...{ ...tabProps, state: { items } }} />)

    window.location.hash = '#tab2'
    window.dispatchEvent(new HashChangeEvent("hashchange"))

    expect(getAllByRole('tab')[0]).not.toHaveClass('is-selected')
    expect(getAllByRole('tab')[1]).toHaveClass('is-selected')
  })

})