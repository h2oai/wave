// Copyright 2020 H2O.ai, Inc
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

import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { AudioAnnotator, XAudioAnnotator } from './audio_annotator'
import { DrawnAnnotation, recalculateAnnotations } from './parts/range_annotator'
import { wave } from './ui'

const
  name = 'audio_annotator',
  items = [
    { start: 0, end: 20, tag: 'tag1' },
    { start: 160, end: 190, tag: 'tag2' },
  ],
  model: AudioAnnotator = {
    name,
    title: name,
    path: '',
    tags: [
      { name: 'tag1', label: 'Tag 1', color: 'red' },
      { name: 'tag2', label: 'Tag 2', color: 'blue' },
    ],
    items
  },
  { start, end } = items[1],
  mid = (start + end) / 2,
  waitForComponentLoad = async () => act(() => new Promise(res => setTimeout(() => res(), 20))),
  WIDTH_AND_DURATION = 1000,
  WAVE_FORM_HEIGHT = 100

class MockAudioContext {
  createGain = () => ({ gain: {} })
  createMediaElementSource = () => this
  connect = () => this
  decodeAudioData = (_data: any, res: any) => res({ duration: WIDTH_AND_DURATION, getChannelData: () => new Array(300).fill(1) })
}

describe('AudioAnnotator.tsx', () => {
  beforeAll(() => {
    // @ts-ignore
    window.AudioContext = MockAudioContext
    // @ts-ignore
    window.fetch = () => ({ arrayBuffer: () => '' })
    // @ts-ignore
    window.URL = { createObjectURL: () => '' }
    // @ts-ignore
    window.HTMLCanvasElement.prototype.getBoundingClientRect = () => ({ width: WIDTH_AND_DURATION, left: 0, top: 0 })
  })

  it('Renders data-test attr', async () => {
    const { queryByTestId } = render(<XAudioAnnotator model={model} />)
    await waitForComponentLoad()
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets annotation args - empty ', async () => {
    render(<XAudioAnnotator model={{ ...model, items: undefined }} />)
    await waitForComponentLoad()
    expect(wave.args[name]).toMatchObject([])
  })

  it('Sets annotation args ', async () => {
    render(<XAudioAnnotator model={model} />)
    await waitForComponentLoad()
    expect(wave.args[name]).toMatchObject(items)
  })

  it('Displays correct cursor when hovering over canvas - no intersection', async () => {
    const { container } = render(<XAudioAnnotator model={model} />)
    await waitForComponentLoad()
    const canvasEl = container.querySelector('canvas')!
    fireEvent.mouseMove(canvasEl, { clientX: 125, clientY: 25 })
    expect(canvasEl.style.cursor).toBe('pointer')
  })

  it('Removes all shapes after clicking reset', async () => {
    const { getByText } = render(<XAudioAnnotator model={model} />)
    await waitForComponentLoad()
    expect(wave.args[name]).toMatchObject(items)
    fireEvent.click(getByText('Remove all'))
    expect(wave.args[name]).toMatchObject([])
  })

  describe('Annotations', () => {
    it('Draws a new annotation', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 130, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })

      expect(wave.args[name]).toHaveLength(3)
      expect(wave.args[name]).toMatchObject([items[0], { tag: 'tag1', start: 130, end: 140 }, items[1]])
    })

    it('Draws a new annotation by moving forward and then a bit backward', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 130, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 155, clientY: 20, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 150, clientY: 20, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })

      expect(wave.args[name]).toHaveLength(3)
      expect(wave.args[name]).toMatchObject([items[0], { tag: 'tag1', start: 130, end: 140 }, items[1]])
    })

    it('Draws a new annotation by moving forward, backward, forward', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 130, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 150, clientY: 20, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 120, clientY: 20, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })

      expect(wave.args[name]).toHaveLength(3)
      expect(wave.args[name]).toMatchObject([items[0], { tag: 'tag1', start: 130, end: 140 }, items[1]])
    })

    it('Does not draw a new annotation if too small', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 130, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 131, clientY: 20, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 131, clientY: 20, buttons: 1 })

      expect(wave.args[name]).toHaveLength(2)
      expect(wave.args[name]).toMatchObject(items)
    })

    it('Does not draw a new annotation if dragging over zoom - should move zoom instead', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 30, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 31, clientY: 20, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 31, clientY: 20, buttons: 1 })

      expect(wave.args[name]).toHaveLength(2)
      expect(wave.args[name]).toMatchObject(items)
    })

    it('Does not draw a new annotation if left mouse click not pressed', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 130, clientY: 10 })
      fireEvent.mouseMove(canvasEl, { clientX: 131, clientY: 20 })
      fireEvent.click(canvasEl, { clientX: 131, clientY: 20 })

      expect(wave.args[name]).toHaveLength(2)
      expect(wave.args[name]).toMatchObject(items)
    })

    it('Draws a new annotation if moved too fast', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 130, clientY: 10, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 130, clientY: 10, buttons: 1 })

      expect(wave.args[name]).toHaveLength(3)
      expect(wave.args[name]).toMatchObject([items[0], { tag: 'tag1', start: 130, end: 140 }, items[1]])
    })

    it('Removes annotation after clicking remove btn', async () => {
      const { container, getByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      expect(wave.args[name]).toMatchObject(items)

      const removeBtn = getByText('Remove selected').parentElement!.parentElement!.parentElement!
      expect(removeBtn).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(canvasEl, { clientX: mid, clientY: 3 })
      await waitForComponentLoad()
      expect(removeBtn).not.toHaveAttribute('aria-disabled')
      fireEvent.click(removeBtn)

      expect(wave.args[name]).toHaveLength(1)
      expect(wave.args[name]).toMatchObject([items[0]])
    })

    it('Changes tag of focused annotation', async () => {
      const { container, getByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.click(canvasEl, { clientX: 170, clientY: 3 })
      fireEvent.click(getByText('Tag 1'))

      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], tag: 'tag1' }])
    })

    it('Displays the correct cursor when hovering over annotation', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseMove(canvasEl, { clientX: 170, clientY: 3 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Displays move cursor when hovering over focused annotation', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.click(canvasEl, { clientX: 170, clientY: 3, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: 175, clientY: 3, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('move')
    })

    it('Displays resize cursor when hovering over focused annotation boundaries', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.click(canvasEl, { clientX: mid, clientY: 0, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: start, clientY: 0, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('ew-resize')
      fireEvent.mouseMove(canvasEl, { clientX: mid, clientY: 0, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: end, clientY: 0, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('ew-resize')
    })

    it('Displays resize cursor when resizing focused annotation', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.click(canvasEl, { clientX: start, clientY: 3, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('ew-resize')
      fireEvent.mouseDown(canvasEl, { clientX: start, clientY: 3, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start + 10, clientY: 3, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('ew-resize')
    })

    it('Displays move cursor when dragging the focused annotation', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseMove(canvasEl, { clientX: mid, clientY: 3 })
      expect(canvasEl.style.cursor).toBe('pointer')
      fireEvent.click(canvasEl, { clientX: mid, clientY: 10 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseDown(canvasEl, { clientX: mid, clientY: 3, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: mid + 10, clientY: 4, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.click(canvasEl, { clientX: mid + 10, clientY: 5 })
      expect(canvasEl.style.cursor).toBe('move')
    })

    it('Displays resize cursor when dragging the focused annotation', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseMove(canvasEl, { clientX: end, clientY: 3 })
      expect(canvasEl.style.cursor).toBe('pointer')
      fireEvent.click(canvasEl, { clientX: end, clientY: 3 })
      expect(canvasEl.style.cursor).toBe('ew-resize')
      fireEvent.mouseDown(canvasEl, { clientX: end, clientY: 3, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: end + 10, clientY: 4, buttons: 1 })
      expect(canvasEl.style.cursor).toBe('ew-resize')
      fireEvent.click(canvasEl, { clientX: end + 20, clientY: 5 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Moves annotation', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: mid, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: mid + moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: mid + moveOffset, clientY: 60 })

      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], start: start + moveOffset, end: end + moveOffset }])
    })

    it('Does not move annotation if left mouse btn not pressed (dragging)', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: 10, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 50 })
      fireEvent.mouseMove(canvasEl, { clientX: 10 + moveOffset, clientY: 60 })
      fireEvent.click(canvasEl, { clientX: 10 + moveOffset, clientY: 60 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Does not move annotation beyond left border (0)', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const { start, end } = items[0]
      const mid = (start + end) / 2
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: mid, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: start, clientY: 60 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Does not move annotation beyond right border (canvas width)', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = end - mid
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: mid, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: WIDTH_AND_DURATION - moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: WIDTH_AND_DURATION - moveOffset, clientY: 60 })

      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], start: WIDTH_AND_DURATION - (end - start), end: WIDTH_AND_DURATION }])
    })

    it('Resizes annotation from', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: start, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start - moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: start - moveOffset, clientY: 60 })

      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], start: start - moveOffset }])
    })

    it('Resizes annotation from and exceeds the "to"', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const { start, end } = items[1]
      const moveOffset = end - start + 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: start, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start + moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: start + moveOffset, clientY: 60 })

      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], start: end, end: end + 5 }])
    })

    it('Resizes annotation to', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: end, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: end + moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: end + moveOffset, clientY: 60 })

      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], end: end + moveOffset }])
    })

    it('Resizes annotation to and exceeds the "from"', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = end - start + 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: end, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: end - moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: end - moveOffset, clientY: 60 })

      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], start: end - moveOffset, end: start }])
    })

    it.only('Does not remove active tag when leaving and getting back into the zoom rectangle during dragging', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!

      expect(container.querySelector('[class*=activeTag]')).toBeInTheDocument()

      fireEvent.mouseDown(canvasEl, { clientX: 30, clientY: 10, buttons: 1 })
      fireEvent.mouseLeave(canvasEl)
      fireEvent.click(canvasEl, { clientX: 31, clientY: 20, buttons: 1 })

      expect(container.querySelector('[class*=activeTag]')).toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    it('Shows tooltip when hovering over annotation', async () => {
      const { container, getByTestId, getByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseMove(canvasEl, { clientX: mid, clientY: 3 })
      expect(getByTestId('wave-range-annotator-tooltip')).toBeVisible()
      expect(getByText('02:40.00 - 03:10.00')).toBeVisible()
    })

    it('Does not show tooltip when not hovering over annotation', async () => {
      const { container, getByTestId } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseMove(canvasEl, { clientX: 30, clientY: 3 })
      expect(getByTestId('wave-range-annotator-tooltip')).not.toBeVisible()
    })

    it('Shows tooltip while drawing a new annotation', async () => {
      const { container, getByTestId, queryByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 130, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 140, clientY: 20, buttons: 1 })
      expect(getByTestId('wave-range-annotator-tooltip')).toBeVisible()
      expect(queryByText('02:10.00 - 02:20.00')).toBeVisible()
    })

    it('Shows tooltip while moving an annotation', async () => {
      const { container, getByTestId, queryByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: mid, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: mid + moveOffset, clientY: 60, buttons: 1 })
      expect(getByTestId('wave-range-annotator-tooltip')).toBeVisible()
      expect(queryByText('02:45.00 - 03:15.00')).toBeVisible()
    })

    it('Shows tooltip while resizing an annotation "from"', async () => {
      const { container, getByTestId, queryByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: start, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start - moveOffset, clientY: 60, buttons: 1 })
      expect(getByTestId('wave-range-annotator-tooltip')).toBeVisible()
      expect(queryByText('02:35.00 - 03:10.00')).toBeVisible()
    })

    it('Shows correct tooltip while resizing an annotation "from" and exceeds "to"', async () => {
      const { container, getByTestId, queryByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: start, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start + (end - start) + moveOffset, clientY: 60, buttons: 1 })
      expect(getByTestId('wave-range-annotator-tooltip')).toBeVisible()
      expect(queryByText('03:10.00 - 03:15.00')).toBeVisible()
    })

    it('Shows tooltip while resizing an annotation "to"', async () => {
      const { container, getByTestId, queryByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: end, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: end + moveOffset, clientY: 60, buttons: 1 })
      expect(getByTestId('wave-range-annotator-tooltip')).toBeVisible()
      expect(queryByText('02:40.00 - 03:15.00')).toBeVisible()
    })

    it('Shows correct tooltip while resizing an annotation "to" and exceeds "from"', async () => {
      const { container, getByTestId, queryByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: end, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start - 5, clientY: 60, buttons: 1 })
      expect(getByTestId('wave-range-annotator-tooltip')).toBeVisible()
      expect(queryByText('02:35.00 - 02:40.00')).toBeVisible()
    })
  })
  describe('Wave trigger', () => {
    const pushMock = jest.fn()

    beforeAll(() => wave.push = pushMock)
    beforeEach(() => pushMock.mockReset())

    it('Calls push after drawing the annotation', async () => {
      const { container } = render(<XAudioAnnotator model={{ ...model, trigger: true }} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 30, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 40, clientY: 20, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 40, clientY: 20, buttons: 1 })

      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    it('Does not call push after drawing the annottaion', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 30, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 40, clientY: 20, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 40, clientY: 20, buttons: 1 })

      expect(pushMock).toHaveBeenCalledTimes(0)
    })

    it('Calls push after moving', async () => {
      const { container } = render(<XAudioAnnotator model={{ ...model, trigger: true }} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      fireEvent.click(canvasEl, { clientX: 10, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 10 + moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 10 + moveOffset, clientY: 60 })

      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    it('Calls push after resizing annotation from', async () => {
      const { container } = render(<XAudioAnnotator model={{ ...model, trigger: true }} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      const { start } = items[1]
      fireEvent.click(canvasEl, { clientX: mid, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: start, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start - moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: start - moveOffset, clientY: 60 })

      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    it('Calls push after resizing annotation to', async () => {
      const { container } = render(<XAudioAnnotator model={{ ...model, trigger: true }} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      const canvasEl = container.querySelector('canvas')!
      const moveOffset = 5
      const { end } = items[0]
      fireEvent.click(canvasEl, { clientX: 10, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: end, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: end + moveOffset, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: end + moveOffset, clientY: 60 })

      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    it('Calls push after removing all annotations', async () => {
      const { getByText } = render(<XAudioAnnotator model={{ ...model, trigger: true }} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      fireEvent.click(getByText('Remove all'))
      expect(pushMock).toHaveBeenCalledTimes(1)
    })

    it('Calls push after removing annotation', async () => {
      const { container, getByText } = render(<XAudioAnnotator model={{ ...model, trigger: true }} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      expect(wave.args[name]).toMatchObject(items)

      fireEvent.click(canvasEl, { clientX: 3, clientY: 3 })
      await waitForComponentLoad()
      fireEvent.click(getByText('Remove selected'))

      expect(pushMock).toHaveBeenCalledTimes(1)
    })
  })
  describe('Annotations - merge / union', () => {

    it('Merges annotation if intersecting and exceeding from start', async () => {
      const { container, getByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      fireEvent.click(getByText('Tag 2'))
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: start - 20, clientY: 0, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: start + 10, clientY: 0, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: start + 10, clientY: 0, buttons: 1 })

      expect(wave.args[name]).toHaveLength(2)
      expect(wave.args[name]).toMatchObject([items[0], { ...items[1], start: start - 20 }])
    })

    it('Merges annotation if intersecting and exceeding from end', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 0, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 30, clientY: 0, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 30, clientY: 0, buttons: 1 })

      expect(wave.args[name]).toHaveLength(2)
      expect(wave.args[name]).toMatchObject([{ ...items[0], end: 30 }, items[1]])
    })

    it('Merges annotations when intersecting with both ends', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 0, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 15, clientY: 0, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 15, clientY: 0, buttons: 1 })

      expect(wave.args[name]).toHaveLength(2)
      expect(wave.args[name]).toMatchObject(items)
    })

    it('Does not merge if intersecting with different tag', async () => {
      const { container } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      const canvasEl = container.querySelector('canvas')!
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 0, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 70, clientY: 0, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 70, clientY: 0, buttons: 1 })

      expect(wave.args[name]).toHaveLength(3)
      expect(wave.args[name]).toMatchObject([items[0], { start: 50, end: 70, tag: 'tag1' }, items[1]])
    })
  })

  describe('Annotations recalculations', () => {
    const base = { start: 0, end: 0 }

    it('Does not recalculate if no annotations', () => {
      const annotations: DrawnAnnotation[] = []
      expect(recalculateAnnotations(annotations)).toMatchObject(annotations)
    })

    it('Handles single annotation', () => {
      const annotations: DrawnAnnotation[] = [{ id: '1', ...base, canvasStart: 10, canvasEnd: 20, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' }]
      expect(recalculateAnnotations(annotations)).toMatchObject(annotations)
    })

    it('Handles 2 separate annotations', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 20, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 30, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject(annotations)
    })

    it('Merges 2 intersecting same tag annotations', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 20, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 15, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
      ])
    })

    it('Handles 2 intersecting annotations - start', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 30, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 30, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag2' },
      ])
    })

    it('Handles 2 intersecting annotations - middle ', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag2' },
      ])
    })

    it('Handles 2 intersecting annotations - end', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 30, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 30, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag2' },
      ])
    })

    it('Handles 3 zig-zag intersecting annotations - tag1, tag2, tag1', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 25, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 45, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 40, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 25, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 45, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 40, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag1' },
      ])
    })

    it('Handles 3 intersecting annotations - tag1, tag2, tag3', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 30, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: WAVE_FORM_HEIGHT / 3, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 30, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT - (2 * WAVE_FORM_HEIGHT / 3), canvasY: 2 * WAVE_FORM_HEIGHT / 3, tag: 'tag3' },
      ])
    })

    it('Handles 3 intersecting annotations - tag1, tag2, tag2', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 30, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 40, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 30, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 40, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag2' },
      ])
    })

    it('Handles 3 intersecting annotations - tag2, tag1, tag1', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '3', ...base, canvasStart: 30, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 40, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag2' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag1' },
      ])
    })

    it('Handles 3 intersecting annotations and 1 that should fill the remaining space', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 140, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 30, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 90, canvasEnd: 170, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 140, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: WAVE_FORM_HEIGHT / 3, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 30, canvasEnd: 70, canvasHeight: WAVE_FORM_HEIGHT - (2 * WAVE_FORM_HEIGHT / 3), canvasY: WAVE_FORM_HEIGHT / 3 * 2, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 90, canvasEnd: 170, canvasHeight: WAVE_FORM_HEIGHT - (WAVE_FORM_HEIGHT / 3), canvasY: WAVE_FORM_HEIGHT / 3, tag: 'tag2' },
      ])
    })

    it('Handles 3 intersecting annotations and 1 that should fill the remaining space - 2', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 140, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 60, canvasEnd: 80, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 70, canvasEnd: 170, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 140, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 50, canvasHeight: WAVE_FORM_HEIGHT - (WAVE_FORM_HEIGHT / 3), canvasY: WAVE_FORM_HEIGHT / 3, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 60, canvasEnd: 80, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: WAVE_FORM_HEIGHT / 3, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 70, canvasEnd: 170, canvasHeight: WAVE_FORM_HEIGHT - (2 * WAVE_FORM_HEIGHT / 3), canvasY: 2 * WAVE_FORM_HEIGHT / 3, tag: 'tag2' },
      ])
    })

    it('Handles 3 intersecting annotations and 1 that should fill the remaining space - 3', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 100, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 50, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 70, canvasEnd: 90, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 20, canvasEnd: 100, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: WAVE_FORM_HEIGHT / 3, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 50, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT - (2 * WAVE_FORM_HEIGHT / 3), canvasY: WAVE_FORM_HEIGHT / 3 * 2, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 70, canvasEnd: 90, canvasHeight: WAVE_FORM_HEIGHT / 3, canvasY: 0, tag: 'tag3' },
      ])
    })

    it('Handles multiple intersecting annotations with same start', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 10, canvasEnd: 100, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag4' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 10, canvasEnd: 100, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: WAVE_FORM_HEIGHT / 4, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 2 * WAVE_FORM_HEIGHT / 4, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 3 * WAVE_FORM_HEIGHT / 4, tag: 'tag4' },
      ])
    })

    it('Handles multiple intersecting annotations with same start and a couple of other intersecting', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 10, canvasEnd: 100, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag4' },
        { id: '5', ...base, canvasStart: 210, canvasEnd: 240, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '6', ...base, canvasStart: 230, canvasEnd: 250, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 10, canvasEnd: 100, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: WAVE_FORM_HEIGHT / 4, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 2 * WAVE_FORM_HEIGHT / 4, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 10, canvasEnd: 160, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 3 * WAVE_FORM_HEIGHT / 4, tag: 'tag4' },
        { id: '5', ...base, canvasStart: 210, canvasEnd: 240, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: 0, tag: 'tag1' },
        { id: '6', ...base, canvasStart: 230, canvasEnd: 250, canvasHeight: WAVE_FORM_HEIGHT / 2, canvasY: WAVE_FORM_HEIGHT / 2, tag: 'tag2' },
      ])
    })

    it('Handles 4 intersecting annotations with same start zig zag', () => {
      const annotations: DrawnAnnotation[] = [
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT, canvasY: 0, tag: 'tag4' },
      ]
      expect(recalculateAnnotations(annotations)).toMatchObject([
        { id: '1', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 0, tag: 'tag1' },
        { id: '2', ...base, canvasStart: 10, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: WAVE_FORM_HEIGHT / 4, tag: 'tag2' },
        { id: '3', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 2 * WAVE_FORM_HEIGHT / 4, tag: 'tag3' },
        { id: '4', ...base, canvasStart: 20, canvasEnd: 60, canvasHeight: WAVE_FORM_HEIGHT / 4, canvasY: 3 * WAVE_FORM_HEIGHT / 4, tag: 'tag4' },
      ])
    })

    it('Handles intersection tag1 tag2 tag2 after moving from right to left', async () => {
      const { container, getByText } = render(<XAudioAnnotator model={model} />)
      await waitForComponentLoad()
      expect(wave.args[name]).toMatchObject(items)
      fireEvent.click(getByText('Tag 2'))

      const canvasEl = container.querySelector('canvas')!

      fireEvent.mouseDown(canvasEl, { clientX: 200, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 380, clientY: 10, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 380, clientY: 10, buttons: 1 })

      expect(wave.args[name]).toHaveLength(3)
      expect(wave.args[name]).toMatchObject([...items, { start: 200, end: 380, tag: 'tag2' }])

      fireEvent.click(canvasEl, { clientX: 210, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 210, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 150, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 60 })

      expect(wave.args[name]).toHaveLength(2)
      expect(wave.args[name]).toMatchObject([items[0], { start: 140, end: 320, tag: 'tag2' }])
    })
  })
})
