import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { View } from './tab';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

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

})