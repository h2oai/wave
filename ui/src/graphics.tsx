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
  /** Foreground layer for rendering dynamic SVG elements. */
  scene: Data
  /** Background layer for rendering static SVG elements. Must be packed to conserve memory. */
  stage?: Recs
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
  toAttributes = (d: any): [S, any, S | undefined] => {
    const
      t = d['_t'] || 'u',  // default to '<use/>'
      a: any = {},
      c = (d['text'] as S) || undefined
    delete d['_t']
    delete d['text']
    for (const k in d) a[k.replace(/_/g, '-')] = d[k] // xml_attr to xml-attr
    return [t, a, c]
  },
  View = bond(({ state, changed }: Card<State>) => {
    type El = { d: S, o: S }

    const
      renderEl = (o: Rec, i: U) => {
        const
          [t, a, c] = toAttributes(o)
        switch (t) {
          case 'c': return <circle key={i} {...a} />
          case 'e': return <ellipse key={i} {...a} />
          case 'i': return <image key={i} {...a} />
          case 'l': return <line key={i} {...a} />
          case 'p': return <path key={i} {...a} />
          case 'pg': return <polygon key={i} {...a} />
          case 'pl': return <polyline key={i} {...a} />
          case 'r': return <rect key={i} {...a} />
          case 't': return <text key={i} {...a} >{c}</text>
          default: return <use key={i} {...a} />
        }
      },
      render = () => {
        const
          { view_box, width, height, stage, scene } = state,
          stageEls = stage ? unpack<Recs>(stage).map(renderEl) : [],
          sceneEls = unpack<El[]>(scene).map(({ d, o }, i) => renderEl({
            ...(d ? JSON.parse(d) : {}),
            ...(o ? JSON.parse(o) : {}),
          }, i))
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


