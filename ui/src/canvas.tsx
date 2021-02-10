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
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { bond, box, Card, F, qd, Rec, S, to, U, unpack } from './qd'
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
  l: U // linewidth
}

type Line = {
  t: ShapeT.Line
  p: F[] // points
  c: S // color
  l: U // linewidth
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
    let
      activeTool = ShapeT.Curve

    const
      colorB = box('black'),
      lineWidthB = box(3),
      titleCase = (s: S) => s.charAt(0).toUpperCase() + s.slice(1),
      availableColors = ['black', 'red', 'green', 'blue'],
      availableTipSizes: [S, U][] = [['Fine', 3], ['Medium', 5], ['Bold', 7]],
      fgRef = React.createRef<HTMLCanvasElement>(),
      bgRef = React.createRef<HTMLCanvasElement>(),
      shapesB = box<Shape[]>([]),
      initPenStyle = (g: G) => {
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
        const lw = lineWidthB(), hlw = Math.floor(lw / 2)
        g.fillRect(p.x - hlw, p.y - hlw, lw, lw)
      },
      pline = (g: G, pts: P[], color: S, lineWidth: U) => {
        g.strokeStyle = color
        g.lineWidth = lineWidth
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
            switch (activeTool) {
              case ShapeT.Curve:
                {
                  pts.push(new P(x, y))
                  const
                    n = pts.length,
                    p0 = pts[n - 1]
                  line(fg, p0, pts.length === 1 ? p0 : pts[n - 2])

                }
                break
            }
          },
          done = () => {
            if (!pts.length) return
            pts = simplify(pts, 2, true)
            pline(bg, pts, colorB(), lineWidthB())

            sync({ t: ShapeT.Curve, p: marshalPoints(pts), c: colorB(), l: lineWidthB() })

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
                  pline(bg, unmarshalPoints(shape.p), shape.c, shape.l)
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

        to(colorB, c => {
          fg.strokeStyle = c
        })
        to(lineWidthB, lw => {
          fg.lineWidth = lw
        })
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
                onClick: () => { activeTool = ShapeT.Curve },
              },
              {
                key: 'line',
                text: 'Line',
                iconProps: { iconName: 'Line' },
                onClick: () => { activeTool = ShapeT.Line },
              },
              {
                key: 'rect',
                text: 'Rectangle',
                iconProps: { iconName: 'RectangleShape' },
                onClick: () => { activeTool = ShapeT.Line }, // TODO
              },
              {
                key: 'solid_rect',
                text: 'Solid Rectangle',
                iconProps: { iconName: 'RectangleShapeSolid' },
                onClick: () => { activeTool = ShapeT.Line }, // TODO
              },
            ],
          },
        },
        {
          key: 'color',
          iconProps: { iconName: 'Color' },
          subMenuProps: {
            items: availableColors.map(c => ({
              key: c,
              text: titleCase(c),
              iconProps: { iconName: 'CircleFill', style: { color: c } },
              onClick: () => { colorB(c) },
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
          onClick: () => console.log('Download'),
        },
        {
          key: 'clear',
          iconProps: { iconName: 'Clear' },
          onClick: () => console.log('Download'),
        },
      ],
      render = () => {
        const
          { title, width, height } = state,
          data = unpack<ShapeData[]>(state.data),
          shapes: Shape[] = data.map(d => JSON.parse(d.d))

        shapesB(shapes)

        return (
          <div data-test={name} className={css.card}>
            <div className='s12 w6'>{title}</div>
            <div>
              <CommandBar
                items={commands}
                ariaLabel="Use left and right arrow keys to navigate between commands"
              />
            </div>
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

