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

import { fireEvent, render, waitFor, act, prettyDOM } from '@testing-library/react'
import React from 'react'
// import { act } from 'react-dom/test-utils'
import { TimePicker, XTimePicker } from './time_picker'
import { wave } from './ui'

const
    name = 'timepicker',
    timepickerProps: TimePicker = { name }

// jest.mock('./theme') // TODO: mock createTheme()

describe('time_picker.tsx', () => {

    beforeEach(() => {
        wave.args[name] = null
    })

    it('Renders data-test attr - lazy load placeholder', async () => {
        const { getByTestId } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            // const element = container.querySelector(`[data-test="${'lazyload'}"]`)
            // const element = await waitFor(() => findByTestId('lazyload'))
            // console.log(prettyDOM(container))
            const element = getByTestId('lazyload')
            expect(element).toBeInTheDocument()
        })
    }
    )

    it('Renders data-test attr - time picker component', async () => {
        const { getByTestId } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByTestId(name))
            expect(element).toBeInTheDocument()
        })
    }
    )

    // it('Sets args - init - value not specified', async () => {
    //     render(<XTimePicker model={timepickerProps} />)
    //     await waitFor(() => {
    //         expect(wave.args[name]).toBeFalsy()
    //     })
    // })

    // it('Sets args - init - value specified', () => {
    //     render(<XTimePicker model={{ ...timepickerProps, value: 'Test' }} />)
    //     expect(wave.args[name]).toBe('Test')
    // })

    // it('Sets args - selection', () => {
    //     expect(wave.args[name]).toBeFalsy()
    //     const { getAllByRole, getAllByText } = render(<XTimePicker model={timepickerProps} />)
    //     fireEvent.click(getAllByRole('combobox')[0])
    //     fireEvent.click(getAllByText('1')[0])

    //     expect(wave.args[name]).toBeTruthy()
    // })

    // it('Calls sync when trigger specified', () => {
    //     const pushMock = jest.fn()
    //     const { getAllByRole, getAllByText } = render(<XTimePicker model={{ ...timepickerProps, trigger: true }} />)

    //     wave.push = pushMock
    //     fireEvent.click(getAllByRole('combobox')[0])
    //     fireEvent.click(getAllByText('1')[0])

    //     expect(pushMock).toHaveBeenCalled()
    // })
})



/** 
 *     it('Renders data-test attr - time picker component', async () => {
        // const container = document.createElement('div')
        const { container, findByTestId } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            // render(<XTimePicker model={timepickerProps} />)

            // render(<XTimePicker model={timepickerProps} />, container)
            // const {queryByTestId} = act( async () => render(<XTimePicker model={timepickerProps} />))
            // await waitFor(() => {
            //     expect(queryByTestId(name)).toBeInTheDocument()
            // })
            // const element = container.querySelector(`[data-testid="${name}"]`)

            // const element = findByTestId(name) // This is essentially waitFor & getByTestId
            // const element = await waitFor(() => findByTestId(name)) // This is essentially waitFor & getByTestId
            const element = await waitFor(() => findByTestId(name))
            // const element = await waitFor(() => container.querySelector(`[data-test="${name}"]`))
            // console.log(prettyDOM(container))

            // expect(element).toBeTruthy()
            expect(element).toBeInTheDocument()
        })
        // expect(element).toBeInTheDocument()

    }
    )
 */