import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XColorPicker, ColorPicker } from './color_picker'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'colorPicker'
const colorPickerProps: ColorPicker = { name }
describe('ColorPicker.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

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
    expect(T.qd.args[name]).toBeFalsy()
  })

  it('Sets args - init', () => {
    render(<XColorPicker model={{ ...colorPickerProps, value: '#BBB' }} />)
    expect(T.qd.args[name]).toBe('#BBB')
  })

  it('Sets args', () => {
    const { container } = render(<XColorPicker model={colorPickerProps} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(T.qd.args[name]).toBeTruthy()
  })

  it('Sets args - choices specified', () => {
    const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] }} />)
    fireEvent.click(getAllByRole('gridcell')[3])

    expect(T.qd.args[name]).toBe('#DDD')
  })

  it('Calls sync when trigger is specified', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { container } = render(<XColorPicker model={{ ...colorPickerProps, trigger: true }} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(syncMock).toBeCalled()
  })

  it('Does not call sync - trigger not specified', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { container } = render(<XColorPicker model={colorPickerProps} />)
    // Changing alpha in order to trigger component's onChange.
    fireEvent.input(container.querySelectorAll('input')[3]!, { target: { value: 100 } })

    expect(syncMock).not.toBeCalled()
  })

  it('Calls sync when trigger is specified - Swatch picker', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, trigger: true, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] }} />)
    fireEvent.click(getAllByRole('gridcell')[3])

    expect(syncMock).toBeCalled()
  })

  it('Does not call sync - trigger not specified - Swatch picker', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getAllByRole } = render(<XColorPicker model={{ ...colorPickerProps, choices: ['#AAA', '#BBB', '#CCC', '#DDD'] }} />)
    fireEvent.click(getAllByRole('gridcell')[3])

    expect(syncMock).not.toBeCalled()
  })

})