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

import { Chart } from '@antv/g2'
import { AdjustOption, AnnotationPosition, ArcOption, AxisOption, ChartCfg, CoordinateActions, CoordinateOption, DataMarkerOption, DataRegionOption, GeometryOption, LineOption, RegionOption, ScaleOption, TextOption, TooltipItem } from '@antv/g2/lib/interface'
import { B, Dict, Disposable, F, Model, on, parseI, parseU, Rec, S, unpack, V } from 'h2o-wave'
import React from 'react'
import ReactDOM from 'react-dom'
import { stylesheet } from 'typestyle'
import { Fmt, parseFormat } from './intl'
import { cards, grid } from './layout'
import { cssVarValue, cssVar, formItemWidth, themeB, themesB } from './theme'
import { bond, wave } from './ui'

let
  cat10 = [
    '$gray',
    '$blue',
    '$green',
    '$amber',
    '$tangerine',
    '$purple',
    '$cyan',
    '$mint',
    '$pink',
    '$brown',
  ]


type AnnotationOption = ArcOption | LineOption | TextOption | RegionOption | DataMarkerOption | DataRegionOption

enum SpaceT { CC, DD, TT, CD, DC, TC, CT, TD, DT }

/**
 * Create a specification for a layer of graphical marks such as bars, lines, points for a plot.
 * A plot can contain multiple such layers of marks.
*/
interface Mark {
  /** Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`. */
  coord?: 'rect' | 'cartesian' | 'polar' | 'theta' | 'helix'
  /** Graphical geometry. */
  type?: 'interval' | 'line' | 'path' | 'point' | 'area' | 'polygon' | 'schema' | 'edge' | 'heatmap'
  /** X field or value. */
  x?: V
  /** X base field or value. */
  x0?: V
  /** X bin lower bound field or value. For histograms and box plots. */
  x1?: V
  /** X bin upper bound field or value. For histograms and box plots. */
  x2?: V
  /** X lower quartile. For box plots. */
  x_q1?: V
  /** X median. For box plots. */
  x_q2?: V
  /** X upper quartile. For box plots. */
  x_q3?: V
  /** X axis scale minimum. */
  x_min?: F
  /** X axis scale maximum. */
  x_max?: F
  /** Whether to nice X axis scale ticks. */
  x_nice?: B
  /** X axis scale type. */
  x_scale?: 'linear' | 'cat' | 'category' | 'identity' | 'log' | 'pow' | 'power' | 'time' | 'time-category' | 'quantize' | 'quantile'
  /** X axis title. */
  x_title?: S
  /** Y field or value. */
  y?: V
  /** Y base field or value. */
  y0?: V
  /** Y bin lower bound field or value. For histograms and box plots. */
  y1?: V
  /** Y bin upper bound field or value. For histograms and box plots. */
  y2?: V
  /** Y lower quartile. For box plots. */
  y_q1?: V
  /** Y median. For box plots. */
  y_q2?: V
  /** Y upper quartile. For box plots. */
  y_q3?: V
  /** Y axis scale minimum. */
  y_min?: F
  /** Y axis scale maximum. */
  y_max?: F
  /** Whether to nice Y axis scale ticks. */
  y_nice?: B
  /** Y axis scale type. */
  y_scale?: 'linear' | 'cat' | 'category' | 'identity' | 'log' | 'pow' | 'power' | 'time' | 'time-category' | 'quantize' | 'quantile'
  /** Y axis title. */
  y_title?: S
  /** Mark color field or value. */
  color?: S
  /** Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'` */
  color_range?: S
  /** The unique values in the data (labels or categories or classes) to map colors to, e.g. `['high', 'medium', 'low']`. If this is not provided, the unique values are automatically inferred from the `color` attribute. */
  color_domain?: S[]
  /** Mark shape field or value for `point` mark types. Possible values are 'circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down', 'cross', 'tick', 'plus', 'hyphen', 'line'. */
  shape?: S
  /** Mark shape range for multi-series plots using `point` mark types. A string containing space-separated shapes, e.g. `'circle square diamond'` */
  shape_range?: S
  /** Mark size field or value. */
  size?: V
  /** Mark size range. A string containing space-separated integers, e.g. `'4 30'` */
  size_range?: S
  /** Field to stack marks by, or 'auto' to infer. */
  stack?: S
  /** Field to dodge marks by, or 'auto' to infer. */
  dodge?: S
  /** Curve type for `line` and `area` mark types. */
  curve?: 'none' | 'smooth' | 'step-before' | 'step' | 'step-after'
  /** Mark fill color. */
  fill_color?: S
  /** Mark fill opacity. */
  fill_opacity?: F
  /** Mark stroke color. */
  stroke_color?: S
  /** Mark stroke opacity. */
  stroke_opacity?: F
  /** Mark stroke size. */
  stroke_size?: F
  /** Mark stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25]. */
  stroke_dash?: S
  /** Label field or value. */
  label?: S
  /** Distance between label and mark. */
  label_offset?: F
  /** Horizontal distance between label and mark. */
  label_offset_x?: F
  /** Vertical distance between label and mark. */
  label_offset_y?: F
  /** Label rotation angle, in degrees, or 'none' to disable automatic rotation. The default behavior is 'auto' for automatic rotation. */
  label_rotation?: S
  /** Label position relative to the mark. */
  label_position?: 'top' | 'bottom' | 'middle' | 'left' | 'right'
  /** Strategy to use if labels overlap. */
  label_overlap?: 'hide' | 'overlap' | 'constrain'
  /** Label fill color. */
  label_fill_color?: S
  /** Label fill opacity. */
  label_fill_opacity?: F
  /** Label stroke color. */
  label_stroke_color?: S
  /** Label stroke opacity. */
  label_stroke_opacity?: F
  /** Label stroke size (line width or pen thickness). */
  label_stroke_size?: F
  /** Label font size. */
  label_font_size?: F
  /** Label font weight. */
  label_font_weight?: S
  /** Label line height. */
  label_line_height?: F
  /** Label text alignment. */
  label_align?: 'left' | 'right' | 'center' | 'start' | 'end'
  /** Reference line stroke color. */
  ref_stroke_color?: S
  /** Reference line stroke opacity. */
  ref_stroke_opacity?: F
  /** Reference line stroke size (line width or pen thickness). */
  ref_stroke_size?: F
  /** Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25]. */
  ref_stroke_dash?: S
  /** Defines whether to raise events on interactions with the mark. Defaults to True. */
  interactive?: B
}

