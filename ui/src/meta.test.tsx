import React from 'react';
import { render } from '@testing-library/react';
import { View } from './meta';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';
import * as N from './notification'

const
  name = 'meta',
  metaProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Meta.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { jest.clearAllMocks() })

  it('Sets title - init', () => {
    render(<View {...{ ...metaProps, state: { title: name } }} />)
    expect(window.document.title).toBe(name)
  })

  it('Sets refreshRate - init', () => {
    expect(T.qd.refreshRateB()).toBe(-1)
    render(<View {...{ ...metaProps, state: { refresh: 1 } }} />)
    expect(T.qd.refreshRateB()).toBe(1)
  })

  it('Shows notification - init', () => {
    const showNotificationMock = jest.fn()
    // @ts-ignore
    N.showNotification = showNotificationMock

    render(<View {...{ ...metaProps, state: { notification: name } }} />)
    expect(showNotificationMock).toHaveBeenCalled()
    expect(showNotificationMock).toHaveBeenCalledWith(name)
  })

})