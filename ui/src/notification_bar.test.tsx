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
import { NotificationBar, notificationBarB } from './notification_bar'
import { wave } from './ui'

const
  name = "notificationbar",
  notificationbarProps: NotificationBar = { name, text: 'notification_bar' },
  emitMock = jest.fn()

describe('NotificationBar.tsx', () => {

  beforeAll(() => {
    jest.useFakeTimers()
    wave.emit = emitMock
  })
  beforeEach(() => {
    emitMock.mockReset()
    notificationBarB(notificationbarProps)
  })

  it('should open notification bar when global wave.notificationBarB is set', () => {
    const { queryByRole } = render(<NotificationBar />)
    expect(queryByRole('region')).toBeInTheDocument()
  })

  it('should close the notification bar after timeout', () => {
    render(<NotificationBar />)
    jest.runOnlyPendingTimers()
    expect(notificationBarB()).toBeNull()
  })

  it('should close the notification bar after timeout even if buttons are specified', () => {
    notificationBarB({ ...notificationbarProps, buttons: [{ button: { name: 'btn', label: 'click me' } }] })
    render(<NotificationBar />)
    jest.runOnlyPendingTimers()
    expect(notificationBarB()).toBeNull()
  })

  it('should not close the notification bar if timeout is -1', () => {
    notificationBarB({ ...notificationbarProps, timeout: -1 })
    render(<NotificationBar />)
    jest.runOnlyPendingTimers()
    expect(notificationBarB()).not.toBeNull()
  })

  it('should close the notification bar after clicking dismiss', () => {
    const { container } = render(<NotificationBar />)
    fireEvent.click(container.querySelector('.ms-MessageBar-dismissal') as HTMLButtonElement)
    expect(notificationBarB()).toBeNull()
  })

  it('should fire event if specified when clicking on X', () => {
    notificationBarB({ ...notificationbarProps, events: ['dismissed'] })
    const { container } = render(<NotificationBar />)
    fireEvent.click(container.parentElement!.querySelector('.ms-MessageBar-dismissal') as HTMLButtonElement)
    expect(emitMock).toHaveBeenCalled()
  })

  it('should fire event if specified after elapsed timeout', () => {
    notificationBarB({ ...notificationbarProps, events: ['dismissed'] })
    render(<NotificationBar />)
    jest.runOnlyPendingTimers()
    expect(emitMock).toHaveBeenCalled()
  })
})