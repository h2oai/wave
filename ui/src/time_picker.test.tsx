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
    timepickerProps: TimePicker = { name, label: 'Select time' }

// jest.mock('./theme') // TODO: mock createTheme()

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
        const { container, getByText, getByPlaceholderText } = render(<XTimePicker model={{ ...timepickerProps, value: '10:30' }} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            await waitFor(() => expect(getByText('10')).toBeInTheDocument()) // TODO: error getting selected value
            // await waitFor(() => expect(container.querySelector(`[aria-selected="true"]`)).toBeTruthy())

        })
    })

    /*
 
it('Sets args - init - value specified in 24 hour format in 12 hour format time picker', async () => {
    // TODO:
    render(<XTimePicker model={{ ...timepickerProps, value: '10:30' }} />)
    await act(async () => {
        expect(wave.args[name]).toBe('10:30')
    })
})
 
it('Sets args - init - shows midnight correctly in 12 hour time format', async () => {
    // TODO:
    render(<XTimePicker model={{ ...timepickerProps, value: '00:00' }} />)
    await act(async () => {
        expect(wave.args[name]).toBe('12:00am')
    })
})
 
it('Sets args - init - shows noon correctly in 12 hour time format', async () => {
    // TODO:
    render(<XTimePicker model={{ ...timepickerProps, value: '12:00' }} />)
    await act(async () => {
        expect(wave.args[name]).toBe('12:00pm')
    })
})

*/


    it('Time picker dialog visible after input click', async () => {
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            await waitFor(() => expect(getByText('12')).toBeVisible())
        })
    })

    /*
 
    it('Shows custom label', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    it('Shows custom placeholder', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    it('Disabled time picker', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    it('Calls sync when trigger specified', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    it('Displays 12 hour time format', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    it('Limits available minutes to select from when minutes step is set', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    it('Disable hours out of boundaries in 24 hour format', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
 
    it('Disable hours out of boundaries in 12 hour format', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    it('Show error if input out of the boundaries', async () => {
        // TODO:
        const { getByText, getByPlaceholderText } = render(<XTimePicker model={timepickerProps} />)
        await act(async () => {
            const element = await waitFor(() => getByPlaceholderText('Select a time'))
            fireEvent.click(element)
            const element2 = await waitFor(() => getByText('12'))
            expect(element2).toBeVisible() // TODO: not working
            await waitFor(() => expect(wave.args[name]).toBe('12:00'))
        })
    })
 
    */

})










//===============================


            // const element = container.querySelector(`[data-test="${'lazyload'}"]`)
            // const element = await waitFor(() => findByTestId('lazyload'))
            // console.log(prettyDOM(container))


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

    // it('Set args - selection', async () => {
    //     const { container, getByTestId, getByText, getByPlaceholderText, getAllByRole } = render(<XTimePicker model={timepickerProps} />)
    //     await act(async () => {
    //         // const element = await waitFor(() => getByTestId(name))
    //         const element = await waitFor(() => getByPlaceholderText('Select a time'))
    //         fireEvent.click(element)
    //         const element2 = await waitFor(() => getByText('12'))
    //         fireEvent.click(element2) // document.querySelector('[aria-label="4 hours"]').click() - not working
    //         // await new Promise((res) => setTimeout(() => res('resolved'), 1000))
    //         const element3 = await waitFor(() => getByText('30'))
    //         fireEvent.click(element3)
    //         expect(element2).not.toBeVisible() // TODO: not working
    //         await waitFor(() => expect(wave.args[name]).toBe('12:00'))
    //     })
    // })

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