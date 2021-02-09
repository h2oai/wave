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
import { bond, Card, F, Rec, S, U, unpack } from './qd'
import { simplify, P } from './simplify'

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

/** An item on the canvas. */
interface CanvasItem {
  /** Type */
  t: S
  /** Points */
  p: F[]
  /** Color */
  c: S
}


export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      fgRef = React.createRef<HTMLCanvasElement>(),
      bgRef = React.createRef<HTMLCanvasElement>(),
      initPenStyle = (g: CanvasRenderingContext2D) => {
        g.lineWidth = 3
        g.lineJoin = 'round'
        g.lineCap = 'round'
      },
      line = (g: CanvasRenderingContext2D, p1: P, p2: P) => {
        g.beginPath()
        g.moveTo(p1.x, p1.y)
        g.lineTo(p2.x, p2.y)
        g.stroke()
      },
      pline = (g: CanvasRenderingContext2D, pts: P[]) => {
        g.beginPath()
        let p = pts[0]
        g.moveTo(p.x, p.y)
        for (let i = 1, n = pts.length; i < n; i++) {
          p = pts[i]
          g.lineTo(p.x, p.y)
        }
        g.stroke()
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
          all: P[][] = [],
          draw = () => {
            const n = pts.length
            if (!n) return
            const p0 = pts[n - 1]
            line(fg, p0, pts.length === 1 ? p0 : pts[n - 2])
          },
          commit = () => {
            if (!pts.length) return
            pts = simplify(pts, 2, true)
            pline(bg, pts)

            all.push(pts)
            pts = []
            fg.clearRect(0, 0, width, height)
          },
          onMouseMove = (e: MouseEvent) => {
            const r = fgEl.getBoundingClientRect()
            pts.push(new P(e.clientX - r.left, e.clientY - r.top))
            draw()
          },
          onMouseUp = () => {
            fgEl.removeEventListener('mousemove', onMouseMove)
            fgEl.removeEventListener('mouseup', onMouseUp)
            fgEl.removeEventListener('mouseout', onMouseUp)
            commit()
          }
        fgEl.addEventListener('mousedown', e => {
          onMouseMove(e)
          fgEl.addEventListener('mousemove', onMouseMove)
          fgEl.addEventListener('mouseup', onMouseUp)
          fgEl.addEventListener('mouseout', onMouseUp)
        })
      },
      render = () => {
        const
          { title, width, height } = state,
          data = unpack<(CanvasItem | null)[]>(state.data)
        console.log(data)
        return (
          <div data-test={name} className={css.card}>
            <div className='s12 w6'>{title}</div>
            <div className={css.layers}>
              <canvas ref={bgRef} className={css.canvas} width={width} height={height} />
              <canvas ref={fgRef} className={css.canvas} width={width} height={height} />
            </div>
          </div>)

      }
    return { init, render, changed }
  })

cards.register('canvas', View)

