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

import { initializeIcons } from '@fluentui/react'
import { fireEvent, render } from '@testing-library/react'
import * as T from 'h2o-wave'
import React from 'react'
import { ColorPicker, XColorPicker } from './color_picker'

const name = 'colorPicker'
const colorPickerProps: ColorPicker = { name }
describe('ColorPicker.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XColorPicker model={colorPickerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display color picker when visible is false', () => {
    const { queryByTestId } = render(<XColorPicker model={{ ...colorPickerProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Sets args - init - value not specified', () => {
    render(<XColorPicker model={colorPickerProps} />)
    expect(T.wave.args[name]).toBeFalsy()
  })

  it('Sets args - init', () => {
    render(<XColorPicker model={{ ...colorPickerProps, value: '#BBB' }} />)
    expect(T.wave.args[name]).toBe('#BBB')
  })

  it('Sets args', () => {
    const { container } = render(<XColorPicker model={colorPickerProps} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(T.wave.args[name]).toBeTruthy()
  })

  it('Sets args - choices specified', () => {
    const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] }} />)
    fireEvent.click(getAllByRole('gridcell')[3])

    expect(T.wave.args[name]).toBe('#DDD')
  })

  it('Calls sync when trigger is specified', () => {
    const syncMock = jest.fn()
    T.wave.sync = syncMock

    const { container } = render(<XColorPicker model={{ ...colorPickerProps, trigger: true }} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(syncMock).toBeCalled()
  })

  it('Does not call sync - trigger not specified', () => {
    const syncMock = jest.fn()
    T.wave.sync = syncMock

    const { container } = render(<XColorPicker model={colorPickerProps} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(syncMock).not.toBeCalled()
  })

  it('Calls sync when trigger is specified - Swatch picker', () => {
    const syncMock = jest.fn()
    T.wave.sync = syncMock

    const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, trigger: true, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] }} />)
    fireEvent.click(getAllByRole('gridcell')[3])

    expect(syncMock).toBeCalled()
  })

  it('Does not call sync - trigger not specified - Swatch picker', () => {
    const syncMock = jest.fn()
    T.wave.sync = syncMock

    const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] }} />)
    fireEvent.click(getAllByRole('gridcell')[3])

    expect(syncMock).not.toBeCalled()
  })

})