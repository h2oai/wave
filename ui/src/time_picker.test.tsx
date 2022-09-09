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

import { fireEvent, render, act } from '@testing-library/react'
import React from 'react'
import { TimePicker, XTimePicker } from './time_picker'
import { wave } from './ui'

const
  name = 'timepicker',
  timepickerProps: TimePicker = { name, label: 'Select time' }

const waitForIdleEventLoop = async () => act(() => new Promise(res => setTimeout(res)))

describe('time_picker.tsx', () => {

  beforeEach(() => {
    wave.args[name] = null
  })

  it('Renders data-test attr - lazy load placeholder', async () => {
    const { getByTestId } = render(<XTimePicker model={timepickerProps} />)
    expect(getByTestId('lazyload')).toBeInTheDocument()
  })

  // TODO:
  it('Renders data-test attr - lazy load placeholder not present after component is loaded', async () => {
    const { getByTestId } = render(<XTimePicker model={timepickerProps} />)
    await waitForIdleEventLoop()
    expect(getByTestId('lazyload')).not.toBeInTheDocument()
  })

  it('Renders data-test attr - time picker component', async () => {
    const { getByTestId } = render(<XTimePicker model={timepickerProps} />)
    await waitForIdleEventLoop()
    expect(getByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - value not specified', async () => {
    render(<XTimePicker model={timepickerProps} />)
    await waitForIdleEventLoop()
    expect(wave.args[name]).toBeNull()
  })

  it('Sets args - init - value specified', async () => {
    render(<XTimePicker model={{ ...timepickerProps, value: '10:30' }} />)
    await waitForIdleEventLoop()
    expect(wave.args[name]).toBe('10:30')
  })

  // TODO: check also value in UI

  it('Show correct value specified in 24 hour format in 12 hour format time picker', async () => {
    const { getByDisplayValue } = render(<XTimePicker model={{ ...timepickerProps, value: '14:30' }} />)
    await waitForIdleEventLoop()
    expect(getByDisplayValue('02:30 PM')).toBeInTheDocument()
  })

  it('Shows midnight correctly in 12 hour time format', async () => {
    const { getByDisplayValue } = render(<XTimePicker model={{ ...timepickerProps, value: '00:00' }} />)
    await waitForIdleEventLoop()
    expect(getByDisplayValue('12:00 AM')).toBeInTheDocument()
  })

  it('Shows noon correctly in 12 hour time format', async () => {
    const { getByDisplayValue } = render(<XTimePicker model={{ ...timepickerProps, value: '12:00' }} />)
    await waitForIdleEventLoop()
    expect(getByDisplayValue('12:00 PM')).toBeInTheDocument()
  })

  it('Custom popover toolbar - Switch AM to PM in 12 hour time format', async () => {
    const { getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '03:00' }} />)
    await waitForIdleEventLoop()
    fireEvent.click(getByPlaceholderText('Select a time'))
    const element = getByText('AM')
    expect(element).toBeVisible()
    fireEvent.click(element)
    expect(getByText('PM')).toBeVisible()
  })

  it('Show error if input out of the boundaries', async () => {
    const { getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '04:00', min: '02:00', max: '15:00' }} />)
    await waitForIdleEventLoop()
    fireEvent.click(getByPlaceholderText('Select a time'))
    fireEvent.click(getByText('AM')) // switches to PM
    await waitForIdleEventLoop()
    expect(getByText('Wrong input. Please enter the time in range from 02:00 AM to 03:00 PM.')).toBeTruthy()
  })
})