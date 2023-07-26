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
import { ColorPicker, XColorPicker } from './color_picker'
import { wave } from './ui'

const name = 'colorPicker'
const pushMock = jest.fn()
let colorPickerProps: ColorPicker = { name }
describe('ColorPicker.tsx', () => {
  beforeAll(() => wave.push = pushMock)
  beforeEach(() => {
    wave.args[name] = null
    pushMock.mockReset()
    colorPickerProps = { name }
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XColorPicker model={colorPickerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - value not specified', () => {
    render(<XColorPicker model={colorPickerProps} />)
    expect(wave.args[name]).toBeFalsy()
  })

  it('Sets args - init', () => {
    render(<XColorPicker model={{ ...colorPickerProps, value: '#BBB' }} />)
    expect(wave.args[name]).toBe('#BBB')
  })

  it('Sets args', () => {
    const { container } = render(<XColorPicker model={colorPickerProps} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(wave.args[name]).toBeTruthy()
  })

  it('Sets args - Swatch picker', () => {
    const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] }} />)
    fireEvent.click(getAllByRole('radio')[3])

    expect(wave.args[name]).toBe('#DDD')
  })

  it('Set args when value is updated', () => {
    const { rerender } = render(<XColorPicker model={colorPickerProps} />)
    expect(wave.args[name]).toBeFalsy()
    rerender(<XColorPicker model={{ ...colorPickerProps, value: 'blue' }} />)

    expect(wave.args[name]).toBe('blue')
  })

  it('Set args when value is updated - Inline picker', () => {
    const { rerender } = render(<XColorPicker model={{ ...colorPickerProps, inline: true }} />)
    expect(wave.args[name]).toBeFalsy()
    rerender(<XColorPicker model={{ ...colorPickerProps, inline: true, value: '#DDD' }} />)

    expect(wave.args[name]).toBe('#DDD')
  })

  it('Set args when value is updated - Swatch picker', () => {
    const { rerender } = render(<XColorPicker model={{ ...colorPickerProps, value: 'yellow', choices: ['yellow', 'red', 'blue'] }} />)
    expect(wave.args[name]).toBe('yellow')
    rerender(<XColorPicker model={{ ...colorPickerProps, choices: ['yellow', 'red', 'blue'], value: 'red' }} />)

    expect(wave.args[name]).toBe('red')
  })

  it('Calls sync when trigger is specified', () => {
    const { container } = render(<XColorPicker model={{ ...colorPickerProps, trigger: true }} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(pushMock).toBeCalled()
  })

  it('Does not call sync - trigger not specified', () => {
    const { container } = render(<XColorPicker model={colorPickerProps} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(pushMock).not.toBeCalled()
  })

  describe('Swatch picker', () => {

    beforeEach(() => colorPickerProps = { ...colorPickerProps, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] })

    it('Calls sync when trigger is specified', () => {
      const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, trigger: true }} />)
      fireEvent.click(getAllByRole('radio')[3])

      expect(pushMock).toBeCalled()
    })

    it('Does not call sync - trigger not specified', () => {
      const { getAllByRole } = render(<XColorPicker model={colorPickerProps} />)
      fireEvent.click(getAllByRole('radio')[3])

      expect(pushMock).not.toBeCalled()
    })

    it('Update choices', () => {
      const { rerender, getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, choices: ['yellow', 'red', 'blue'] }} />)
      expect(getAllByRole('radio')[0]).toHaveProperty('title', 'yellow')
      expect(getAllByRole('radio')[1]).toHaveProperty('title', 'red')
      expect(getAllByRole('radio')[2]).toHaveProperty('title', 'blue')
      rerender(<XColorPicker model={{ ...colorPickerProps, choices: ['yellow', 'orange'] }} />)

      expect(getAllByRole('radio')[0]).toHaveProperty('title', 'yellow')
      expect(getAllByRole('radio')[1]).toHaveProperty('title', 'orange')
    })
  })
})