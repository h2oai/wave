import React from 'react'
import { render } from '@testing-library/react'
import { View } from './meta'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'
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
    const refresh = 1
    expect(T.qd.refreshRateB()).toBe(-1)
    render(<View {...{ ...metaProps, state: { refresh } }} />)
    expect(T.qd.refreshRateB()).toBe(refresh)
  })

  it('Shows notification - init', () => {
    const showNotificationMock = jest.fn()
    // @ts-ignore
    N.showNotification = showNotificationMock

    render(<View {...{ ...metaProps, state: { notification: name } }} />)
    expect(showNotificationMock).toHaveBeenCalled()
    expect(showNotificationMock).toHaveBeenCalledWith(name)
  })

  it('Sets dialog - init', () => {
    const dialog = {
      name: 'dialog',
      title: 'Dialog Title',
      items: [],
    }
    expect(T.qd.dialogB()).toBe(null)
    render(<View {...{ ...metaProps, state: { dialog } }} />)
    expect(T.qd.dialogB()).toMatchObject(dialog)
  })

})