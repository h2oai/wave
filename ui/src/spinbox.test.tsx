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

const name = 'spinbox'
const spinboxProps: Spinbox = { name }

const mouseEvent = { clientX: 0, clientY: 0 }
describe('Spinbox.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

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

  it('Sets args on input', () => {
    const { getByRole } = render(<XSpinbox model={spinboxProps} />)
    fireEvent.blur(getByRole('spinbutton'), { target: { value: 1 } })

    expect(wave.args[name]).toBe(1)
  })

  it('Sets args on increment', () => {
    const { container } = render(<XSpinbox model={spinboxProps} />)
    const incrementBtn = container.querySelector('.ms-UpButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(wave.args[name]).toBe(1)
  })

  it('Sets args on increment - not beyond max', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1, max: 1 }} />)
    const incrementBtn = container.querySelector('.ms-UpButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(wave.args[name]).toBe(1)
  })

  it('Sets args on decrement', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1 }} />)
    const incrementBtn = container.querySelector('.ms-DownButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(wave.args[name]).toBe(0)
  })

  it('Sets args on decrement - not beyond min', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1, min: 1 }} />)
    const incrementBtn = container.querySelector('.ms-DownButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(wave.args[name]).toBe(1)
  })

})