/** Extended mark attributes. Not exposed to API. */
interface MarkExt extends Mark {
  /** Field. */
  x_field?: S
  /** Format string. */
  x_format?: Fmt
  /** Field. */
  x0_field?: S
  /** Format string. */
  x0_format?: Fmt
  /** Field. */
  x1_field?: S
  /** Format string. */
  x1_format?: Fmt
  /** Field. */
  x2_field?: S
  /** Format string. */
  x2_format?: Fmt
  /** Field. */
  x_q1_field?: S
  /** Format string. */
  x_q1_format?: Fmt
  /** Field. */
  x_q2_field?: S
  /** Format string. */
  x_q2_format?: Fmt
  /** Field. */
  x_q3_field?: S
  /** Format string. */
  x_q3__format?: Fmt
  /** Field. */
  y_field?: S
  /** Format string. */
  y_format?: Fmt
  /** Field. */
  y0_field?: S
  /** Format string. */
  y0_format?: Fmt
  /** Field. */
  y1_field?: S
  /** Format string. */
  y1_format?: Fmt
  /** Field. */
  y2_field?: S
  /** Format string. */
  y2_format?: Fmt
  /** Field. */
  y_q1_field?: S
  /** Format string. */
  y_q1_format?: Fmt
  /** Field. */
  y_q2_field?: S
  /** Format string. */
  y_q2_format?: Fmt
  /** Field. */
  y_q3_field?: S
  /** Format string. */
  y_q3__format?: Fmt
  /** Field. */
  color_field?: S
  /** Format string. */
  color_format?: Fmt
  /** Field. */
  shape_field?: S
  /** Format string. */
  shape_format?: Fmt
  /** Format string. */
  size_format?: Fmt
  /** Field. */
  size_field?: S
  /** Field. */
  dodge_field?: S
  /** Field. */
  label_field?: S
  /** Format string. */
  label_format?: Fmt
}

/** Create a plot. A plot is composed of one or more graphical mark layers. */
export interface Plot {
  /** The graphical mark layers contained in this plot. */
  marks: Mark[];
}

