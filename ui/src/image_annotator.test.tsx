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

import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { U } from 'h2o-wave'
import React from 'react'
import { ImageAnnotator, XImageAnnotator } from './image_annotator'
import { wave } from './ui'

class MockedImage extends window.Image {
  constructor() {
    super()
    setTimeout(() => { if (this.onload) this.onload(null as any) }, 10)
  }
}
class MockedRenderingContext extends window.CanvasRenderingContext2D {
  drawImage(image: CanvasImageSource, dx: U, dy: U): void
  drawImage(image: CanvasImageSource, dx: U, dy: U, dw: U, dh: U): void
  drawImage(image: CanvasImageSource, sx: U, sy: U, sw: U, sh: U, dx: U, dy: U, dw: U, dh: U): void
  drawImage(_image: any, _sx: U, _sy: U, _sw?: U, _sh?: U, _dx?: U, _dy?: U, _dw?: U, _dh?: U): void {
    // Noop.
  }
}

const
  name = 'image_annotator',
  rect = { shape: { rect: { x1: 10, x2: 100, y1: 10, y2: 100 } }, tag: 'person' },
  polygon = { shape: { polygon: { vertices: [{ x: 105, y: 100 }, { x: 240, y: 100 }, { x: 240, y: 220 },] } }, tag: 'person' },
  items = [rect, polygon],
  model: ImageAnnotator = {
    name,
    image: 'img',
    title: name,
    tags: [
      { name: 'person', label: 'Person', color: 'red' },
      { name: 'object', label: 'Object', color: 'blue' },
    ],
    items
  },
  waitForLoad = async () => act(() => new Promise(res => setTimeout(() => res(), 20)))


