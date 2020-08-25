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

})