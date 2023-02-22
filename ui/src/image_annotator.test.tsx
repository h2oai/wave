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
import userEvent from '@testing-library/user-event'
import React from 'react'
import { ImageAnnotator, XImageAnnotator } from './image_annotator'
import { wave } from './ui'

const
  name = 'image_annotator',
  rect = { tag: 'person', shape: { rect: { x1: 10, x2: 100, y1: 10, y2: 100 } } },
  polygon = { tag: 'person', shape: { polygon: { vertices: [{ x: 105, y: 100 }, { x: 240, y: 100 }, { x: 240, y: 220 },] } } },
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
  waitForLoad = async (container?: HTMLElement) => {
    await act(() => {
      // TODO: Ugly, need to find a way to mock HTMLImageElement and force it to load.
      if (container) {
        const imgEl = container.querySelector('img') as HTMLImageElement
        fireEvent.load(imgEl)
      }
      return new Promise(res => setTimeout(() => res(), 20))
    })
  }


describe('ImageAnnotator.tsx', () => {
  beforeAll(() => {
    Object.defineProperty(window.HTMLImageElement.prototype, 'naturalHeight', { get: () => 300 })
    Object.defineProperty(window.HTMLImageElement.prototype, 'naturalWidth', { get: () => 600 })
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
    await waitForLoad(container)
    const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
    fireEvent.mouseMove(canvasEl, { clientX: 250, clientY: 250 })
    expect(canvasEl.style.cursor).toBe('auto')
  })

  it('Removes all shapes after clicking remove all btn', async () => {
    const { container, getByText } = render(<XImageAnnotator model={model} />)
    await waitForLoad(container)
    expect(wave.args[name]).toMatchObject(items)
    fireEvent.click(getByText('Remove all'))
    expect(wave.args[name]).toMatchObject([])
  })

  describe('Rect', () => {
    it('Draws a new rect', async () => {
      const { container, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Rectangle'))
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 150, clientY: 150, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

      expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 110, x2: 150, y1: 110, y2: 150 } } }, ...items])
    })

    it('Draws a new rect with different tag if selected', async () => {
      const { container, getByText, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Rectangle'))
      fireEvent.click(getByText('Object'))
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 150, clientY: 150, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

      expect(wave.args[name]).toMatchObject([{ tag: 'object', shape: { rect: { x1: 110, x2: 150, y1: 110, y2: 150 } } }, ...items])
    })

    it('Does not draw a new rect if active shape is select', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Does not draw a new rect if dimensions too small', async () => {
      const { container, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Rectangle'))
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 115, clientY: 115 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Removes rect after clicking remove btn', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
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
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.click(getByText('Object'))

      expect(wave.args[name]).toMatchObject([{ ...rect, tag: 'object' }, polygon])
    })

    it('Displays the correct cursor when hovering over rect', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.mouseMove(canvasEl, { clientX: 50, clientY: 50 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Displays the correct cursor when hovering over focused rect', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 100 })
      expect(canvasEl.style.cursor).toBe('nwse-resize')
      fireEvent.mouseMove(canvasEl, { clientX: 250, clientY: 250 })
      expect(canvasEl.style.cursor).toBe('auto')
    })

    it('Displays the correct cursor when hovering over focused rect corners', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
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
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

      expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 20, x2: 110, y1: 20, y2: 110 } } }, polygon])
    })

    it('Moves rect correctly if click happened outside the canvas', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 45, clientY: 50, buttons: 1 })
      fireEvent.mouseLeave(canvasEl, { clientX: -10, clientY: 60, buttons: 1 })

      expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 5, x2: 95, y1: 10, y2: 100 } } }, polygon])
    })

    it('Moves rect correctly if multiple selected', async () => {
      const rect1 = { tag: 'person', shape: { rect: { x1: 5, x2: 9, y1: 5, y2: 9 } } }
      const rect2 = { tag: 'person', shape: { rect: { x1: 10, x2: 100, y1: 10, y2: 100 } } }
      const rect3 = { tag: 'person', shape: { rect: { x1: 110, x2: 120, y1: 110, y2: 120 } } }
      const m = { ...model, items: [rect1, rect2, rect3] }
      const { container } = render(<XImageAnnotator model={m} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.keyDown(canvasEl, { key: 'a' })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

      expect(wave.args[name]).toMatchObject([rect1, { tag: 'person', shape: { rect: { x1: 20, x2: 110, y1: 20, y2: 110 } } }, rect3])
    })


    it('Does not move rect if click happened outside the canvas but left mouse btn not pressed', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 45, clientY: 50, buttons: 1 })
      fireEvent.mouseLeave(canvasEl, { clientX: -10, clientY: 60 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Does not move rect if left mouse btn not pressed (dragging)', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60 })
      fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Resizes top left corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 5, clientY: 5, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { rect: { x1: 5, x2: 100, y1: 5, y2: 100 } } },
        polygon
      ])
    })

    it('Resizes corner properly when multiple selected', async () => {
      const rect1 = { tag: 'person', shape: { rect: { x1: 5, x2: 9, y1: 5, y2: 9 } } }
      const rect2 = { tag: 'person', shape: { rect: { x1: 10, x2: 100, y1: 10, y2: 100 } } }
      const rect3 = { tag: 'person', shape: { rect: { x1: 110, x2: 120, y1: 110, y2: 120 } } }
      const { container } = render(<XImageAnnotator model={{ ...model, items: [rect1, rect2, rect3] }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.keyDown(canvasEl, { key: 'a' })
      fireEvent.mouseDown(canvasEl, { clientX: 100, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 5, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 105, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        rect1,
        { tag: 'person', shape: { rect: { x1: 10, x2: 105, y1: 5, y2: 100 } } },
        rect3
      ])
    })

    it('Resizes top right corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 100, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 5, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { rect: { x1: 10, x2: 105, y1: 5, y2: 100 } } },
        polygon
      ])
    })

    it('Resizes bottom left corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 100, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 5, clientY: 105, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { rect: { x1: 5, x2: 100, y1: 10, y2: 105 } } },
        polygon
      ])
    })

    it('Resizes bottom right corner properly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 100, clientY: 100, buttons: 1 })
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
      const { container, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Polygon'))
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      userEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      userEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { polygon: { vertices: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 },] } } },
        ...items
      ])
    })

    it('Draws a new polygon with different tag if selected', async () => {
      const { container, getByText, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Polygon'))
      fireEvent.click(getByText('Object'))

      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      userEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      userEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'object', shape: { polygon: { vertices: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 },] } } },
        ...items
      ])
    })

    it('Does not draw a new polygon if active shape is select', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement

      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      fireEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      fireEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Removes polygon after clicking remove btn', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
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
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 240, clientY: 160 })
      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 105, y: 100 }, { x: 240, y: 100 }, { x: 240, y: 160 }, { x: 240, y: 220 },] } }, tag: 'person' }
      ])
    })

    it('Removes point from polygon when right-clicked', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 105, clientY: 100, buttons: 2 })
      expect(wave.args[name]).toMatchObject([
        rect,
        { shape: { polygon: { vertices: [{ x: 240, y: 100 }, { x: 240, y: 220 },] } }, tag: 'person' }
      ])
    })

    it('Changes tag of existing polygon when clicked ', async () => {
      const { container, getByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.click(getByText('Object'))

      expect(wave.args[name]).toMatchObject([rect, { ...polygon, tag: 'object' }])
    })

    it('Displays the correct cursor when hovering over polygon', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.mouseMove(canvasEl, { clientX: 180, clientY: 120 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Displays the correct cursor when hovering over focused polygon', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: 250, clientY: 250 })
      expect(canvasEl.style.cursor).toBe('auto')
    })

    it('Displays the correct cursor when hovering over polygon aux point', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      expect(canvasEl.style.cursor).toBe('move')
      fireEvent.mouseMove(canvasEl, { clientX: 240, clientY: 160 })
      expect(canvasEl.style.cursor).toBe('pointer')
    })

    it('Moves polygon correctly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement

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
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement

      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseMove(canvasEl, { clientX: 190, clientY: 130 })
      fireEvent.click(canvasEl, { clientX: 190, clientY: 130 })

      expect(wave.args[name]).toMatchObject(items)
    })

    it('Moves polygon by a single point correctly', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement

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
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement

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

    it('Cancels polygon drawing when hitting escape', async () => {
      const { container, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Polygon'))
      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      fireEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      fireEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      fireEvent.keyDown(canvasEl, { key: 'Escape' })
      fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject(items)
    })
  })

  describe('Trigger attribute', () => {
    const pushMock = jest.fn()

    beforeAll(() => wave.push = pushMock)
    beforeEach(() => pushMock.mockReset())

    it('Calls sync after remove all', async () => {
      const { container, getByText } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      fireEvent.click(getByText('Remove all'))
      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after drawing rect', async () => {
      const { container, getByTitle } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Rectangle'))
      fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 150, clientY: 150, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after drawing polygon', async () => {
      const { container, getByTitle } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Polygon'))
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      userEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      userEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after moving rect', async () => {
      const { container } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after moving rect and finishing outside of canvas', async () => {
      const { container } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after resizing rect', async () => {
      const { container } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      fireEvent.mouseDown(canvasEl, { clientX: 10, clientY: 10, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 5, clientY: 5, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 5, clientY: 5 })

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after removing rect', async () => {
      const { container, getByText } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
      await waitForLoad()
      fireEvent.click(getByText('Remove selection').parentElement!.parentElement!.parentElement!)

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after removing polygon', async () => {
      const { container, getByText } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      expect(wave.args[name]).toMatchObject(items)

      const removeBtn = getByText('Remove selection').parentElement?.parentElement?.parentElement
      expect(removeBtn).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      await waitForLoad()
      expect(removeBtn).not.toHaveAttribute('aria-disabled')
      fireEvent.click(removeBtn!)

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after adding aux point to polygon', async () => {
      const { container } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 240, clientY: 160 })
      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after removing point in polygon', async () => {
      const { container } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 105, clientY: 100, buttons: 2 })
      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after changing polygon tag', async () => {
      const { container, getByText } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.click(getByText('Object'))

      expect(pushMock).toBeCalledTimes(1)
    })

    it('Calls sync after moving polygon', async () => {
      const { container } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement

      fireEvent.click(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseDown(canvasEl, { clientX: 180, clientY: 120 })
      fireEvent.mouseMove(canvasEl, { clientX: 105, clientY: 100, buttons: 1 })
      fireEvent.mouseMove(canvasEl, { clientX: 100, clientY: 200, buttons: 1 })
      fireEvent.click(canvasEl, { clientX: 100, clientY: 200 })

      expect(pushMock).toBeCalledTimes(1)
    })
  })

  describe('Keyboard shortcuts', () => {
    it('Use "d" to delete selected shapes', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(canvasEl, { clientX: 180, clientY: 120, shiftKey: true })
      fireEvent.keyDown(canvasEl, { key: 'd' })
      expect(wave.args[name]).toMatchObject([rect])
    })

    it('Use "c" and "v" to copy/paste all selected shapes', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.keyDown(canvasEl, { key: 'a' })
      fireEvent.keyDown(canvasEl, { key: 'c' })
      fireEvent.keyDown(canvasEl, { key: 'd' })
      expect(wave.args[name]).toMatchObject([])

      fireEvent.keyDown(canvasEl, { key: 'v' })
      expect(wave.args[name]).toMatchObject(items)
    })

    it('Use "c" and "v" to copy/paste multiple times', async () => {
      const { container } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      expect(wave.args[name]).toHaveLength(2)
      fireEvent.keyDown(canvasEl, { key: 'a' })
      fireEvent.keyDown(canvasEl, { key: 'c' })
      fireEvent.keyDown(canvasEl, { key: 'v' })
      expect(wave.args[name]).toHaveLength(4)
      fireEvent.keyDown(canvasEl, { key: 'c' })
      fireEvent.keyDown(canvasEl, { key: 'v' })
      expect(wave.args[name]).toHaveLength(6)
    })

    it('Use "Backspace"  while annotating to remove the last polygon vertice', async () => {
      const { container, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Polygon'))
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      userEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      userEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      userEvent.click(canvasEl, { clientX: 40, clientY: 40 })
      fireEvent.keyDown(canvasEl, { key: 'Backspace' })
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { polygon: { vertices: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }] } } },
        ...items
      ])
    })

    it('Finish drawing the polygon by pressing "enter"', async () => {
      const { container, getByTitle } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      fireEvent.click(getByTitle('Polygon'))
      userEvent.click(canvasEl, { clientX: 10, clientY: 10 })
      userEvent.click(canvasEl, { clientX: 20, clientY: 20 })
      userEvent.click(canvasEl, { clientX: 30, clientY: 30 })
      fireEvent.keyDown(canvasEl, { key: 'Enter' })

      expect(wave.args[name]).toMatchObject([
        { tag: 'person', shape: { polygon: { vertices: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 },] } } },
        ...items
      ])
    })

    it('Shows the shortcuts info in the tooltip when the info icon is hovered', async () => {
      const { container, queryByText } = render(<XImageAnnotator model={model} />)
      await waitForLoad(container)
      expect(queryByText('Keyboard shortcuts')).not.toBeInTheDocument()
      fireEvent.mouseOver(container.querySelector("[data-icon-name='Info']")!)
      expect(queryByText('Keyboard shortcuts')).toBeInTheDocument()
    })

    describe('Selection', () => {
      it('Use "a" to select all shapes', async () => {
        const { container, getByText } = render(<XImageAnnotator model={{ ...model, trigger: true }} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement

        fireEvent.keyDown(canvasEl, { key: 'a' })
        const removeBtn = getByText('Remove selection').parentElement?.parentElement?.parentElement
        await waitFor(() => expect(removeBtn).not.toHaveAttribute('aria-disabled'))
        expect(wave.args[name]).toMatchObject(items)
        fireEvent.click(removeBtn!)
        expect(wave.args[name]).toMatchObject([])
      })

      it('Allow multiple shapes selection while holding "shift" and clicking', async () => {
        const { container, getByText } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
        fireEvent.click(canvasEl, { clientX: 180, clientY: 120, shiftKey: true })
        const removeBtn = getByText('Remove selection').parentElement?.parentElement?.parentElement
        await waitFor(() => expect(removeBtn).not.toHaveAttribute('aria-disabled'))
        expect(wave.args[name]).toMatchObject(items)
        fireEvent.click(removeBtn!)
        expect(wave.args[name]).toMatchObject([])
      })

      it('Allow shape deselection while holding "shift" and clicking', async () => {
        const { container, getByText } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
        let removeBtn = getByText('Remove selection').parentElement?.parentElement?.parentElement
        await waitFor(() => expect(removeBtn).not.toHaveAttribute('aria-disabled'))
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50, shiftKey: true })
        removeBtn = getByText('Remove selection').parentElement?.parentElement?.parentElement
        await waitFor(() => expect(removeBtn).toHaveAttribute('aria-disabled'))
      })
    })

    describe('Movement', () => {
      it('Use arrows to move the selected shape', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })

        fireEvent.keyDown(canvasEl, { key: 'ArrowUp' })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 10, x2: 100, y1: 9, y2: 99 } } }, polygon])

        fireEvent.keyDown(canvasEl, { key: 'ArrowRight' })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 11, x2: 101, y1: 9, y2: 99 } } }, polygon])

        fireEvent.keyDown(canvasEl, { key: 'ArrowDown' })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 11, x2: 101, y1: 10, y2: 100 } } }, polygon])

        fireEvent.keyDown(canvasEl, { key: 'ArrowLeft' })
        expect(wave.args[name]).toMatchObject(items)
      })

      it('Move the selected shape by 10 when using "Shift" + arrows', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })

        fireEvent.keyDown(canvasEl, { key: 'ArrowUp', shiftKey: true })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 10, x2: 100, y1: 0, y2: 90 } } }, polygon])

        fireEvent.keyDown(canvasEl, { key: 'ArrowRight', shiftKey: true })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 20, x2: 110, y1: 0, y2: 90 } } }, polygon])

        fireEvent.keyDown(canvasEl, { key: 'ArrowDown', shiftKey: true })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 20, x2: 110, y1: 10, y2: 100 } } }, polygon])

        fireEvent.keyDown(canvasEl, { key: 'ArrowLeft', shiftKey: true })
        expect(wave.args[name]).toMatchObject(items)
      })

      it('Move multiple selected shapes at once by arrows', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.keyDown(canvasEl, { key: 'a' })

        fireEvent.keyDown(canvasEl, { key: 'ArrowUp' })
        expect(wave.args[name]).toMatchObject([
          { tag: 'person', shape: { rect: { x1: 10, x2: 100, y1: 9, y2: 99 } } },
          { shape: { polygon: { vertices: [{ x: 105, y: 99 }, { x: 240, y: 99 }, { x: 240, y: 219 },] } }, tag: 'person' }
        ])

        fireEvent.keyDown(canvasEl, { key: 'ArrowRight' })
        expect(wave.args[name]).toMatchObject([
          { tag: 'person', shape: { rect: { x1: 11, x2: 101, y1: 9, y2: 99 } } },
          { shape: { polygon: { vertices: [{ x: 106, y: 99 }, { x: 241, y: 99 }, { x: 241, y: 219 },] } }, tag: 'person' }
        ])

        fireEvent.keyDown(canvasEl, { key: 'ArrowDown' })
        expect(wave.args[name]).toMatchObject([
          { tag: 'person', shape: { rect: { x1: 11, x2: 101, y1: 10, y2: 100 } } },
          { shape: { polygon: { vertices: [{ x: 106, y: 100 }, { x: 241, y: 100 }, { x: 241, y: 220 },] } }, tag: 'person' }
        ])

        fireEvent.keyDown(canvasEl, { key: 'ArrowLeft' })
        expect(wave.args[name]).toMatchObject(items)
      })

      it('Respect canvas boundaries when moving by arrows - top, left', async () => {
        const items = [
          { tag: 'person', shape: { rect: { x1: 0, x2: 20, y1: 5, y2: 100 } } },
          { shape: { polygon: { vertices: [{ x: 0, y: 8 }, { x: 6, y: 40 }, { x: 60, y: 30 },] } }, tag: 'person' }
        ]
        const { container } = render(<XImageAnnotator model={{ ...model, items }} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        // Select both rect and polygon to test if both shapes respect canvas boundaries.
        fireEvent.keyDown(canvasEl, { key: 'a' })
        fireEvent.keyDown(canvasEl, { key: 'ArrowUp', shiftKey: true })
        fireEvent.keyDown(canvasEl, { key: 'ArrowLeft' })

        expect(wave.args[name]).toMatchObject([
          { tag: 'person', shape: { rect: { x1: 0, x2: 20, y1: 0, y2: 95 } } },
          { shape: { polygon: { vertices: [{ x: 0, y: 0 }, { x: 6, y: 32 }, { x: 60, y: 22 }] } }, tag: 'person' }
        ])
      })

      it('Respect canvas boundaries when moving by arrows - bottom, right', async () => {
        const items = [
          { tag: 'person', shape: { rect: { x1: 590, x2: 600, y1: 200, y2: 292 } } },
          { shape: { polygon: { vertices: [{ x: 450, y: 100 }, { x: 600, y: 150 }, { x: 500, y: 291 }] } }, tag: 'person' }
        ]
        const { container } = render(<XImageAnnotator model={{ ...model, items }} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.keyDown(canvasEl, { key: 'a' })
        fireEvent.keyDown(canvasEl, { key: 'ArrowDown', shiftKey: true })
        fireEvent.keyDown(canvasEl, { key: 'ArrowRight' })

        expect(wave.args[name]).toMatchObject([
          { tag: 'person', shape: { rect: { x1: 590, x2: 600, y1: 208, y2: 300 } } },
          { shape: { polygon: { vertices: [{ x: 450, y: 109 }, { x: 600, y: 159 }, { x: 500, y: 300 }] } }, tag: 'person' }
        ])
      })
    })

    describe('Zoom', () => {
      it('Moves rect correctly when the image is zoomed - 1 zoom step', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        // Zooms in one zoom step.
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
        fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
        fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
        fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

        // Final move distance is calculated in the way that each of the cursor coordinates is divided by the zoom. 
        // E.g. moveDistanceX = endClientX/zoom - startClientX/zoom; 60/1.15 - 50/1.15 = 8.69 ≈ 9.
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 19, x2: 109, y1: 19, y2: 109 } } }, polygon])
      })

      it('Moves rect correctly when the image is zoomed - 2 zoom steps', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        // Zooms in 2 zoom steps.
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
        fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
        fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
        fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })

        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 18, x2: 108, y1: 18, y2: 108 } } }, polygon])
      })

      it('Sets correct wave args when drawing a new rectangle while the image is zoomed', async () => {
        const { container, getByTitle } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        fireEvent.click(getByTitle('Rectangle'))
        fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110, buttons: 1 })
        fireEvent.mouseMove(canvasEl, { clientX: 150, clientY: 150, buttons: 1 })
        fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 96, x2: 130, y1: 96, y2: 130 } } }, ...items])
      })

      it('Sets correct wave args when drawing a new polygon while the image is zoomed', async () => {
        const { container, getByTitle } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        fireEvent.click(getByTitle('Polygon'))
        userEvent.click(canvasEl, { clientX: 10, clientY: 10 })
        userEvent.click(canvasEl, { clientX: 20, clientY: 20 })
        userEvent.click(canvasEl, { clientX: 30, clientY: 30 })
        userEvent.click(canvasEl, { clientX: 10, clientY: 10 })

        expect(wave.args[name]).toMatchObject([
          { tag: 'person', shape: { polygon: { vertices: [{ x: 9, y: 9 }, { x: 17, y: 17 }, { x: 26, y: 26 }] } } },
          ...items
        ])
      })

      it('Change cursor to "grab", only while the "Control" is pressed and if the image is zoomed', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        fireEvent.keyDown(canvasEl, { key: 'Control' })
        expect(canvasEl.style.cursor).toBe('grab')
        fireEvent.keyUp(canvasEl, { key: 'Control' })
        expect(canvasEl.style.cursor).toBe('auto')
      })

      it('Change cursor to "grabbing" while dragging the image', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1, ctrlKey: true })
        fireEvent.mouseMove(canvasEl, { clientX: 55, clientY: 55, buttons: 1, ctrlKey: true })
        expect(canvasEl.style.cursor).toBe('grabbing')
      })

      it('Check if the canvas is empty after all shapes are removed and then the image is zoomed', async () => {
        const { container, getByText } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        expect(wave.args[name]).toMatchObject(items)
        fireEvent.click(getByText('Remove all'))
        fireEvent.wheel(canvasEl, { deltaY: -1, ctrlKey: true })
        expect(wave.args[name]).toMatchObject([])
      })
    })

    describe('Active shape switching', () => {
      it('Use "b" to switch the active shape', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.keyDown(canvasEl, { key: 'b' })

        // TODO: Use data-testid instead.
        await waitFor(() => expect(document.querySelector('[class*="is-checked"]')).toHaveAttribute('title', 'Rectangle'))
      })

      it('Changes cursor with changing active shape', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.keyDown(canvasEl, { key: 'b' })
        expect(canvasEl.style.cursor).toBe('crosshair')
        fireEvent.keyDown(canvasEl, { key: 'b' })
        expect(canvasEl.style.cursor).toBe('crosshair')
        fireEvent.keyDown(canvasEl, { key: 'b' })
        expect(canvasEl.style.cursor).toBe('auto')
      })

      it('Cancel rectangle creation when switching the active shape', async () => {
        const { container, getByTitle } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(getByTitle('Rectangle'))
        fireEvent.mouseDown(canvasEl, { clientX: 110, clientY: 110, buttons: 1 })
        fireEvent.keyDown(canvasEl, { key: 'b' })
        fireEvent.click(canvasEl, { clientX: 150, clientY: 150 })

        expect(wave.args[name]).toMatchObject(items)
      })

      it('Cancel polygon creation when switching the active shape', async () => {
        const { container, getByTitle } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(getByTitle('Polygon'))
        fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })
        fireEvent.click(canvasEl, { clientX: 20, clientY: 20 })
        fireEvent.click(canvasEl, { clientX: 30, clientY: 30 })
        fireEvent.keyDown(canvasEl, { key: 'b' })
        fireEvent.click(canvasEl, { clientX: 10, clientY: 10 })

        expect(wave.args[name]).toMatchObject(items)
      })

      it('Cancel the rectangle movement when switching from "select" to "rect"', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
        fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
        fireEvent.mouseMove(canvasEl, { clientX: 55, clientY: 55, buttons: 1 })
        fireEvent.keyDown(canvasEl, { key: 'b' })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 15, x2: 105, y1: 15, y2: 105 } } }, polygon])
        // This movement should not be registered.
        fireEvent.mouseMove(canvasEl, { clientX: 70, clientY: 70, buttons: 1 })
        fireEvent.click(canvasEl, { clientX: 70, clientY: 70 })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 15, x2: 105, y1: 15, y2: 105 } } }, polygon])
      })

      it('Do not start creating the polygon when switching from "select" to "polygon" while moving the shape', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
        fireEvent.mouseDown(canvasEl, { clientX: 50, clientY: 50, buttons: 1 })
        fireEvent.mouseMove(canvasEl, { clientX: 60, clientY: 60, buttons: 1 })
        fireEvent.keyDown(canvasEl, { key: 'p' })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 20, x2: 110, y1: 20, y2: 110 } } }, polygon])
        // This polygon should not be created.
        fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })
        fireEvent.click(canvasEl, { clientX: 70, clientY: 70 })
        fireEvent.click(canvasEl, { clientX: 80, clientY: 80 })
        fireEvent.click(canvasEl, { clientX: 60, clientY: 60 })
        expect(wave.args[name]).toMatchObject([{ tag: 'person', shape: { rect: { x1: 20, x2: 110, y1: 20, y2: 110 } } }, polygon])
      })
    })

    describe('Active label switching', () => {
      it('Use "l" to change active tag/label', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.keyDown(canvasEl, { key: 'l' })
        const activeTag = container.querySelector('[class*="active"]')
        expect(activeTag).toHaveTextContent('Object')
      })

      it('Change tag of the selected shape when changing the active tag', async () => {
        const { container } = render(<XImageAnnotator model={model} />)
        await waitForLoad(container)
        const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
        fireEvent.click(canvasEl, { clientX: 50, clientY: 50 })
        fireEvent.keyDown(canvasEl, { key: 'l' })
        expect(wave.args[name]).toMatchObject([{ ...rect, tag: 'object' }, polygon])
      })
    })
  })
})