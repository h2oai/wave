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

const notificationbarProps: NotificationBar = { text: 'notification_bar' }

describe('NotificationBar.tsx', () => {

  beforeAll(() => jest.useFakeTimers())
  beforeEach(() => notificationBarB(notificationbarProps))

  it('should open notification bar when global wave.notificationBarB is set', () => {
    const { queryByRole } = render(<NotificationBar />)
    expect(queryByRole('region')).toBeInTheDocument()
  })

  it('should not close the notifification bar after timeout if buttons specified', () => {
    notificationBarB({ ...notificationbarProps, buttons: [] })
    render(<NotificationBar />)
    jest.runOnlyPendingTimers()
    expect(notificationBarB()).not.toBeNull()
  })

  it('should close the notifification bar after timeout if no buttons specified', () => {
    render(<NotificationBar />)
    jest.runOnlyPendingTimers()
    expect(notificationBarB()).toBeNull()
  })

  it('should close the notifification bar after clicking dismiss', () => {
    const { container } = render(<NotificationBar />)
    fireEvent.click(container.querySelector('.ms-MessageBar-dismissal') as HTMLButtonElement)
    expect(notificationBarB()).toBeNull()
  })
})