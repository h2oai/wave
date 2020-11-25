import { preload } from "./meta"
import * as N from './notification'
import * as T from './qd'

const
  name = 'meta',
  metaProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Meta.tsx', () => {
  beforeEach(() => jest.clearAllMocks())

  it('Sets title - init', () => {
    preload({ ...metaProps, state: { title: name } })
    expect(window.document.title).toBe(name)
  })

  it('Sets refreshRate - init', () => {
    const refresh = 1
    expect(T.qd.refreshRateB()).toBe(-1)
    preload({ ...metaProps, state: { refresh } })
    expect(T.qd.refreshRateB()).toBe(refresh)
  })

  it('Shows notification - init', () => {
    const showNotificationMock = jest.fn()
    // @ts-ignore
    N.showNotification = showNotificationMock

    preload({ ...metaProps, state: { notification: name } })
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
    preload({ ...metaProps, state: { dialog } })
    expect(T.qd.dialogB()).toMatchObject(dialog)
  })

})