(async () => {
  const { registerInteraction } = await import('@antv/g2')
  registerInteraction('drag_move', {
    start: [{ trigger: 'plot:mousedown', action: 'scale-translate:start' }],
    processing: [{ trigger: 'plot:mousemove', action: 'scale-translate:translate', throttle: { wait: 100, leading: true, trailing: false } }],
    end: [{ trigger: 'plot:mouseup', action: 'scale-translate:end' }],
  })
  const isWheelDown = (event: any) => {
    event.gEvent.preventDefault()
    return event.gEvent.originalEvent.deltaY > 0
  }
  registerInteraction('scale_zoom', {
    start: [
      {
        trigger: 'plot:mousewheel',
        isEnable: context => isWheelDown(context.event),
        action: 'scale-zoom:zoomOut',
        throttle: { wait: 100, leading: true, trailing: false },
      },
      {
        trigger: 'plot:mousewheel',
        isEnable: context => !isWheelDown(context.event),
        action: 'scale-zoom:zoomIn',
        throttle: { wait: 100, leading: true, trailing: false },
      },
    ],
  })
  registerInteraction('brush', {
    showEnable: [
      { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
      { trigger: 'plot:mouseleave', action: 'cursor:default' },
    ],
    start: [
      {
        trigger: 'plot:mousedown',
        action: ['brush:start', 'rect-mask:start', 'rect-mask:show'],
      },
    ],
    processing: [
      {
        trigger: 'plot:mousemove',
        action: ['rect-mask:resize'],
      },
    ],
    end: [
      {
        trigger: 'plot:mouseup',
        action: ['brush:filter', 'brush:end', 'rect-mask:end', 'rect-mask:hide'],
      },
    ],
    rollback: [{ trigger: 'dblclick', action: ['brush:reset'] }],
  })
})()

// Referrence: https://theme-set.antv.vision/  https://g2.antv.vision/en/docs/api/advanced/register-theme
const getPlotTheme = () => ({
  defaultColor: cssVarValue('$themePrimary'),
  labels: {
    style: {
      fill: cssVarValue('$text'),
    }
  },
  geometries: {
    point: {
      'hollow-circle': {
        default: {
          style: {
            fill: 'transparent'
          }
        }
      }
    },
    interval: {
      rect: {
        selected: {
          style: {
            stroke: cssVarValue('$text'),
          }
        }
      },
    }
  },
  components: {
    annotation: {
      dataMarker: {
        point: {
          style: {
            stroke: cssVarValue('$themePrimary'),
            fill: cssVarValue('$card'),
          }
        }
      },
      line: {
        style: {
          fill: cssVarValue('$neutralPrimaryAlt'),
        }
      },
      region: {
        style: {
          fill: cssVarValue('$themePrimary'),
          fillOpacity: 0.3
        }
      },
    },
    legend: {
      common: {
        itemName: {
          style: {
            fill: cssVarValue('$text'),
          }
        },
        pageNavigator: {
          text: {
            style: {
              fill: cssVarValue('$text'),
            }
          },
          marker: {
            style: {
              fill: cssVarValue('$themePrimary'),
              inactiveFill: cssVarValue('$themePrimary')
            }
          },
        }
      },
      continuous: {
        label: {
          style: {
            fill: cssVarValue('$text'),
          }
        },
        handler: {
          style: {
            fill: cssVarValue('$neutralPrimaryAlt'),
          }
        },
      }
    },
    axis: {
      top: {
        title: {
          style: {
            fill: cssVarValue('$text'),
          }
        }
      },
      right: {
        title: {
          style: {
            fill: cssVarValue('$text'),
          }
        }
      },
      bottom: {
        title: {
          style: {
            fill: cssVarValue('$text'),
          }
        }
      },
      left: {
        title: {
          style: {
            fill: cssVarValue('$text'),
          }
        }
      },
      circle: {
        label: {
          style: {
            fill: cssVarValue('$text'),
          }
        }
      },
      radius: {
        label: {
          style: {
            fill: cssVarValue('$text'),
          }
        }
      },
      common: {
        label: {
          style: {
            fill: cssVarValue('$text'),
          }
        },
        grid: {
          line: {
            style: {
              stroke: cssVarValue('$neutralPrimaryAlt'),
              strokeOpacity: 0.2
            }
          }
        },
        line: {
          style: {
            stroke: cssVarValue('$neutralPrimaryAlt'),
            strokeOpacity: 0.6
          }
        },
        tickLine: {
          style: {
            stroke: cssVarValue('$neutralPrimaryAlt'),
            strokeOpacity: 0.6
          }
        },
      }
    },
  }
})

// TODO not in use
export const
  spaceTypeOf = (ds: any[], marks: Mark[]): SpaceT => spaceTypes[scaleTypeOf(ds, marks, 'x') + scaleTypeOf(ds, marks, 'y')],
  crosshairFor = (t: SpaceT): 'x' | 'y' | 'xy' => {
    switch (t) {
      case SpaceT.CC:
      case SpaceT.DD:
      case SpaceT.TT:
        return 'xy'
      case SpaceT.DC:
      case SpaceT.TC:
      case SpaceT.TD:
        return 'x'
      case SpaceT.CD:
      case SpaceT.CT:
      case SpaceT.DT:
        return 'y'
    }
  }

const
  isF = (x: any): x is number => typeof x === 'number',
  isB = (x: any): x is boolean => typeof x === 'boolean',
  isS = (x: any): x is string => typeof x === 'string',
  split = (s: S) => s.trim().split(/\s+/g),
  parseInts = (s: S) => split(s).map(s => parseInt(s, 10)),
  convertToDates = (ds: any[], f: S) => {
    for (const d of ds) {
      if (d) {
        const s = d[f]
        // Must be ISO string. If just date specified, add time.
        if (s && isS(s)) d[f] = new Date(s.includes('T') ? s : `${s}T00:00:00`)
      }
    }
  },
  convertToPairs = (ds: any[], f0: S, f1: S, f: S) => {
    for (const d of ds) if (d) d[f] = [d[f0], d[f1]]
  },
  convertToSchemaSet = (ds: any[], lo: S, q1: S, q2: S, q3: S, hi: S, f: S) => {
    for (const d of ds) if (d) d[f] = [d[lo], d[q1], d[q2], d[q3], d[hi]]
  },
  xyVariants = ' 0 1 2 _q1 _q2 _q3'.split(' '),
  xyExtra = split('min max nice scale title'),
  makeXYProps = (p: S) => xyVariants.map(s => p + s),
  makeXYExtraProps = (p: S) => xyExtra.map(s => `${p}_${s}`),
  makeFormattables = (xs: S[]) => xs.map(f => ([f, f + '_field', f + '_format'])),
  xProps = makeFormattables(makeXYProps('x')),
  yProps = makeFormattables(makeXYProps('y')),
  xExtraProps = makeXYExtraProps('x'),
  yExtraProps = makeXYExtraProps('y'),
  otherProps = makeFormattables(split('color shape size dodge label')),
  formattables = [...xProps, ...yProps, ...otherProps],
  scaleTypeOf = (ds: any[], marks: Mark[], attr: S): 'c' | 'd' | 't' => {
    const f = attr + '_field', s = attr + '_scale'
    for (const mark of marks) {
      const m = mark as any, field = m[f], scale = m[s]
      if (scale === 'time') return 't'
      if (isS(field)) {
        for (const d of ds) {
          const v = d[field]
          if (isF(v)) return 'c'
          if (isS(v)) return 'd'
        }
      }
    }
    return 'c'
  },
  spaceTypes: Dict<SpaceT> = {
    cc: SpaceT.CC, dd: SpaceT.DD, tt: SpaceT.TT,
    dc: SpaceT.DC, cd: SpaceT.CD,
    tc: SpaceT.TC, ct: SpaceT.CT,
    td: SpaceT.TD, dt: SpaceT.DT,
  },
  dummyDatum: any = {},
  makeFormatFunc = (field: S, render: HandlebarsTemplateDelegate<any>) => (datum: any, value?: any) => {
    const x = datum ? datum[field] : value
    if (x != null) {
      dummyDatum[field] = x
      return render(dummyDatum)
    }
    return ''
  },
  transposeMark = (mark: Mark) => { // WARNING: Can modify marks in-place!
    const m: any = mark
    for (let k = 0; k < xProps.length; k++) {
      const x = xProps[k], y = yProps[k]
      for (let i = 0; i < x.length; i++) {
        const tmp = m[x[i]]
        m[x[i]] = m[y[i]]
        m[y[i]] = tmp
      }
    }
    for (let i = 0; i < xExtraProps.length; i++) {
      const x = xExtraProps[i], y = yExtraProps[i]
      const tmp = m[x]
      m[x] = m[y]
      m[y] = tmp
    }
  },
  refactorMark = (mark: Mark): MarkExt => {
    // if any fields are passed in as format expressions, separate them out into _field and _format
    const m = mark as any
    for (const [plainAttr, fieldAttr, formatAttr] of formattables) {
      const expr = m[plainAttr]
      if (isS(expr)) {
        const fmts = parseFormat(expr)
        if (fmts) {
          const [field, fmt] = fmts
          m[plainAttr] = undefined
          m[fieldAttr] = field
          if (fmt) m[formatAttr] = makeFormatFunc(field, fmt)
        }
      }
    }
    return mark
  },
  refactorData = (ds: any[], marks: MarkExt[]): any[] => {
    ds.forEach((d, idx) => d.idx = idx)
    for (const m of marks) {
      if (m.x_scale === 'time') {
        for (const { x_field, x0_field } of marks) {
          if (isS(x_field)) convertToDates(ds, x_field)
          if (isS(x0_field)) convertToDates(ds, x0_field)
        }
        if (isS(m.x)) m.x = new Date(m.x)
        if (isS(m.x0)) m.x0 = new Date(m.x0)
        break
      }
    }
    for (const m of marks) {
      if (m.y_scale === 'time') {
        for (const { y_field, y0_field } of marks) {
          if (isS(y_field)) convertToDates(ds, y_field)
          if (isS(y0_field)) convertToDates(ds, y0_field)
        }
        if (isS(m.y)) m.y = new Date(m.y)
        if (isS(m.y0)) m.y0 = new Date(m.y0)
        break
      }
    }
    for (const { x_field, x0_field } of marks) {
      if (isS(x_field) && isS(x0_field)) {
        convertToPairs(ds, x0_field, x_field, x_field)
      }
    }
    for (const { y_field, y0_field } of marks) {
      if (isS(y_field) && isS(y0_field)) {
        convertToPairs(ds, y0_field, y_field, y_field)
      }
    }
    for (const mark of marks) {
      const { type, x1_field, x2_field, y_field } = mark
      if (type === 'interval' && isS(x1_field) && isS(x2_field) && isS(y_field)) { // histogram on x
        mark.x_field = x1_field + ' - ' + x2_field
        convertToPairs(ds, x1_field, x2_field, mark.x_field)
      }
    }
    for (const mark of marks) {
      const { type, y1_field, y2_field, x_field } = mark
      if (type === 'interval' && isS(y1_field) && isS(y2_field) && isS(x_field)) { // histogram on y
        mark.y_field = y1_field + ' - ' + y2_field
        convertToPairs(ds, y1_field, y2_field, mark.y_field)
      }
    }
    for (const mark of marks) {
      const { type, x1_field, x_q1_field, x_q2_field, x_q3_field, x2_field, y_field } = mark
      if (type === 'schema' && isS(x1_field) && isS(x_q1_field) && isS(x_q2_field) && isS(x_q3_field) && isS(x2_field) && isS(y_field)) { // box plot on x
        mark.x_field = [x1_field, x_q1_field, x_q2_field, x_q3_field, x2_field].join('-')
        convertToSchemaSet(ds, x1_field, x_q1_field, x_q2_field, x_q3_field, x2_field, mark.x_field)
      }
    }
    for (const mark of marks) {
      const { type, x_field, y1_field, y_q1_field, y_q2_field, y_q3_field, y2_field } = mark
      if (type === 'schema' && isS(y1_field) && isS(y_q1_field) && isS(y_q2_field) && isS(y_q3_field) && isS(y2_field) && isS(x_field)) { // box plot on y
        mark.y_field = [y1_field, y_q1_field, y_q2_field, y_q3_field, y2_field].join('-')
        convertToSchemaSet(ds, y1_field, y_q1_field, y_q2_field, y_q3_field, y2_field, mark.y_field)
      }
    }
    return ds
  },
  makeNote = ({
    x, x0, y, y0, label,
    fill_color, fill_opacity, stroke_color, stroke_opacity, stroke_size, stroke_dash,
    ref_stroke_color, ref_stroke_opacity, ref_stroke_dash, ref_stroke_size,
    label_fill_color, label_fill_opacity, label_stroke_color, label_stroke_opacity, label_stroke_size,
    label_font_size, label_font_weight, label_line_height, label_align,
  }: Mark): AnnotationOption[] => {

    // XXX pass 'start'/'end' if axis is categorical

    const
      labelStyle = makeTextStyle(
        label_fill_color, label_fill_opacity, label_stroke_color, label_stroke_opacity, label_stroke_size,
        label_font_size, label_font_weight, label_line_height, label_align,
      ),
      shapeStyle = makeShapeStyle(fill_color, fill_opacity, stroke_color, stroke_opacity, stroke_size, stroke_dash),
      lineStyle = makeShapeStyle(undefined, undefined, ref_stroke_color, ref_stroke_opacity, ref_stroke_size, ref_stroke_dash)

    if (x != null && y != null) {
      if (x0 != null && y0 != null) {
        const region: DataRegionOption = {
          type: 'region',
          start: [x0, y0] as AnnotationPosition,
          end: [x, y] as AnnotationPosition,
          text: isS(label) ? { content: label, style: labelStyle } : undefined,
          style: shapeStyle,
        }
        return [region]
      } else {
        const marker: DataMarkerOption = {
          type: 'dataMarker',
          position: [x, y] as AnnotationPosition,
          text: isS(label) ? { content: label, style: labelStyle } : null,
          point: { style: shapeStyle },
          line: { style: lineStyle }
        }
        return [marker]
      }
    } else if (x != null) {
      if (x0 != null) {
        const region: DataRegionOption = {
          type: 'region',
          start: [x0, 'min'] as AnnotationPosition,
          end: [x, 'max'] as AnnotationPosition,
          text: isS(label) ? { content: label, style: labelStyle } : null,
          style: shapeStyle,
        }
        return [region]
      } else {
        const line: LineOption = {
          type: 'line',
          start: [x, 'min'] as AnnotationPosition,
          end: [x, 'max'] as AnnotationPosition,
          text: isS(label) ? { content: label, style: labelStyle, position: 'start' } : undefined,
          style: lineStyle,
        }
        return [line]
      }
    } else { // y != null
      if (y0 != null) {
        const region: DataRegionOption = {
          type: 'region',
          start: ['min', y0] as AnnotationPosition,
          end: ['max', y] as AnnotationPosition,
          text: isS(label) ? { content: label, style: labelStyle } : null,
          style: shapeStyle,
        }
        return [region]

      } else {
        const line: LineOption = {
          type: 'line',
          start: ['min', y] as AnnotationPosition,
          end: ['max', y] as AnnotationPosition,
          text: isS(label) ? { content: label, style: labelStyle, position: 'start' } : undefined,
          style: lineStyle,
        }
        return [line]
      }
    }
  },
  makeGeom = ({
    type, x_field, y_field,
    color_field, color_range, color_domain, color,
    shape_field, shape_range, shape,
    size_field, size_range, size,
    stack,
    dodge, dodge_field,
    curve,
    fill_color, fill_opacity, stroke_color, stroke_opacity, stroke_dash, stroke_size,
    label_field, label_format, label_offset, label_offset_x, label_offset_y, label_rotation, label_position, label_overlap,
    label_fill_color, label_fill_opacity, label_stroke_color, label_stroke_opacity, label_stroke_size,
    label_font_size, label_font_weight, label_line_height, label_align
  }: MarkExt): GeometryOption => {
    const o: GeometryOption = {}
    if (isS(type)) o.type = type

    const adjust: AdjustOption[] = []
    // TODO set marginRatio=1 polar coords
    if (isS(dodge_field)) {
      adjust.push({ type: 'dodge', marginRatio: 0, dodgeBy: dodge_field })
    } else if (dodge === 'auto') {
      adjust.push({ type: 'dodge', marginRatio: 0 })
    }
    if (stack === 'auto') adjust.push({ type: 'stack' })
    if (adjust.length) o.adjust = adjust
    if (isS(x_field) && isS(y_field)) o.position = { fields: [x_field, y_field] }
    if (isS(color_field)) {
      const colors = isS(color_range) ? split(color_range).map(cssVarValue) : cat10
      o.color = { fields: [color_field], values: colors }
      if (color_domain && color_domain.length == colors.length) {
        const domain_colors = color_domain.reduce((acc, value, i) => {
          acc[value] = colors[i]
          return acc
        }, {} as Dict<S>)
        o.color.callback = (x: S) => domain_colors[x]
      }
    } else {
      o.color = cssVarValue(isS(color) ? color : '$themePrimary')
    }
    if (isS(shape_field)) {
      if (isS(shape_range)) {
        o.shape = { fields: [shape_field], values: split(shape_range) }
      } else {
        o.shape = { fields: [shape_field] }
      }
    } else if (isS(shape)) {
      o.shape = shape
    }

    // force shape for box plots; other shapes don't make sense here.
    if (type === 'schema') o.shape = 'box'

    if (isS(size_field)) {
      if (isS(size_range)) {
        o.size = { fields: [size_field], values: parseInts(size_range) }
      } else {
        o.size = { fields: [size_field] }
      }
    } else if (isF(size)) {
      o.size = size
    }
    if (isS(label_field)) {
      const styles = makeTextStyle(
        label_fill_color, label_fill_opacity, label_stroke_color, label_stroke_opacity, label_stroke_size,
        label_font_size, label_font_weight, label_line_height, label_align,
      )
      const c: Dict<any> = {}
      if (styles) c.style = styles
      switch (label_overlap) {
        case 'hide': c.layout = { type: 'overlap' }; break
        case 'overlap': c.layout = { type: 'fixedOverlap' }; break
        case 'constrain': c.layout = { type: 'limitInShape' }; break
      }
      if (isF(label_offset)) c.offset = label_offset
      if (isF(label_offset_x)) c.offsetX = label_offset_x
      if (isF(label_offset_y)) c.offsetY = label_offset_y
      if (isS(label_rotation)) {
        const i_label_rotation = parseI(label_rotation)
        if (isNaN(i_label_rotation)) {
          c.autoRotate = label_rotation === 'none' ? false : true
        } else {
          c.rotate = i_label_rotation * Math.PI / 180
        }
      }
      switch (label_position) {
        case 'top': case 'bottom': case 'middle': case 'left': case 'right': c.position = label_position as any
      }

      if (label_format) {
        o.label = {
          fields: [label_field],
          callback: (label) => ({ content: label_format(null, label) })
        }
      } else {
        o.label = { fields: [label_field] }
      }

      if (Object.keys(c).length) o.label.cfg = c
    }
    if (isS(curve)) {
      switch (curve) {
        case 'smooth': o.shape = 'smooth'; break
        case 'step-before': o.shape = 'vh'; break
        case 'step': o.shape = 'hvh'; break
        case 'step-after': o.shape = 'hv'; break
      }
    }
    const style = makeShapeStyle(fill_color, fill_opacity, stroke_color, stroke_opacity, stroke_size, stroke_dash)
    if (style) o.style = style

    return o
  },
  makeShapeStyle = (fill_color?: S, fill_opacity?: F, stroke_color?: S, stroke_opacity?: F, stroke_size?: F, stroke_dash?: S): Dict<any> | undefined => {
    const s: Dict<any> = {}
    if (isS(fill_color)) s.fill = cssVarValue(fill_color)
    if (isF(fill_opacity)) s.fillOpacity = fill_opacity
    if (isS(stroke_color)) s.stroke = cssVarValue(stroke_color)
    if (isF(stroke_opacity)) s.strokeOpacity = stroke_opacity
    if (isF(stroke_size)) s.lineWidth = stroke_size
    if (isS(stroke_dash)) s.lineDash = parseInts(stroke_dash)
    return Object.keys(s).length ? s : undefined
  },
  makeTextStyle = (fill_color?: S, fill_opacity?: F, stroke_color?: S, stroke_opacity?: F, stroke_size?: F, font_size?: F, font_weight?: S, line_height?: F, align?: S): Dict<any> | undefined => {
    const s: Dict<any> = {}
    s.fill = cssVarValue(isS(fill_color) ? fill_color : '$neutralPrimaryAlt')
    if (isF(fill_opacity)) s.fillOpacity = fill_opacity
    if (isS(stroke_color)) s.stroke = cssVarValue(stroke_color)
    if (isF(stroke_opacity)) s.strokeOpacity = stroke_opacity
    if (isF(stroke_size)) s.lineWidth = stroke_size
    if (isF(font_size)) s.fontSize = font_size
    if (isS(font_weight)) {
      const u_font_weight = parseU(font_weight)
      s.fontWeight = isNaN(u_font_weight) ? font_weight : u_font_weight
    }
    if (isF(line_height)) s.lineHeight = line_height
    if (isS(align)) s.textAlign = align
    return Object.keys(s).length ? s : undefined
  },
  makeScales = (marks: MarkExt[]): [Record<S, ScaleOption>, Record<S, AxisOption>] => {
    const
      scales: Record<S, ScaleOption> = {},
      axes: Record<S, AxisOption> = {}

    for (const m of marks) {
      if (m.x_field) {
        const [x_scale, x_axis] = makeScale(m.x_scale, m.x_format, m.x_title, m.x_min, m.x_max, m.x_nice)
        scales[m.x_field] = scales[m.x_field] ? { ...scales[m.x_field], ...x_scale } : x_scale
        if (x_axis) axes[m.x_field] = x_axis
      }
    }

    for (const m of marks) {
      if (m.y_field) {
        const [y_scale, y_axis] = makeScale(m.y_scale, m.y_format, m.y_title, m.y_min, m.y_max, m.y_nice)
        scales[m.y_field] = scales[m.y_field] ? { ...scales[m.y_field], ...y_scale } : y_scale
        if (y_axis) axes[m.y_field] = y_axis
      }
    }

    return [scales, axes]
  },
  fixScaleType = (t: S): S => {
    switch (t) {
      case 'time-category': return 'timeCat'
      case 'power': return 'pow'
    }
    return t
  },
  makeScale = (type?: S, format?: Fmt, title?: S, min?: S | F, max?: S | F, nice?: B): [ScaleOption, AxisOption | null] => {
    const
      scale: ScaleOption = {},
      axis: AxisOption = {
        label: {
          // Bug in G2? `autoHide` should be set to false by default (it is not).
          autoHide: false,
          // Autorotate should be true by default as well, but is not. Same as ^^.
          autoRotate: true,
        },
        // Manually set title to null to avoid the title being automatically displayed in v4.1.49+.
        title: null
      }
    if (isS(type)) scale.type = fixScaleType(type) as any
    if (format) scale.formatter = (v: any) => format(undefined, v)
    if (isS(title)) {
      scale.alias = title
      // HACK ALERT!
      // The scale alias is not rendered by G2 unless the axis title is non-empty.
      axis.title = {}
    }
    if (isF(min)) scale.min = min
    if (isF(max)) scale.max = max
    scale.nice = isB(nice) ? nice : true
    return [scale, axis]
  },
  getCoordType = (marks: Mark[]): S | undefined => {
    for (const { coord } of marks) if (isS(coord)) return coord
    return undefined
  },
  makeCoord = (space: SpaceT, marks: Mark[]): CoordinateOption | undefined => {

    // HACK ALERT!
    // Flip all x* and y* properties if the x-variable is continuous.
    // This is because the underlying lib expects x-variables to be always discrete.
    // So if the coord space is continuous-discrete, flip x/y and set a transpose transform on the coords.

    const
      type = getCoordType(marks) as any,
      transpose = space === SpaceT.CD,
      actions: CoordinateActions[] | undefined = transpose ? [['transpose']] : undefined

    if (transpose) for (const mark of marks) transposeMark(mark)

    return (
      type
        ? actions ? { type, actions } : { type }
        : actions ? { actions } : undefined
    )
  },
  makeMarks = (marks: Mark[]): [GeometryOption[], AnnotationOption[]] => {
    const
      geometries: GeometryOption[] = [],
      annotations: AnnotationOption[] = []

    for (const m of marks) {
      const { x, y } = m
      if (x != null || y != null) {
        annotations.push(...makeNote(m))
      } else {
        geometries.push(makeGeom(m))
      }
    }

    return [geometries, annotations]
  },
  makeChart = (el: HTMLElement, space: SpaceT, marks: Mark[], interactions: S[]): ChartCfg => {
    // WARNING: makeCoord() must be called before other functions.
    const
      coordinate = makeCoord(space, marks), // WARNING: this call may transpose x/y in-place.
      [scales, axes] = makeScales(marks),
      [geometries, annotations] = makeMarks(marks)

    return {
      container: el,
      autoFit: true,
      renderer: 'canvas',
      theme: getPlotTheme(),
      options: {
        animate: false,
        coordinate,
        scales,
        axes,
        geometries,
        annotations,
        // Custom interactions.
        interactions: interactions.map(type => ({ type })),
      }
    }
  }

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
    },
    body: {
      flexGrow: 1,
      display: 'flex',
    },
    plot: {
      userSelect: 'none',
      "-webkit-user-select": 'none',
      $nest: {
        'canvas': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }
    }
  })

