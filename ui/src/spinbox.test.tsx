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
import { Spinbox, XSpinbox } from './spinbox'
import { wave } from './ui'

const
  name = 'spinbox',
  spinboxProps: Spinbox = { name },
  pushMock = jest.fn(),
  mouseEvent = { clientX: 0, clientY: 0 },
  simulateClick = (el: Element) => {
    fireEvent.mouseDown(el, mouseEvent)
    fireEvent.mouseUp(el, mouseEvent)
  }
describe('Spinbox.tsx', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    wave.push = pushMock
    wave.debounce = jest.fn((_t, f) => (...args: any[]) => f(...args))
  })
  beforeEach(() => {
    wave.args[name] = null
    pushMock.mockReset()
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XSpinbox model={spinboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<XSpinbox model={spinboxProps} />)
    expect(wave.args[name]).toBe(0)
  })

  it('Sets args - init - min specified', () => {
    render(<XSpinbox model={{ ...spinboxProps, min: 1 }} />)
    expect(wave.args[name]).toBe(1)
  })

  it('Sets args - init - value specified', () => {
    render(<XSpinbox model={{ ...spinboxProps, value: 101, max: 100 }} />)
    expect(wave.args[name]).toBe(100)
  })

  it('Sets args on increment', () => {
    const { container } = render(<XSpinbox model={spinboxProps} />)
    simulateClick(container.querySelector('.ms-UpButton') as HTMLButtonElement)
    expect(wave.args[name]).toBe(1)
  })

  it('Sets args on increment - not beyond max', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1, max: 1 }} />)
    simulateClick(container.querySelector('.ms-UpButton') as HTMLButtonElement)
    expect(wave.args[name]).toBe(1)
  })

  it('Calls push on increment if trigger specified', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, trigger: true }} />)
    simulateClick(container.querySelector('.ms-UpButton') as HTMLButtonElement)
    expect(wave.args[name]).toBe(1)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Sets args on decrement', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1 }} />)
    simulateClick(container.querySelector('.ms-DownButton') as HTMLButtonElement),
      expect(wave.args[name]).toBe(0)
  })

  it('Sets args on decrement - not beyond min', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1, min: 1 }} />)
    simulateClick(container.querySelector('.ms-DownButton') as HTMLButtonElement),
      expect(wave.args[name]).toBe(1)
  })

  it('Calls push on decrement if trigger specified', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, trigger: true }} />)
    simulateClick(container.querySelector('.ms-DownButton') as HTMLButtonElement)
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('Sets args on input', () => {
    expect(wave.args[name]).toBeNull()
    const { getByTestId } = render(<XSpinbox model={spinboxProps} />)
    fireEvent.input(getByTestId(name), { target: { value: 50 } })
    expect(wave.args[name]).toBe(50)
  })

  it('Sets args on input - not beyond min', () => {
    expect(wave.args[name]).toBeNull()
    const { getByTestId } = render(<XSpinbox model={{ ...spinboxProps, min: 1 }} />)
    fireEvent.input(getByTestId(name), { target: { value: 0 } })
    expect(wave.args[name]).toBe(1)
  })

  it('Sets args on input - not beyond max', () => {
    expect(wave.args[name]).toBeNull()
    const { getByTestId } = render(<XSpinbox model={{ ...spinboxProps, max: 1 }} />)
    fireEvent.input(getByTestId(name), { target: { value: 2 } })
    expect(wave.args[name]).toBe(1)
  })

  it('Set args when value is updated', () => {
    const { rerender } = render(<XSpinbox model={spinboxProps} />)
    expect(wave.args[name]).toBe(0)
    rerender(<XSpinbox model={{ ...spinboxProps, value: 40 }} />)
    expect(wave.args[name]).toBe(40)
  })

  it('Calls push on input if trigger specified', () => {
    const
      { container, getByTestId } = render(<XSpinbox model={{ ...spinboxProps, trigger: true }} />),
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    fireEvent.input(getByTestId(name), { target: { value: 50 } })

    expect(spinboxInput.value).toBe('50') // Should be updated as user types - immediately.
    expect(jest.getTimerCount()).toBe(1) // Not called immediately, but after specified timeout.
    expect(pushMock).toHaveBeenCalled()
  })

  it('No floating point imprecision in increment', () => {
    const
      { container } = render(<XSpinbox model={{ ...spinboxProps, value: 0, step: 0.0001 }} />),
      incrementBtn = container.querySelector('.ms-UpButton') as HTMLButtonElement,
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    expect(spinboxInput.value).toBe('0')
    simulateClick(incrementBtn)
    expect(spinboxInput.value).toBe('0.0001')
    simulateClick(incrementBtn)
    expect(spinboxInput.value).toBe('0.0002')
    simulateClick(incrementBtn)
    expect(spinboxInput.value).toBe('0.0003')
    simulateClick(incrementBtn)
    expect(spinboxInput.value).toBe('0.0004')
    simulateClick(incrementBtn)
    expect(spinboxInput.value).toBe('0.0005')
    simulateClick(incrementBtn)
  })

  it('No floating point imprecision in decrement', () => {
    const
      { container } = render(<XSpinbox model={{ ...spinboxProps, value: 0.001, step: 0.0001 }} />),
      decrementBtn = container.querySelector('.ms-DownButton') as HTMLButtonElement,
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    expect(spinboxInput.value).toBe('0.001')
    simulateClick(decrementBtn)
    expect(spinboxInput.value).toBe('0.0009')
    simulateClick(decrementBtn)
    expect(spinboxInput.value).toBe('0.0008')
    simulateClick(decrementBtn)
    expect(spinboxInput.value).toBe('0.0007')
    simulateClick(decrementBtn)
    expect(spinboxInput.value).toBe('0.0006')
    simulateClick(decrementBtn)
    expect(spinboxInput.value).toBe('0.0005')
    simulateClick(decrementBtn)
  })

  it('Correct (parsed) value is sent to server', () => {
    const
      { container } = render(<XSpinbox model={{ ...spinboxProps, value: 0.001, step: 0.0001 }} />),
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    fireEvent.input(spinboxInput, { target: { value: '0.00020001' } })
    expect(wave.args[name]).toBe(0.0002)
    fireEvent.input(spinboxInput, { target: { value: '0.' } })
    expect(wave.args[name]).toBe(0)
    fireEvent.input(spinboxInput, { target: { value: '0.010000000' } })
    expect(wave.args[name]).toBe(0.01)
  })

  it('Should truncate value if it overflows the step precision', () => {
    const
      { container } = render(<XSpinbox model={{ ...spinboxProps, value: 0.001, step: 0.0001 }} />),
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    fireEvent.input(spinboxInput, { target: { value: '0.' } })
    expect(spinboxInput).toHaveValue('0.')
    fireEvent.input(spinboxInput, { target: { value: '0.10' } })
    expect(spinboxInput).toHaveValue('0.10')
    fireEvent.input(spinboxInput, { target: { value: '0.00011' } })
    expect(spinboxInput).toHaveValue('0.0001')
  })

  it('Should allow typing -', () => {
    const
      { container } = render(<XSpinbox model={{ ...spinboxProps, min: -10 }} />),
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    expect(spinboxInput).toHaveValue('0')
    expect(wave.args[name]).toBe(0)
    fireEvent.input(spinboxInput, { target: { value: '-' } })
    expect(spinboxInput).toHaveValue('-')
    expect(wave.args[name]).toBe(0)
    fireEvent.input(spinboxInput, { target: { value: '-5' } })
    expect(spinboxInput).toHaveValue('-5')
    expect(wave.args[name]).toBe(-5)
  })

  it('Should overwrite user input when beyond max', () => {
    const
      { container } = render(<XSpinbox model={{ ...spinboxProps, max: 10 }} />),
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    expect(spinboxInput).toHaveValue('0')
    expect(wave.args[name]).toBe(0)
    fireEvent.input(spinboxInput, { target: { value: '5' } })
    expect(spinboxInput).toHaveValue('5')
    expect(wave.args[name]).toBe(5)
    fireEvent.input(spinboxInput, { target: { value: '15' } })
    expect(spinboxInput).toHaveValue('10')
    expect(wave.args[name]).toBe(10)
  })

  it('Should overwrite user input when beyond min', () => {
    const
      { container } = render(<XSpinbox model={{ ...spinboxProps, min: 10, value: 15 }} />),
      spinboxInput = container.querySelector('.ms-spinButton-input') as HTMLInputElement

    expect(spinboxInput).toHaveValue('15')
    expect(wave.args[name]).toBe(15)
    fireEvent.input(spinboxInput, { target: { value: '11' } })
    expect(spinboxInput).toHaveValue('11')
    expect(wave.args[name]).toBe(11)
    fireEvent.input(spinboxInput, { target: { value: '5' } })
    expect(spinboxInput).toHaveValue('10')
    expect(wave.args[name]).toBe(10)
  })
})