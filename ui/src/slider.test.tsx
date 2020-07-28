import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XSlider, Slider } from './slider';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'slider';
const sliderProps: Slider = { name }
const defaultRect = { left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 } as DOMRect
const mouseEvent = { clientX: 50, clientY: 0 }

describe('Slider.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Sets args - init', () => {
    render(<XSlider model={sliderProps} />)
    expect(T.qd.args[name]).toBe(0)
  })

  it('Sets args - init - min specified', () => {
    render(<XSlider model={{ ...sliderProps, min: 1 }} />)
    expect(T.qd.args[name]).toBe(1)
  })

  it('Sets args - init - value specified', () => {
    render(<XSlider model={{ ...sliderProps, value: 101, max: 100 }} />)
    expect(T.qd.args[name]).toBe(100)
  })

  it('Sets args on slide', () => {
    const { container } = render(<XSlider model={sliderProps} />)
    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect
    fireEvent.mouseDown(container.querySelector('.ms-Slider-slideBox')!, mouseEvent)

    expect(T.qd.args[name]).toBe(50)
  })
  it('Calls sync on slide', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { container } = render(<XSlider model={{ ...sliderProps, trigger: true }} />)
    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect

    const slidebox = container.querySelector('.ms-Slider-slideBox')!
    fireEvent.mouseDown(slidebox, mouseEvent)
    fireEvent.mouseUp(slidebox, mouseEvent)

    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not call sync on slide - trigger not specified', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    const { getByRole } = render(<XSlider model={sliderProps} />)
    fireEvent.mouseDown(getByRole('slider'), { clientX: 1, clientY: 1 })

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

})