import React from 'react';
import { cards } from './layout';
import { bond, Card, Rec, S, unpack } from './telesync';


/** Create a card for displaying vector graphics. */
interface State {
  /**
   * The position and dimension of the SVG viewport, in user space.
   * A space-separated list of four numbers: min-x, min-y, width and height.
   * For example, '0 0 400 300'.
   * See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
   */
  view_box: S
  /** The data for this card. */
  data: Rec
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

/** An SVG element. */
interface El {
  /** Defined SVG attributes. */
  d: S
  /** Overridden SVG attributes. */
  o: S
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
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          { view_box, width, height, data } = state,
          els = unpack<El[]>(data).map(({ d, o }, i) => {
            const
              [t, a] = toAttributes({
                ...(d ? JSON.parse(d) : {}),
                ...(o ? JSON.parse(o) : {}),
              })
            switch (t) {
              case 'c': return <circle key={i} {...a} />
              case 'e': return <ellipse key={i} {...a} />
              case 'i': return <image key={i} {...a} />
              case 'l': return <line key={i} {...a} />
              case 'p': return <path key={i} {...a} />
              case 'pg': return <polygon key={i} {...a} />
              case 'pl': return <polyline key={i} {...a} />
              case 'r': return <rect key={i} {...a} />
              case 't': return <text key={i} {...a} />
              default: return <use key={i} {...a} />
            }
          })
        return (
          <div>
            <svg viewBox={view_box} width={width} height={height}>{els}</svg>
          </div>
        )

      }
    return { render, changed }
  })

cards.register('graphics', View)