/** Create a visualization for display inside a form. */
export interface Visualization {
  /** The plot to be rendered in this visualization. */
  plot: Plot
  /** Data for this visualization. */
  data: Rec
  /** The width of the visualization. Defaults to '100%'. */
  width?: S
  /** The hight of the visualization. Defaults to '300px'. */
  height?: S
  /** An identifying name for this component. */
  name?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** The events to capture on this visualization. One of 'select_marks'. */
  events?: S[]
  /** The interactions to be allowed for this plot. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event. */
  interactions?: S[]
}

const tooltipContainer = document.createElement('div')
tooltipContainer.className = 'g2-tooltip'

const PlotTooltip = ({ items, originalItems }: { items: TooltipItem[], originalItems: any[] }) =>
  <>
    {items.map(({ data, mappingData, color }: TooltipItem) =>
      Object.keys(originalItems[data.idx]).map((itemKey, idx) => {
        const item = originalItems[data.idx][itemKey]
        return <li key={idx} className="g2-tooltip-list-item" data-index={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ backgroundColor: mappingData?.color || color }} className="g2-tooltip-marker" />
          <span style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}>
            <span style={{ marginRight: 16 }}>{itemKey}:</span>
            <span>{(item instanceof Date ? item.toISOString().split('T')[0] : item)}</span>
          </span>
        </li>
      }
      )
    )}
  </>



