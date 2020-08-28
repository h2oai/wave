import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XSpinbox, Spinbox } from './spinbox';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'spinbox';
const spinboxProps: Spinbox = { name }

const mouseEvent = { clientX: 0, clientY: 0 }
describe('Spinbox.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XSpinbox model={spinboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<XSpinbox model={spinboxProps} />)
    expect(T.qd.args[name]).toBe(0)
  })

  it('Sets args - init - min specified', () => {
    render(<XSpinbox model={{ ...spinboxProps, min: 1 }} />)
    expect(T.qd.args[name]).toBe(1)
  })

  it('Sets args - init - value specified', () => {
    render(<XSpinbox model={{ ...spinboxProps, value: 101, max: 100 }} />)
    expect(T.qd.args[name]).toBe(100)
  })

  it('Sets args on input', () => {
    const { getByRole } = render(<XSpinbox model={spinboxProps} />)
    fireEvent.blur(getByRole('spinbutton'), { target: { value: 1 } })

    expect(T.qd.args[name]).toBe(1)
  })

  it('Sets args on increment', () => {
    const { container } = render(<XSpinbox model={spinboxProps} />)
    const incrementBtn = container.querySelector('.ms-UpButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(T.qd.args[name]).toBe(1)
  })

  it('Sets args on increment - not beyond max', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1, max: 1 }} />)
    const incrementBtn = container.querySelector('.ms-UpButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(T.qd.args[name]).toBe(1)
  })

  it('Sets args on decrement', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1 }} />)
    const incrementBtn = container.querySelector('.ms-DownButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(T.qd.args[name]).toBe(0)
  })

  it('Sets args on decrement - not beyond min', () => {
    const { container } = render(<XSpinbox model={{ ...spinboxProps, value: 1, min: 1 }} />)
    const incrementBtn = container.querySelector('.ms-DownButton')!

    fireEvent.mouseDown(incrementBtn, mouseEvent)
    fireEvent.mouseUp(incrementBtn, mouseEvent)

    expect(T.qd.args[name]).toBe(1)
  })

})