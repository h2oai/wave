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

import { CommandBar, ICommandBarItemProps } from '@fluentui/react'
import { B, box, ChangeSet, Dict, F, Model, on, Rec, S, to, U } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { P, simplify } from './simplify'
import { px, spectrum } from './theme'
import { bond, wave } from './ui'

declare global {
  interface CanvasRenderingContext2D {
    webkitBackingStorePixelRatio: number
    mozBackingStorePixelRatio: number
    msBackingStorePixelRatio: number
    oBackingStorePixelRatio: number
    backingStorePixelRatio: number
  }
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
      overflow: 'auto',
    },
    layers: {
      position: 'relative',
    }
  })

/**
 * WARNING: Experimental and subject to change.
 * Do not use in production sites!
 *
 * Create a card that displays a drawing canvas (whiteboard).
 * :icon "EditCreate"
 */
interface State {
  /**
   * The title for this card.
   * :t "textbox"
   * :value "Untitled Canvas"
   */
  title: S
  /**
   * Canvas width, in pixels.
   * :t "spinbox"
   * :value 400
   * :min 400
   * :max 2048
   * :step 50
   */
  width: U
  /**
   * Canvas height, in pixels.
   * :t "spinbox"
   * :value 300
   * :min 300
   * :max 1536
   * :step 50
   */
  height: U
  /**
   * The data for this card.
   * :t "record"
   * :value {}
   */
  data: Rec
}

type G = CanvasRenderingContext2D

class Color { constructor(public r: U, public g: U, public b: U, public a: U) { } }

type Canvas = {
  el: HTMLCanvasElement
  g: G
  w: U
  h: U
  r: F
}

type Hitmap = {
  put(index: number): S
  test(x: number, y: number): number | undefined
  clear(): void
}

enum ShapeT { None, Curve, Line, Rect, SolidRect }

type Nothing = {
  t: ShapeT.None
}

type Curve = {
  t: ShapeT.Curve
  p: F[] // points
  c: S // color
  l: U // linewidth
}

type Line = {
  t: ShapeT.Line
  p: F[] // points
  c: S // color
  l: U // linewidth
}

type Rect = {
  t: ShapeT.Rect
  p: F[] // points
  c: S // color
  l: U // linewidth
}

type SolidRect = {
  t: ShapeT.SolidRect
  p: F[] // points
  c: S // color
}

type Shape = Nothing | Curve | Line | Rect | SolidRect