export const
  XVisualization = ({ model }: { model: Visualization }) => {
    const
      container = React.useRef<HTMLDivElement>(null),
      currentChart = React.useRef<Chart | null>(null),
      currentPlot = React.useRef<Plot | null>(null),
      themeWatchRef = React.useRef<Disposable | null>(null),
      originalDataRef = React.useRef<any[]>([]),
      checkDimensionsPostInit = (w: F, h: F) => { // Safari fix
        const el = container.current
        if (!el) return
        if (!model.width) el.style.minWidth = '100%'
        if (el.clientHeight !== h || el.clientWidth !== w) {
          currentChart.current?.destroy()
          init()
        }
      },
      init = async () => {
        // Map CSS var colors to their hex values.
        cat10 = cat10.map(cssVarValue)
        const el = container.current
        if (!el) return
        // If card does not have specified height/width, it uses content. Since the wrapper is empty, it takes very little space - set to 300px/400px by default.
        if (el.clientHeight < 30) el.style.height = '300px'
        const
          raw_data = unpack<any[]>(model.data),
          raw_plot = unpack<Plot>(model.plot),
          marks = raw_plot.marks.map(refactorMark),
          plot: Plot = { marks },
          space = spaceTypeOf(raw_data, marks),
          data = refactorData(raw_data, plot.marks),
          { Chart } = await import('@antv/g2'),
          chart = plot.marks ? new Chart(makeChart(el, space, plot.marks, model.interactions || [])) : null
        originalDataRef.current = unpack<any[]>(model.data)
        currentPlot.current = plot
        if (chart) {
          chart.tooltip({
            title: ' ', // HACK: Ignore tooltip title computation by G2 since we overwrite it anyway.
            showCrosshairs: true,
            crosshairs: { type: 'xy' },
            domStyles: {
              'g2-tooltip': {
                backgroundColor: cssVar('$card'),
                color: cssVar('$text')
              },
            },
            customContent: (_title, items) => {
              ReactDOM.render(<PlotTooltip items={items} originalItems={originalDataRef.current} />, tooltipContainer)
              return tooltipContainer
            }
          })
          currentChart.current = chart
          chart.data(data)
          // filter out annotation marks
          model.plot.marks.filter(({ x, y }) => x == null && y == null).forEach(({ interactive = true }, idx) =>
            chart.geometries[idx].customInfo({ interactive })
          )
          if (model.events) {
            for (const event of model.events) {
              switch (event) {
                case 'select_marks': {
                  chart.interaction('element-single-selected')
                  chart.on('element:statechange', (ev: any) => {
                    const e = ev.gEvent.originalEvent
                    if (e.stateStatus && e.state === 'selected') {
                      if (model.name && e.element.geometry.customOption.interactive) wave.emit(model.name, event, [e.element?.data])
                    }
                  })
                }
              }
            }
          }
          chart.render()
          // React fires mount lifecycle hook before Safari finishes Layout phase so we need recheck if original card dimensions are the
          // same as after Layout phase. If not, rerender the plot again.
          setTimeout(() => checkDimensionsPostInit(el.clientWidth, el.clientHeight), 300)
          themeWatchRef.current = on(themeB, themesB, () => {
            cat10 = cat10.map(cssVarValue)
            const [geometries, annotations] = makeMarks(marks)
            chart.updateOptions({ geometries, annotations })
            chart.theme(getPlotTheme())
            chart.render(true)
          })
        }
      }

    React.useEffect(() => {
      init()
      return () => themeWatchRef.current?.dispose()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    React.useEffect(() => {
      const el = container.current
      if (!el || !currentChart.current || !currentPlot.current) return
      const
        raw_data = unpack<any[]>(model.data),
        data = refactorData(raw_data, currentPlot.current.marks)
      originalDataRef.current = unpack<any[]>(model.data)
      currentChart.current.changeData(data)
    }, [currentChart, currentPlot, model])

    const
      { width = 'auto', height = 'auto', name } = model,
      style: React.CSSProperties = (width === 'auto' && height === 'auto')
        ? { flexGrow: 1, width: 400 }
        : { width: formItemWidth(width), height }
    return <div data-test={name} style={style} className={css.plot} ref={container} />
  }

/** Create a card displaying a plot. */
interface State {
  /** The title for this card. */
  title: S
  /** Data for this card. */
  data: Rec
  /** The plot to be displayed in this card. */
  plot: Plot
  /** The events to capture on this card. One of 'select_marks'. */
  events?: S[]
  /** The interactions to be allowed for this card. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event. */
  interactions?: S[]
}

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        const { title = 'Untitled', plot, data, events, interactions } = state
        return (
          <div className={css.card}>
            <div className='wave-s12 wave-w6'>{title}</div>
            <div className={css.body}>
              <XVisualization model={{ name, plot, data, events, interactions }} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('plot', View)