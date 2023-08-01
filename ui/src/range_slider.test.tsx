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
import { RangeSlider, XRangeSlider } from './range_slider'
import { wave } from './ui'

const name = 'rangeSlider'
const rangeSliderProps: RangeSlider = { name, min: 0, max: 100 }
const defaultRect = { left: 0, top: 0, right: 0, bottom: 0, width: 100, height: 40 } as DOMRect
const mouseEvent = { clientX: 50, clientY: 0 }

describe('rangeSlider.tsx', () => {
  beforeEach(() => { wave.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XRangeSlider model={rangeSliderProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<XRangeSlider model={rangeSliderProps} />)
    expect(wave.args[name]).toMatchObject([0, 100])
  })

  it('Sets args - init - min max specified', () => {
    render(<XRangeSlider model={{ ...rangeSliderProps, min_value: 1, max_value: 2 }} />)
    expect(wave.args[name]).toMatchObject([1, 2])
  })

  it('Sets args - init - max_val > max', () => {
    render(<XRangeSlider model={{ ...rangeSliderProps, max: 100, max_value: 101 }} />)
    expect(wave.args[name]).toMatchObject([0, 100])
  })

  it('Sets args - init - min_val < min', () => {
    render(<XRangeSlider model={{ ...rangeSliderProps, min: 1, min_value: 0 }} />)
    expect(wave.args[name]).toMatchObject([1, 100])
  })

  it('Sets args on slide', () => {
    const { container, getAllByRole } = render(<XRangeSlider model={rangeSliderProps} />)
    expect(wave.args[name]).toMatchObject([0, 100])

    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect
    fireEvent.mouseDown(getAllByRole('slider')[0]!, mouseEvent)

    expect(wave.args[name]).toMatchObject([50, 100])
  })

  it('Set args when value is updated to different value', () => {
    const { rerender } = render(<XRangeSlider model={{ ...rangeSliderProps, min_value: 40, max_value: 60 }} />)
    expect(wave.args[name]).toMatchObject([40, 60])
    rerender(<XRangeSlider model={{ ...rangeSliderProps, min_value: 30, max_value: 70 }} />)
    expect(wave.args[name]).toMatchObject([30, 70])
  })

  it('Set args when value is updated to initial value', () => {
    const { container, getAllByRole, rerender } = render(<XRangeSlider model={{ ...rangeSliderProps, min_value: 40, max_value: 60 }} />)
    expect(wave.args[name]).toMatchObject([40, 60])

    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect
    fireEvent.mouseDown(getAllByRole('slider')[0]!, mouseEvent)
    expect(wave.args[name]).toMatchObject([50, 60])

    rerender(<XRangeSlider model={{ ...rangeSliderProps, min_value: 40, max_value: 60 }} />)
    expect(wave.args[name]).toMatchObject([40, 60])
  })

  it('Calls sync on slide', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { container, getAllByRole } = render(<XRangeSlider model={{ ...rangeSliderProps, trigger: true }} />)
    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect

    const slidebox = getAllByRole('slider')[0]!
    fireEvent.mouseDown(slidebox, mouseEvent)
    fireEvent.mouseUp(slidebox, mouseEvent)

    expect(pushMock).toHaveBeenCalled()
  })

  it('Does not call sync on slide - trigger not specified', () => {
    const pushMock = jest.fn()
    wave.push = pushMock

    const { container, getAllByRole } = render(<XRangeSlider model={rangeSliderProps} />)
    container.querySelector('.ms-Slider-line')!.getBoundingClientRect = () => defaultRect

    const slidebox = getAllByRole('slider')[0]!
    fireEvent.mouseDown(slidebox, mouseEvent)
    fireEvent.mouseUp(slidebox, mouseEvent)

    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Shows label when specified', () => {
    const { getByText } = render(<XRangeSlider model={{ ...rangeSliderProps, label: 'Label' }} />)
    expect(getByText('Label')).toBeInTheDocument()
  })
})