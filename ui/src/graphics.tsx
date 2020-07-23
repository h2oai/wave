import * as d3 from 'd3';
import React from 'react';
import { cards } from './layout';
import { bond, Card, Data, Rec, Recs, S, U, unpack } from './telesync';


/** Create a card for displaying vector graphics. */
interface State {
  /**
   * The position and dimension of the SVG viewport, in user space.
   * A space-separated list of four numbers: min-x, min-y, width and height.
   * For example, '0 0 400 300'.
   * See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
   */
  view_box: S
  /** Background layer for rendering static SVG elements. Must be packed to conserve memory. */
  stage?: Recs
  /** Foreground layer for rendering dynamic SVG elements. */
  scene?: Data
  /**
   * The displayed width of the rectangular viewport.
   * (Not the width of its coordinate system.)
   */
  width?: S
  /**
   * The displayed height of the rectangular viewport.
   * (Not the height of its coordinate system.)
   */
  height?: S
}

const
  toAttributes = (d: any): [S, any] => {
    const
      t = d['_t'] || 'u',  // default to '<use/>'
      a: any = {}
    delete d['_t']

    for (const k in d) a[k.replace(/_/g, '-')] = d[k] // xml_attr to xml-attr
    return [t, a]
  },
  extract = (d: any, extra: S[]): any[] => {
    const e: any[] = []
    for (const k of extra) e.push(d[k])
    for (const k of extra) delete d[k]
    return e
  },
  View = bond(({ state, changed }: Card<State>) => {
    type El = { d: S, o: S }

    const
      renderEl = (o: Rec, i: U) => {
        const
          [t, a] = toAttributes(o)
        switch (t) {
          case 'a': {
            const [r1, r2, a1, a2] = extract(a, ['r1', 'r2', 'a1', 'a2'])
            return <path key={i} {...a} d={d3.arc()({
              innerRadius: r1,
              outerRadius: r2,
              startAngle: a1 * Math.PI / 180.0,
              endAngle: a2 * Math.PI / 180.0,
            })} />
          }
          case 'c': return <circle key={i} {...a} />
          case 'e': return <ellipse key={i} {...a} />
          case 'i': return <image key={i} {...a} />
          case 'l': return <line key={i} {...a} />
          case 'p': return <path key={i} {...a} />
          case 'pg': return <polygon key={i} {...a} />
          case 'pl': return <polyline key={i} {...a} />
          case 'r': return <rect key={i} {...a} />
          case 't': {
            const [text] = extract(a, ['text'])
            return <text key={i} {...a} >{text}</text>
          }
          default: return <use key={i} {...a} />
        }
      },
      render = () => {
        const
          { view_box, width, height, stage, scene } = state,
          stageEls = stage ? unpack<Recs>(stage).map(renderEl) : [],
          sceneEls = scene ? unpack<El[]>(scene).map(({ d, o }, i) => renderEl({
            ...(d ? JSON.parse(d) : {}),
            ...(o ? JSON.parse(o) : {}),
          }, i)) : []
        return (
          <div>
            <svg viewBox={view_box} width={width} height={height}>
              <g>{stageEls}</g>
              <g>{sceneEls}</g>
            </svg>
          </div>
        )

      }
    return { render, changed }
  })

cards.register('graphics', View)