export const
  marshalPoints = (ps: P[]): F[] => {
    const fs = new Array<F>(ps.length * 2)
    let i = 0
    for (const p of ps) {
      fs[i++] = p.x
      fs[i++] = p.y
    }
    return fs
  },
  unmarshalPoints = (fs: F[]): P[] => {
    const ps = new Array<P>(fs.length / 2)
    let i = 0
    for (let j = 0, n = ps.length; j < n; j++) {
      ps[j] = new P(fs[i++], fs[i++])
    }
    return ps
  },

  newCanvas = (w: U, h: U, _alpha: B): Canvas => {
    const
      el = document.createElement('canvas'),
      g = el.getContext('2d', { alpha: true })

    if (!g) throw new Error('failed obtaining canvas context')

    const
      dpr = window.devicePixelRatio || 1,
      bspr = g.webkitBackingStorePixelRatio
        || g.mozBackingStorePixelRatio
        || g.msBackingStorePixelRatio
        || g.oBackingStorePixelRatio
        || g.backingStorePixelRatio
        || 1,
      r = dpr / bspr

    el.style.outline = '1px solid #ccc'
    el.style.position = 'absolute'

    if (dpr !== bspr) {
      el.width = w * r; el.height = h * r
      g.scale(r, r)
      el.style.width = px(w); el.style.height = px(h)
    } else {
      el.width = w; el.height = h
    }

    return { el, g, w, h, r }
  },
  byteToHex = (b: number): S => {
    const hex = b.toString(16)
    return (hex.length === 1) ? `0${hex}` : hex
  },
  hexToColor = (hex: S): Color => {
    const c = parseInt(hex.substring(1), 16)
    return new Color((c >> 16) & 255, (c >> 8) & 255, c & 255, 255)
  },
  hexmap = (() => {
    const m = new Map<U, S>()
    for (let i = 0; i < 256; i++) m.set(i, byteToHex(i))
    return m
  })(),
  newHitmap = (init: U, gx: G, ratio: F): Hitmap => {
    let mru = init
    const
      dict = new Map<number, number>(),
      put = (index: number): S => {
        const c = mru++
        if (mru >= 16581375) mru = 0
        dict.set(c, index)

        const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255
        return `#${hexmap.get(r)}${hexmap.get(g)}${hexmap.get(b)}`
      },
      test = (x: number, y: number): number | undefined => {
        // TODO add radius param and hit-test a larger chunk to improve eraser usability.
        const img = gx.getImageData(x * ratio, y * ratio, 1, 1).data

        if (img[3] === 255) return dict.get((img[0] << 16) + (img[1] << 8) + img[2])

        return undefined
      },
      clear = () => {
        dict.clear()
        mru = init
      }

    return { put, test, clear }
  },
  titleCase = (s: S) => s.charAt(0).toUpperCase() + s.slice(1),
  inks = (() => {
    const inks: Array<{ name: S, color: S }> = []
    for (const k in spectrum) inks.push({ name: titleCase(k), color: spectrum[k] })
    return inks
  })()

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      shapeKeysB = box<S[]>([]),
      shapesB = box<Shape[]>([]),
      shapeB = box(ShapeT.Curve),
      colorB = box('black'),
      lineWidthB = box(3),
      clearB = box<B>(),
      availableTipSizes: [S, U][] = [['Fine', 3], ['Medium', 5], ['Bold', 7]],
      layersRef = React.createRef<HTMLDivElement>(),
      initPenStyle = (g: G) => {
        g.lineJoin = 'round'
        g.lineCap = 'round'
      },
      overlaps = (p1: P, p2: P) => (p1 === p2 || (p1.x === p2.x && p1.y === p2.y)),
      dot = (g: G, p: P) => {
        const lw = lineWidthB(), hlw = Math.floor(lw / 2)
        g.fillRect(p.x - hlw, p.y - hlw, lw, lw)
      },
      line = (g: G, p1: P, p2: P) => {
        if (overlaps(p1, p2)) {
          dot(g, p1)
          return
        }
        g.beginPath()
        g.moveTo(p1.x, p1.y)
        g.lineTo(p2.x, p2.y)
        g.stroke()
      },
      strokeRect = (g: G, p1: P, p2: P) => {
        g.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
      },
      fillRect = (g: G, p1: P, p2: P) => {
        g.fillRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
      },
      pline = (g: G, pts: P[]) => {
        switch (pts.length) {
          case 1:
            dot(g, pts[0])
            return
          case 2:
            line(g, pts[0], pts[1])
            return
          default:
            {
              g.beginPath()
              let p = pts[0]
              g.moveTo(p.x, p.y)
              for (let i = 1, n = pts.length; i < n; i++) {
                p = pts[i]
                g.lineTo(p.x, p.y)
              }
              g.stroke()
            }
        }
      },
      init = () => {
        const layersEl = layersRef.current

        if (!layersEl) {
          window.setTimeout(init, 500)
          return
        }
        const
          { width, height } = state,
          fgC = newCanvas(width, height, true), // foreground
          bgC = newCanvas(width, height, true), // background
          htC = newCanvas(width, height, true), // hit-testing; off-screen
          fgEl = fgC.el,
          fg = fgC.g,
          bg = bgC.g,
          ht = htC.g


        fgEl.style.cursor = 'crosshair'
        layersEl.appendChild(bgC.el)
        layersEl.appendChild(fgEl)

        initPenStyle(fg)
        initPenStyle(bg)

        let
          pts: P[] = []
        const
          hitmap = newHitmap(0, ht, htC.r),
          clear = (g: G) => g.clearRect(0, 0, width, height),
          setAttr = (page: ChangeSet, k: S, v: any) => {
            // TODO actual username
            page.set(`${name} data ${k}`, v)
          },
          syncAttr = (k: S, v: any) => {
            const page = wave.fork()
            setAttr(page, k, v)
            page.push()
          },
          clearAttrs = (ks: S[]) => {
            const page = wave.fork()
            for (const k of ks) setAttr(page, k, null)
            page.push()
          },
          track2 = (p: P) => {
            if (pts.length > 1) {
              pts[1] = p
            } else {
              pts.push(p)
            }
          },
          move = (x: U, y: U) => {
            const p = new P(x, y)
            switch (shapeB()) {
              case ShapeT.Curve:
                {
                  pts.push(p)
                  const
                    n = pts.length,
                    p0 = pts[n - 1]
                  line(fg, p0, pts.length === 1 ? p0 : pts[n - 2])
                }
                break
              case ShapeT.Line:
                {
                  track2(p)
                  if (pts.length < 2) return
                  clear(fg)
                  line(fg, pts[0], pts[1])
                }
                break
              case ShapeT.Rect:
                {
                  track2(p)
                  if (pts.length < 2) return
                  clear(fg)
                  strokeRect(fg, pts[0], pts[1])
                }
                break
              case ShapeT.SolidRect:
                {
                  track2(p)
                  if (pts.length < 2) return
                  clear(fg)
                  fillRect(fg, pts[0], pts[1])
                }
                break
              default: // eraser 
                {
                  const i = hitmap.test(x, y)
                  if (i !== undefined) {
                    const shapeKeys = shapeKeysB()
                    syncAttr(shapeKeys[i], null)
                  }
                }
            }
          },
          marshalShape = (t: ShapeT, c: S, l: U): Shape | undefined => {
            switch (t) {
              case ShapeT.Curve:
                return { t: ShapeT.Curve, p: marshalPoints(simplify(pts, 2, true)), c, l }
              case ShapeT.Line:
                if (pts.length === 2) return { t: ShapeT.Line, p: marshalPoints(pts), c, l }
                return
              case ShapeT.Rect:
                if (pts.length === 2) return { t: ShapeT.Rect, p: marshalPoints(pts), c, l }
                return
              case ShapeT.SolidRect:
                if (pts.length === 2) return { t: ShapeT.SolidRect, p: marshalPoints(pts), c }
                return
            }
          },
          done = () => {
            if (!pts.length) return
            const shape = marshalShape(shapeB(), colorB(), lineWidthB())
            if (shape) {
              draw(shape, 0)
              // TODO won't work if local time is messed up; use additional key (shape count?)
              syncAttr(new Date().toISOString(), JSON.stringify(shape))
            }
            pts = []
            clear(fg)
          },
          draw = (shape: Shape, i: U) => {
            switch (shape.t) {
              case ShapeT.Curve:
              case ShapeT.Line:
                {
                  const ps = unmarshalPoints(shape.p)
                  bg.strokeStyle = shape.c
                  bg.lineWidth = shape.l
                  pline(bg, ps)
                  ht.strokeStyle = hitmap.put(i)
                  ht.lineWidth = shape.l
                  pline(ht, ps)
                }
                break
              case ShapeT.Rect:
                {
                  const ps = unmarshalPoints(shape.p), [p1, p2] = ps
                  bg.strokeStyle = shape.c
                  bg.lineWidth = shape.l
                  strokeRect(bg, p1, p2)
                  ht.strokeStyle = hitmap.put(i)
                  ht.lineWidth = shape.l
                  strokeRect(ht, p1, p2)
                }
                break
              case ShapeT.SolidRect:
                {
                  const ps = unmarshalPoints(shape.p), [p1, p2] = ps
                  bg.fillStyle = shape.c
                  fillRect(bg, p1, p2)
                  ht.fillStyle = hitmap.put(i)
                  fillRect(ht, p1, p2)
                }
                break
            }
          },
          redraw = (shapes: Shape[]) => {
            clear(bg)
            clear(ht)
            shapes.forEach(draw)
          },
          onMouseMove = (e: MouseEvent) => {
            const r = fgEl.getBoundingClientRect()
            move(e.clientX - r.left, e.clientY - r.top)
          },
          onMouseUp = () => {
            fgEl.removeEventListener('mousemove', onMouseMove)
            fgEl.removeEventListener('mouseup', onMouseUp)
            fgEl.removeEventListener('mouseout', onMouseUp)
            done()
          }

        fgEl.addEventListener('mousedown', e => {
          onMouseMove(e)
          fgEl.addEventListener('mousemove', onMouseMove)
          fgEl.addEventListener('mouseup', onMouseUp)
          fgEl.addEventListener('mouseout', onMouseUp)
        })

        to(shapesB, redraw)

        to(colorB, c => {
          fg.strokeStyle = c
          fg.fillStyle = c
        })

        to(lineWidthB, lw => {
          fg.lineWidth = lw
        })

        on(clearB, () => clearAttrs(shapeKeysB()))
      },
      commands: ICommandBarItemProps[] = [
        {
          key: 'tool',
          iconProps: { iconName: 'Edit' },
          subMenuProps: {
            items: [
              {
                key: 'pen',
                text: 'Pen',
                iconProps: { iconName: 'Edit' },
                onClick: () => { shapeB(ShapeT.Curve) },
              },
              {
                key: 'line',
                text: 'Line',
                iconProps: { iconName: 'Line' },
                onClick: () => { shapeB(ShapeT.Line) },
              },
              {
                key: 'rect',
                text: 'Rectangle',
                iconProps: { iconName: 'RectangleShape' },
                onClick: () => { shapeB(ShapeT.Rect) },
              },
              {
                key: 'solid_rect',
                text: 'Solid Rectangle',
                iconProps: { iconName: 'RectangleShapeSolid' },
                onClick: () => { shapeB(ShapeT.SolidRect) },
              },
            ],
          },
        },
        {
          key: 'color',
          iconProps: { iconName: 'Color' },
          subMenuProps: {
            items: inks.map(({ name: text, color }) => ({
              key: color,
              text,
              iconProps: { iconName: 'CircleFill', style: { color } },
              onClick: () => { colorB(color) },
            })),
          },
        },
        {
          key: 'lineWidth',
          iconProps: { iconName: 'LineThickness' },
          subMenuProps: {
            items: availableTipSizes.map(([name, lineWidth]) => ({
              key: name,
              text: name,
              iconProps: { iconName: 'Edit' },
              onClick: () => { lineWidthB(lineWidth) },
            }))
          },
        },
        {
          key: 'erase',
          iconProps: { iconName: 'EraseTool' },
          onClick: () => { shapeB(ShapeT.None) },
        },
        {
          key: 'clear',
          iconProps: { iconName: 'Clear' },
          onClick: () => { clearB(true) },
        },
      ],
      unpack = (d: any): Dict<Shape> => {
        if (!d) return {}
        const shapes: Dict<Shape> = {}
        for (const k in d) shapes[k] = JSON.parse(d[k])
        return shapes
      },
      render = () => {
        const
          shapeDict = unpack(state.data),
          shapeKeys = Object.keys(shapeDict).sort()

        shapeKeysB(shapeKeys)
        shapesB(shapeKeys.map(k => shapeDict[k]))

        return (
          <div data-test={name} className={css.card}>
            <div className='wave-s12 wave-w6'>{state.title}</div>
            <div>
              <CommandBar
                items={commands}
                ariaLabel="Use left and right arrow keys to navigate between commands"
              />
            </div>
            <div ref={layersRef} className={css.layers} />
          </div>
        )
      }
    return { init, render, changed }
  })

cards.register('canvas', View)

