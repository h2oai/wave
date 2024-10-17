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

import * as d3 from 'd3'
import { Data, Dict, F, Model, Rec, Recs, S, U, unpack } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { bond } from './ui'


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
  /** Background image data, base64-encoded. */
  image?: S
  /** 
   * The path or URL or data URL of the background image, 
   * e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`. 
   */
  image_path?: S
  /** 
   * The background image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. 
   * Required only if `image` is set. 
   */
  image_type?: S
  /** An optional identifying name for this Card. */
  name?: S
}

const
  toAttributes = (d: any): [S, any] => {
    const
      t = d['_t'] || 'u',  // default to '<use/>'
      a: any = {}
    delete d['_t']

    for (const k in d) a[k.replace(/_./g, x => x.substring(1).toUpperCase())] = d[k] // xml_attr to xmlAttr
    return [t, a]
  },
  extract = (d: any, extra: S[]): any[] => {
    const e: any[] = []
    for (const k of extra) e.push(d[k])
    for (const k of extra) delete d[k]
    return e
  },
  nums = (s: S): F[] => s.split(/\s/g).map(x => +x),
  zip = <T1, T2, T3>(a: T1[], b: T2[], f: (a: T1, b: T2) => T3): T3[] => {
    const
      n = a.length,
      c: T3[] = new Array(n)
    for (let i = 0; i < n; i++) c[i] = f(a[i], b[i])
    return c
  },
  zip3 = <T1, T2, T3, T4>(a: T1[], b: T2[], c: T3[], f: (a: T1, b: T2, c: T3) => T4): T4[] => {
    const
      n = a.length,
      d: T4[] = new Array(n)
    for (let i = 0; i < n; i++) d[i] = f(a[i], b[i], c[i])
    return d
  },
  curves: Dict<d3.CurveFactory> = {
    basis: d3.curveBasis,
    'basis-closed': d3.curveBasisClosed,
    'basis-open': d3.curveBasisOpen,
    cardinal: d3.curveCardinal,
    'cardinal-closed': d3.curveCardinalClosed,
    'cardinal-open': d3.curveCardinalOpen,
    smooth: d3.curveCatmullRom,
    'smooth-closed': d3.curveCatmullRomClosed,
    'smooth-open': d3.curveCatmullRomOpen,
    linear: d3.curveLinear,
    'linear-closed': d3.curveLinearClosed,
    'monotone-x': d3.curveMonotoneX,
    'monotone-y': d3.curveMonotoneY,
    natural: d3.curveNatural,
    step: d3.curveStep,
    'step-after': d3.curveStepAfter,
    'step-before': d3.curveStepBefore,
  },
  ret0 = () => 0,
  get0 = (d: any) => d[0],
  get1 = (d: any) => d[1],
  get2 = (d: any) => d[2]

const
  css = stylesheet({
    card: {
      position: 'absolute',
      left: grid.gap, top: grid.gap, right: grid.gap, bottom: grid.gap,
    },
  })
export const
  View = bond(({ name, state, changed }: Model<State>) => {
    type El = { d: S, o: S }

    const
      renderEl = (o: Rec, i: U) => {
        const
          [t, a] = toAttributes(o)
        switch (t) {
          case 'a': {
            const
              [r1, r2, a1, a2] = extract(a, ['r1', 'r2', 'a1', 'a2']),
              d = d3.arc()({
                innerRadius: r1,
                outerRadius: r2,
                startAngle: a1 * Math.PI / 180.0,
                endAngle: a2 * Math.PI / 180.0,
              })
            return <path key={i} {...a} d={d} />
          }
          case 'c': return <circle key={i} {...a} />
          case 'e': return <ellipse key={i} {...a} />
          case 'i': return <image key={i} {...a} />
          case 'l': return <line key={i} {...a} />
          case 'p': return <path key={i} {...a} />
          case 'pg': return <polygon key={i} {...a} />
          case 'pl': return <polyline key={i} {...a} />
          case 'r': return <rect key={i} {...a} />
          case 's': {
            const
              [x, y, x0, y0, curve, radial] = extract(a, ['x', 'y', 'x0', 'y0', 'curve', 'radial']),
              c = curves[curve] || d3.curveLinear,
              d = radial
                ? y0 === ''
                  ? d3.radialArea().angle(get0).outerRadius(get1).innerRadius(ret0).curve(c)(zip(nums(x), nums(y), (x, y) => [x, y]) as any)
                  : y0
                    ? d3.radialArea().angle(get0).outerRadius(get2).innerRadius(get1).curve(c)(zip3(nums(x), nums(y0), nums(y), (x, y0, y) => [x, y0, y]) as any)
                    : x0 === ''
                      ? d3.radialArea().endAngle(get0).startAngle(ret0).radius(get1).curve(c)(zip(nums(x), nums(y), (x, y) => [x, y]) as any)
                      : x0
                        ? d3.radialArea().endAngle(get1).startAngle(get0).radius(get2).curve(c)(zip3(nums(x0), nums(x), nums(y), (x0, x, y) => [x0, x, y]) as any)
                        : d3.radialLine().curve(c)(zip(nums(x), nums(y), (x, y) => [x, y]))
                : y0 === ''
                  ? d3.area().x(get0).y1(get1).y0(ret0).curve(c)(zip(nums(x), nums(y), (x, y) => [x, y]) as any)
                  : y0
                    ? d3.area().x(get0).y1(get2).y0(get1).curve(c)(zip3(nums(x), nums(y0), nums(y), (x, y0, y) => [x, y0, y]) as any)
                    : x0 === ''
                      ? d3.area().x1(get0).x0(ret0).y(get1).curve(c)(zip(nums(x), nums(y), (x, y) => [x, y]) as any)
                      : x0
                        ? d3.area().x1(get1).x0(get0).y(get2).curve(c)(zip3(nums(x0), nums(x), nums(y), (x0, x, y) => [x0, x, y]) as any)
                        : d3.line().curve(c)(zip(nums(x), nums(y), (x, y) => [x, y]))
            return <path key={i} {...a} d={d} />
          }
          case 't': {
            const [text] = extract(a, ['text'])
            return <text key={i} {...a} >{text}</text>
          }
          default: return <use key={i} {...a} />
        }
      },
      render = () => {
        const
          { view_box, width, height, stage, scene, image_type, image, image_path } = state,
          stageEls = stage ? unpack<Recs>(stage).map(renderEl) : [],
          sceneEls = scene ? unpack<El[]>(scene).map(({ d, o }, i) => renderEl({
            ...(d ? JSON.parse(d) : {}),
            ...(o ? JSON.parse(o) : {}),
          }, i)) : [],
          backgroundImageSrc = image_path
            ? 'url(' + image_path + ')'
            : image ? `url(data:image/${image_type};base64,${image})`
              : undefined

        return (
          <div data-test={name} className={css.card} style={backgroundImageSrc ? {
            backgroundImage: backgroundImageSrc,
            backgroundSize: 'cover',
          } : {}}>
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

