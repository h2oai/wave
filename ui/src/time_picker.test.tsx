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

import { fireEvent, render, waitFor, act } from '@testing-library/react'
import React from 'react'
import { TimePicker, XTimePicker } from './time_picker'
import { wave } from './ui'

const
    name = 'timepicker',
    timepickerProps: TimePicker = { name, label: 'Select time' }

describe('time_picker.tsx', () => {

    beforeEach(() => {
        wave.args[name] = null
    })

    it('Renders data-test attr - lazy load placeholder', async () => {
        const { getByTestId } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = getByTestId('lazyload')
            expect(element).toBeInTheDocument()
        })
    })

    it('Renders data-test attr - time picker component', async () => {
        const { getByTestId } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByTestId(name))
            expect(element).toBeInTheDocument()
        })
    })

    it('Sets args - init - value not specified', async () => {
        render(<XTimePicker model={timepickerProps} />)
        await waitFor(() => expect(wave.args[name]).toBeFalsy())
    })

    it('Sets args - init - value specified', async () => {
        render(<XTimePicker model={{ ...timepickerProps, value: '10:30' }} />)
        await act(async () => {
            expect(wave.args[name]).toBe('10:30')
        })
    })

    it('Sets args - init - value pre-selected in popover', async () => {
        const { queryAllByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '10:30' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            await waitFor(() => expect(queryAllByText('10')[1]).toHaveClass('Mui-selected'))
        })
    })

    it('Sets args - init - value specified in 24 hour format in 12 hour format time picker', async () => {
        render(<XTimePicker model={{ ...timepickerProps, value: '14:30', time_format: 'h12' }} />)
        await act(async () => {
            expect(wave.args[name]).toBe('02:30 pm')
        })
    })

    it('Sets args - init - shows midnight correctly in 12 hour time format', async () => {
        render(<XTimePicker model={{ ...timepickerProps, value: '00:00', time_format: 'h12' }} />)
        await act(async () => {
            expect(wave.args[name]).toBe('12:00 am')
        })
    })

    it('Sets args - init - shows noon correctly in 12 hour time format', async () => {
        render(<XTimePicker model={{ ...timepickerProps, value: '12:00', time_format: 'h12' }} />)
        await act(async () => {
            expect(wave.args[name]).toBe('12:00 pm')
        })
    })

    it('Time picker dialog visible after input click', async () => {
        const { queryByRole, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            // await waitFor(() => expect(getByText('12')).toBeVisible())
            await waitFor(() => expect(queryByRole('dialog')).toBeInTheDocument())
        })
    })

    it('Shows custom label', async () => {
        const { getByText } = render(<XTimePicker model={{ ...timepickerProps, label: 'Custom label' }} />)
        await act(async () => {
            const element = await waitFor(() => getByText('Custom label'))
            await waitFor(() => expect(element).toBeInTheDocument())
        })
    })

    it('Shows custom placeholder', async () => {
        const { getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, placeholder: 'Custom placeholder' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Custom placeholder'))
            await waitFor(() => expect(element).toBeInTheDocument())
        })
    })

    it('Disabled time picker', async () => {
        const { queryByRole, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, disabled: true }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
        })
    })

    it('Calls sync when trigger specified', async () => {
        const pushMock = jest.fn()
        const { getByPlaceholderText, getByText, queryByRole } = render(<XTimePicker model={{ ...timepickerProps, time_format: 'h12', value: '10:40am', trigger: true }} />)
        wave.push = pushMock
        await act(async () => {
            await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('AM')) // switches to PM
            fireEvent.click(element2)
            fireEvent.click(element) // TODO: closing the dialog not working
            expect(pushMock).toHaveBeenCalled()
        })
    })

    it('Displays 12 hour time format', async () => {
        const { queryByText, getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '03:00pm', time_format: 'h12' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            await waitFor(() => expect(getByText('PM')).toBeVisible())
            await waitFor(() => expect(queryByText('13')).not.toBeInTheDocument())
        })
    })

    it('Switch AM to PM in 12 hour time format', async () => {
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '03:00am', time_format: 'h12' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('AM'))
            await waitFor(() => expect(element2).toBeVisible())
            fireEvent.click(element2)
            await waitFor(() => expect(getByText('PM')).toBeVisible())
        })
    })

    it('Limits available minutes to select from when minutes step is set', async () => {
        const { getAllByText, getByPlaceholderText, queryAllByRole } = render(<XTimePicker model={{ ...timepickerProps, minutes_step: 10 }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getAllByText('--')[1]) // switches to dialog minutes view
            fireEvent.click(element2)
            await waitFor(() => expect(queryAllByRole('option')[0]).toHaveClass('Mui-disabled'))
            await waitFor(() => expect(queryAllByRole('option')[2]).toHaveClass('Mui-disabled'))
        })
    })

    it('Disable hours out of boundaries in 24 hour format', async () => {
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, min: '10:00', max: '18:00' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            await waitFor(() => expect(getByText('9')).toHaveClass('Mui-disabled'))
            await waitFor(() => expect(getByText('19')).toHaveClass('Mui-disabled'))
            await waitFor(() => expect(getByText('12')).not.toHaveClass('Mui-disabled'))
        })
    })

    it('Disable hours out of boundaries in 12 hour format', async () => {
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '02:00am', time_format: 'h12', min: '02:00am', max: '03:00pm' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            await waitFor(() => expect(getByText('1')).toHaveClass('Mui-disabled'))
            await waitFor(() => expect(getByText('4')).not.toHaveClass('Mui-disabled'))
            const element2 = await waitFor(() => getByText('AM')) // switches to PM
            fireEvent.click(element2)
            await waitFor(() => expect(getByText('4')).toHaveClass('Mui-disabled'))
        })
    })

    it('Show error if input out of the boundaries', async () => {
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '04:00am', time_format: 'h12', min: '02:00am', max: '03:00pm' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('AM')) // switches to PM
            fireEvent.click(element2)
            await waitFor(() => expect(getByText('Wrong input. Please enter the time in range from 02:00am to 03:00pm.')).toBeTruthy())
        })
    })
})