describe('ImageAnnotator.tsx', () => {
  beforeAll(() => {
    Object.defineProperty(window.HTMLImageElement.prototype, 'naturalHeight', { get: () => 300 })
    Object.defineProperty(window.HTMLImageElement.prototype, 'naturalWidth', { get: () => 600 })
    window.Image = MockedImage
    window.CanvasRenderingContext2D = MockedRenderingContext
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XImageAnnotator model={model} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets correct args - empty ', () => {
    render(<XImageAnnotator model={{ ...model, items: undefined }} />)
    expect(wave.args[name]).toMatchObject([])
  })

  it('Sets correct args ', async () => {
    render(<XImageAnnotator model={model} />)
    await waitFor(() => expect(wave.args[name]).toMatchObject(items))
  })

  it('Sets correct args - different aspect ratio ', async () => {
    render(<XImageAnnotator model={{ ...model, image_height: '150px' }} />)
    await waitFor(() => expect(wave.args[name]).toMatchObject(items))
  })

  it('Displays the correct cursor when hovering over canvas - no intersection', async () => {
    const { container } = render(<XImageAnnotator model={model} />)
    await waitForLoad()
    const canvasEl = container.querySelectorAll('canvas')[1]
    fireEvent.mouseMove(canvasEl, { clientX: 250, clientY: 250 })
    expect(canvasEl.style.cursor).toBe('auto')
  })

  it('Removes all shapes after clicking remove all btn', async () => {
    const { getByText } = render(<XImageAnnotator model={model} />)
    await waitForLoad()
    expect(wave.args[name]).toMatchObject(items)
    fireEvent.click(getByText('Remove all'))
    expect(wave.args[name]).toMatchObject([])
  })

  describe('Rect', () => {
    it('Draws a new rect', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(getByText('Rectangle'))
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

      expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 110, x2: 150, y1: 110, y2: 150 } } }, ...items])
    })

    it('Draws a new rect with different tag if selected', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(getByText('Rectangle'))
      fireEvent.click(getByText('Object'))
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

      expect(wave.args[name]).toMatchObject([{ tag: 'object', shape: { rect: { x1: 110, x2: 150, y1: 110, y2: 150 } } }, ...items])
    })

    it('Does not draw a new rect if active shape is select', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Removes rect after clicking remove btn', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      expect(wave.args[name]).toMatchObject(items)

      const removeBtn = getByText('Remove selection').parentElement?.parentElement?.parentElement
      expect(removeBtn).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      await waitForLoad()
      expect(removeBtn).not.toHaveAttribute('aria-disabled')
      fireEvent.click(removeBtn!)

      expect(wave.args[name]).toMatchObject([polygon])
    })

    it('Changes tag when clicked existing rect', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.click(getByText('Object'))

      expect(wave.args[name]).toMatchObject([{ ...rect, tag: 'object' }, polygon])
    })

    it('Displays the correct cursor when hovering over rect', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.mouseMove(canvasEl, { clientX: 50, clientY: 50 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Displays the correct cursor when hovering over focused rect', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 100 })
      expect(canvasEl.style.cursor).toBe('nwse-resize')
      fireEvent.mouseMove(canvasEl, { clientX: 250, clientY: 250 })
      expect(canvasEl.style.cursor).toBe('auto')
    })

    it('Displays the correct cursor when hovering over focused rect corners', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })

      // Top left.
      fireEvent.mouseMove(canvasEl, { clientX: 10, clientY: 10 })
      expect(canvasEl.style.cursor).toBe('nwse-resize')
      // Top right.
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 10 })
      expect(canvasEl.style.cursor).toBe('nesw-resize')
      // Bottom left.
      fireEvent.mouseMove(canvasEl, { clientX: 10, clientY: 100 })
      expect(canvasEl.style.cursor).toBe('nesw-resize')
      // Bottom right.
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 100 })
      expect(canvasEl.style.cursor).toBe('nwse-resize')
    })

    it('Moves rect correctly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

      expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 20, x2: 110, y1: 20, y2: 110 } } }, polygon])
    })

    it('Does not move rect if left mouse btn not pressed (dragging)', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60 })
      fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Resizes top left corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 10 })
      fireEvent.mouseMove(canvasEl, { clientX: 5, clientY: 5, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { rect: { x1: 5, x2: 100, y1: 5, y2: 100 } } },
        polygon
      ])
    })

    it('Resizes top right corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 100, clientY: 10 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 5, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { rect: { x1: 10, x2: 105, y1: 5, y2: 100 } } },
        polygon
      ])
    })

    it('Resizes bottom left corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 100 })
      fireEvent.mouseMove(canvasEl, { clientX: 5, clientY: 105, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { rect: { x1: 5, x2: 100, y1: 10, y2: 105 } } },
        polygon
      ])
    })

    it('Resizes bottom right corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 100, clientY: 100 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 105, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { rect: { x1: 10, x2: 105, y1: 10, y2: 105 } } },
        polygon
      ])
    })
  })
  describe('Polygon', () => {
    it('Draws a new polygon', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(getByText('Polygon'))
      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      fireEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      fireEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { polygon: { vertices: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 },] } } },
        ...items
      ])
    })

    it('Draws a new polygon with different tag if selected', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(getByText('Polygon'))
      fireEvent.click(getByText('Object'))

      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      fireEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      fireEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'object', shape: { polygon: { vertices: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 },] } } },
        ...items
      ])
    })

    it('Does not draw a new polygon if active shape is select', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]

      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      fireEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      fireEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Removes polygon after clicking remove btn', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      expect(wave.args[name]).toMatchObject(items)

      const removeBtn = getByText('Remove selection').parentElement?.parentElement?.parentElement
      expect(removeBtn).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      await waitForLoad()
      expect(removeBtn).not.toHaveAttribute('aria-disabled')
      fireEvent.click(removeBtn!)

      expect(wave.args[name]).toMatchObject([rect])
    })

    it('Adds aux point to polygon when clicked', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.click(canvasEl, { clientX: 240, clientY: 160 })
      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 105, y: 100 }, { x: 240, y: 100 }, { x: 240, y: 160 }, { x: 240, y: 220 },] } }, tag: 'person' }
      ])
    })

    it('Changes tag of existing polygon when clicked ', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.click(getByText('Object'))

      expect(wave.args[name]).toMatchObject([rect, { ...polygon, tag: 'object' }])
    })

    it('Displays the correct cursor when hovering over polygon', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.mouseMove(canvasEl, { clientX: 180, clientY: 120 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Displays the correct cursor when hovering over focused polygon', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: 250, clientY: 250 })
      expect(canvasEl.style.cursor).toBe('auto')
    })

    it('Displays the correct cursor when hovering over polygon aux point', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: 240, clientY: 160 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Moves polygon correctly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]

      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseMove(canvasEl, { clientX: 190, clientY: 130, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 190, clientY: 130 })

      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 115, y: 110 }, { x: 250, y: 110 }, { x: 250, y: 230 }] } }, tag: 'person' },
      ])
    })

    it('Does not move polygon if left mouse btn not pressed (dragging)', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]

      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseMove(canvasEl, { clientX: 190, clientY: 130 })
      fireEvent.click(canvasEl, { clientX: 190, clientY: 130 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Moves polygon by a single point correctly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]

      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 105, clientY: 100 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 100, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 200, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 100, clientY: 200 })

      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 100, y: 200 }, { x: 240, y: 100 }, { x: 240, y: 220 },] } }, tag: 'person' },
      ])
    })

    it('Moves polygon by a single point correctly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]

      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 105, clientY: 100 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 100, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 200, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 100, clientY: 200 })

      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 100, y: 200 }, { x: 240, y: 100 }, { x: 240, y: 220 },] } }, tag: 'person' },
      ])
    })

    it('Moves polygon by a single point, then moves it whole', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad()
      const canvasEl = container.querySelectorAll('canvas')[1]

      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 105, clientY: 100 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 100, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 200, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 100, clientY: 200 })

      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 100, y: 200 }, { x: 240, y: 100 }, { x: 240, y: 220 },] } }, tag: 'person' },
      ])

      fireEvent.click(canvasEl, { clientX: 180, clientY: 150 })
      fireEvent.mouseDown(canvasEl, { clientX: 180, clientY: 150 })
      fireEvent.mouseMove(canvasEl, { clientX: 190, clientY: 160, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 190, clientY: 160 })

      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 110, y: 210 }, { x: 250, y: 110 }, { x: 250, y: 230 },] } }, tag: 'person' },
      ])
    })
  })
})