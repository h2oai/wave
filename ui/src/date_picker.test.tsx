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
import { DatePicker, XDatePicker } from './date_picker'
import { wave } from './ui'

const name = 'datepicker'
const datepickerProps: DatePicker = { name }
describe('Datepicker.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XDatePicker model={datepickerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - value not specified', () => {
    render(<XDatePicker model={datepickerProps} />)
    expect(wave.args[name]).toBeFalsy()
  })

  it('Sets args - init - value specified', () => {
    render(<XDatePicker model={{ ...datepickerProps, value: 'Test' }} />)
    expect(wave.args[name]).toBe('Test')
  })

  it('Sets args - selection', () => {
    expect(wave.args[name]).toBeFalsy()
    const { getAllByRole, getAllByText } = render(<XDatePicker model={datepickerProps} />)
    fireEvent.click(getAllByRole('combobox')[0])
    fireEvent.click(getAllByText('1')[0])

    expect(wave.args[name]).toBeTruthy()
  })

  it('Calls sync when trigger specified', () => {
    const pushMock = jest.fn()
    const { getAllByRole, getAllByText } = render(<XDatePicker model={{ ...datepickerProps, trigger: true }} />)

    wave.push = pushMock
    fireEvent.click(getAllByRole('combobox')[0])
    fireEvent.click(getAllByText('1')[0])

    expect(pushMock).toHaveBeenCalled()
  })
})