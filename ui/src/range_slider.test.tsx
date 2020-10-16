import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XRangeSlider, RangeSlider } from './range_slider'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'rangeSlider'
const rangeSliderProps: RangeSlider = { name, min: 0, max: 100 }
const defaultRect = { left: 0, top: 0, right: 0, bottom: 0, width: 100, height: 40 } as DOMRect
const mouseEvent = { clientX: 50, clientY: 0 }

describe('rangeSlider.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XRangeSlider model={rangeSliderProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display range slider when visible is false', () => {
    const { queryByTestId } = render(<XRangeSlider model={{ ...rangeSliderProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Sets args - init', () => {
    render(<XRangeSlider model={rangeSliderProps} />)
    expect(T.qd.args[name]).toMatchObject([0, 100])
  })

  it('Sets args - init - min max specified', () => {
    render(<XRangeSlider model={{ ...rangeSliderProps, min_value: 1, max_value: 2 }} />)
    expect(T.qd.args[name]).toMatchObject([1, 2])
  })

  it('Sets args - init - max_val > max', () => {
    render(<XRangeSlider model={{ ...rangeSliderProps, max: 100, max_value: 101 }} />)
    expect(T.qd.args[name]).toMatchObject([0, 100])
  })

  it('Sets args - init - min_val < min', () => {
    render(<XRangeSlider model={{ ...rangeSliderProps, min: 1, min_value: 0 }} />)
    expect(T.qd.args[name]).toMatchObject([1, 100])
  })

  it('Sets args on slide', () => {
    const { container, getAllByRole } = render(<XRangeSlider model={rangeSliderProps} />)
    expect(T.qd.args[name]).toMatchObject([0, 100])

    container.querySelector('.input-range__track')!.getBoundingClientRect = () => defaultRect
    fireEvent.mouseDown(getAllByRole('slider')[1]!, mouseEvent)

    expect(T.qd.args[name]).toMatchObject([0, 50])
  })

  it('Calls sync on slide', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { container, getAllByRole } = render(<XRangeSlider model={{ ...rangeSliderProps, trigger: true }} />)
    container.querySelector('.input-range__track')!.getBoundingClientRect = () => defaultRect

    const slidebox = getAllByRole('slider')[0]!
    fireEvent.mouseDown(slidebox, mouseEvent)
    fireEvent.mouseUp(slidebox, mouseEvent)

    expect(syncMock).toHaveBeenCalled()
  })

  it('Does not call sync on slide - trigger not specified', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { container, getAllByRole } = render(<XRangeSlider model={rangeSliderProps} />)
    container.querySelector('.input-range__track')!.getBoundingClientRect = () => defaultRect

    const slidebox = getAllByRole('slider')[0]!
    fireEvent.mouseDown(slidebox, mouseEvent)
    fireEvent.mouseUp(slidebox, mouseEvent)

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Shows label when specified', () => {
    const { getByText } = render(<XRangeSlider model={{ ...rangeSliderProps, label: 'Label' }} />)
    expect(getByText('Label')).toBeInTheDocument()
  })
})