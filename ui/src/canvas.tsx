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

import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { bond, box, Card, F, to, qd, Rec, S, U, unpack } from './qd'
import { P, simplify } from './simplify'

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
    },
    canvas: {
      position: 'absolute',
      cursor: 'crosshair',
    }
  })

/** 
 * Create a card that displays a user-editable drawing canvas.
 */
interface State {
  /** The title for this card. */
  title: S
  /** Canvas width, in pixels */
  width: U
  /** Canvas height, in pixels. */
  height: U
  /** The data for this card. */
  data: Rec
}

enum ShapeT { Curve, Line }

type Curve = {
  t: ShapeT.Curve
  p: F[] // points
  c: S // color
}

type Line = {
  t: ShapeT.Line
  p: F[] // points
  c: S // color
}

type Shape = Curve | Line


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
  }

type G = CanvasRenderingContext2D

type ShapeData = { d: S }

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      tip = 3, htip = Math.floor(tip / 2)

    const
      fgRef = React.createRef<HTMLCanvasElement>(),
      bgRef = React.createRef<HTMLCanvasElement>(),
      shapesB = box<Shape[]>([]),
      initPenStyle = (g: G) => {
        g.lineWidth = tip
        g.lineJoin = 'round'
        g.lineCap = 'round'
      },
      line = (g: G, p1: P, p2: P) => {
        if (p1 === p2 || (p1.x === p2.x && p1.y === p2.y)) {
          dot(g, p1)
          return
        }
        g.beginPath()
        g.moveTo(p1.x, p1.y)
        g.lineTo(p2.x, p2.y)
        g.stroke()
      },
      dot = (g: G, p: P) => {
        g.fillRect(p.x - htip, p.y - htip, tip, tip)
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
        const
          fgEl = fgRef.current,
          bgEl = bgRef.current

        if (!fgEl || !bgEl) {
          window.setTimeout(init, 500)
          return
        }

        const
          fg = fgEl.getContext('2d'),
          bg = bgEl.getContext('2d')

        if (!fg || !bg) return

        initPenStyle(fg)
        initPenStyle(bg)

        let
          pts: P[] = []
        const
          { width, height } = state,
          clear = (g: G) => g.clearRect(0, 0, width, height),
          move = (x: U, y: U) => {
            pts.push(new P(x, y))
            const
              n = pts.length,
              p0 = pts[n - 1]
            line(fg, p0, pts.length === 1 ? p0 : pts[n - 2])
          },
          done = () => {
            if (!pts.length) return
            pts = simplify(pts, 2, true)
            pline(bg, pts)

            sync({ t: ShapeT.Curve, p: marshalPoints(pts), c: '#000' }) // TODO color

            pts = []
            clear(fg)
          },
          sync = (shape: Shape) => {
            const page = qd.page()
            // TODO actual username
            // TODO won't work if local time is messed up; use additional key (shape count?)
            page.set(`${name} data ${(new Date().toISOString())}`, [JSON.stringify(shape)])
            page.sync()
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
          },
          redraw = (shapes: Shape[]) => {
            clear(bg)
            for (const shape of shapes) {
              switch (shape.t) {
                case ShapeT.Curve:
                  pline(bg, unmarshalPoints(shape.p))
                  break
              }
            }
          }
        fgEl.addEventListener('mousedown', e => {
          onMouseMove(e)
          fgEl.addEventListener('mousemove', onMouseMove)
          fgEl.addEventListener('mouseup', onMouseUp)
          fgEl.addEventListener('mouseout', onMouseUp)
        })

        to(shapesB, redraw)
      },
      render = () => {
        const
          { title, width, height } = state,
          data = unpack<ShapeData[]>(state.data),
          shapes: Shape[] = data.map(d => JSON.parse(d.d))

        shapesB(shapes)

        return (
          <div data-test={name} className={css.card}>
            <div className='s12 w6'>{title}</div>
            <div className={css.layers}>
              <canvas ref={bgRef} className={css.canvas} width={width} height={height} />
              <canvas ref={fgRef} className={css.canvas} width={width} height={height} />
            </div>
          </div>
        )

      }
    return { init, render, changed }
  })

cards.register('canvas', View)

