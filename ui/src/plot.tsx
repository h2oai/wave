import { Chart, registerInteraction } from '@antv/g2';
import { AdjustOption, AnnotationPosition, ArcOption, CoordinateOption, DataMarkerOption, DataRegionOption, GeometryOption, LineOption, RegionOption, ScaleOption, TextOption } from '@antv/g2/lib/interface';
import React from 'react';
import { stylesheet } from 'typestyle';
import { cards } from './layout';
import { Fmt, parseFormat } from './intl';
import { B, bond, Card, unpack, Dict, F, parseI, parseU, Rec, S, V } from './telesync';
import { getTheme } from './theme';

const
  theme = getTheme(),
  hues = theme.colors,
  cat10 = [
    hues.gray,
    hues.blue,
    hues.green,
    hues.amber,
    hues.tangerine,
    hues.purple,
    hues.cyan,
    hues.mint,
    hues.pink,
    hues.brown,
  ]
type AnnotationOption = ArcOption | LineOption | TextOption | RegionOption | DataMarkerOption | DataRegionOption

enum SpaceT { CC, DD, TT, CD, DC, TC, CT, TD, DT }

interface Mark {
  coord?: S
  mark?: S // XXX annotate
  x?: V
  x0?: V
  x1?: V
  x2?: V
  x_min?: F
  x_max?: F
  x_nice?: B
  x_scale?: S // XXX annotate
  x_title?: S
  y?: V
  y0?: V
  y1?: V
  y2?: V
  y_min?: F
  y_max?: F
  y_nice?: B
  y_scale?: S // XXX annotate
  y_title?: S
  color?: S
  color_range?: S
  shape?: S
  shape_range?: S
  size?: V
  size_range?: S
  stack?: S
  dodge?: S
  curve?: 'none' | 'smooth' | 'step-before' | 'step' | 'step-after'
  fill_color?: S
  fill_opacity?: F
  stroke_color?: S
  stroke_opacity?: F
  stroke_size?: F
  stroke_dash?: S
  label?: S
  label_offset?: F
  label_offset_x?: F
  label_offset_y?: F
  label_rotation?: F
  label_position?: S  // 'top' | 'bottom' | 'middle' | 'left' | 'right';
  label_overlap?: S // 'hide' | 'overlap' | 'constrain'
  label_fill_color?: S
  label_fill_opacity?: F
  label_stroke_color?: S
  label_stroke_opacity?: F
  label_stroke_size?: F
  label_font_size?: F
  label_font_weight?: S
  label_line_height?: F
  label_align?: S
  ref_stroke_color?: S
  ref_stroke_opacity?: F
  ref_stroke_size?: F
  ref_stroke_dash?: S
}

interface MarkExt extends Mark {
  x_field?: S
  x_format?: Fmt
  x0_field?: S
  x0_format?: Fmt
  x1_field?: S
  x1_format?: Fmt
  x2_field?: S
  x2_format?: Fmt
  y_field?: S
  y_format?: Fmt
  y0_field?: S
  y0_format?: Fmt
  y1_field?: S
  y1_format?: Fmt
  y2_field?: S
  y2_format?: Fmt
  color_field?: S
  color_format?: Fmt
  shape_field?: S
  shape_format?: Fmt
  size_format?: Fmt
  size_field?: S
  dodge_field?: S
  label_field?: S
  label_format?: Fmt
}

export interface Vis {
  marks: Mark[]
}

registerInteraction('drag-move', {
  start: [{ trigger: 'plot:mousedown', action: 'scale-translate:start' }],
  processing: [{ trigger: 'plot:mousemove', action: 'scale-translate:translate', throttle: { wait: 100, leading: true, trailing: false } }],
  end: [{ trigger: 'plot:mouseup', action: 'scale-translate:end' }],
});

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
        if (s && isS(s)) d[f] = new Date(s) // must be ISO string
      }
    }
  },
  convertToPairs = (ds: any[], f0: S, f1: S, f: S) => {
    for (const d of ds) if (d) d[f] = [d[f0], d[f1]]
  },
  formattables = split('x x0 x1 x2 y y0 y1 y2 color shape size dodge label').map(f => ([f, f + '_field', f + '_format'])),
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
      const { mark: type, x1_field, x2_field, y_field } = mark
      if (type === 'interval' && isS(x1_field) && isS(x2_field) && isS(y_field)) { // histogram on x
        mark.x_field = x1_field + ' - ' + x2_field
        convertToPairs(ds, x1_field, x2_field, mark.x_field)
      }
    }
    for (const mark of marks) {
      const { mark: type, y1_field, y2_field, x_field } = mark
      if (type === 'interval' && isS(y1_field) && isS(y2_field) && isS(x_field)) { // histogram on y
        mark.y_field = y1_field + ' - ' + y2_field
        convertToPairs(ds, y1_field, y2_field, mark.y_field)
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
    mark: type, x_field, y_field,
    color_field, color_range, color,
    shape_field, shape_range, shape,
    size_field, size_range, size,
    stack,
    dodge, dodge_field,
    curve,
    fill_color, fill_opacity, stroke_color, stroke_opacity, stroke_dash, stroke_size,
    label_field, label_format, label_offset, label_offset_x, label_offset_y, label_rotation, label_position, label_overlap,
    label_fill_color, label_fill_opacity, label_stroke_color, label_stroke_opacity, label_stroke_size,
    label_font_size, label_font_weight, label_line_height, label_align,
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
      o.color = { fields: [color_field], values: isS(color_range) ? split(color_range) : cat10 }
    } else {
      o.color = isS(color) ? color : theme.colors.text
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
    if (isS(fill_color)) s.fill = fill_color
    if (isF(fill_opacity)) s.fillOpacity = fill_opacity
    if (isS(stroke_color)) s.stroke = stroke_color
    if (isF(stroke_opacity)) s.strokeOpacity = stroke_opacity
    if (isF(stroke_size)) s.lineWidth = stroke_size
    if (isS(stroke_dash)) s.lineDash = parseInts(stroke_dash)
    return Object.keys(s).length ? s : undefined
  },
  makeTextStyle = (fill_color?: S, fill_opacity?: F, stroke_color?: S, stroke_opacity?: F, stroke_size?: F, font_size?: F, font_weight?: S, line_height?: F, align?: S): Dict<any> | undefined => {
    const s: Dict<any> = {}
    if (isS(fill_color)) s.fill = fill_color
    if (isF(fill_opacity)) s.fillOpacity = fill_opacity
    if (isS(stroke_color)) s.stroke = stroke_color
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
  makeScales = (marks: MarkExt[]): Record<S, ScaleOption> => {
    const o: Record<S, ScaleOption> = {}

    for (const m of marks) {
      if (m.x_field) {
        o[m.x_field] = makeScale(m.x_scale, m.x_format, m.x_title, m.x_min, m.x_max, m.x_nice)
        break
      }
    }

    for (const m of marks) {
      if (m.y_field) {
        o[m.y_field] = makeScale(m.y_scale, m.y_format, m.y_title, m.y_min, m.y_max, m.y_nice)
        break
      }
    }

    return o
  },
  makeScale = (typ: S | undefined, format: Fmt | undefined, title: S | undefined, min: S | F | undefined, max: S | F | undefined, nice: B | undefined): ScaleOption => {
    const o: ScaleOption = {}
    if (isS(typ)) o.type = typ as any
    if (format) o.formatter = (v: any) => format(undefined, v)
    if (isS(title)) o.alias = title
    if (isF(min)) o.min = min
    if (isF(max)) o.max = max
    o.nice = isB(nice) ? nice : true
    return o
  },
  makeCoord = (marks: Mark[]): CoordinateOption | undefined => {
    for (const { coord } of marks) if (isS(coord)) return { type: coord as any }
    return undefined
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
  makeChart = (el: HTMLElement, marks: Mark[]): Chart | null => {
    if (!marks) return null
    const [geometries, annotations] = makeMarks(marks)

    return new Chart({
      container: el,
      autoFit: true,
      options: {
        animate: false,
        coordinate: makeCoord(marks),
        scales: makeScales(marks),
        geometries,
        annotations,
        interactions: [
          { type: 'view-zoom' },
          { type: 'drag-move' }, // custom
        ],
        tooltip: {
          showCrosshairs: true,
          crosshairs: { type: 'xy' }
          // XXX pass container element
        }
      }
    })
  }

const
  css = stylesheet({
    card: {
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    plot: {
      position: 'absolute',
      left: 0, top: 30, right: 0, bottom: 0,
    },
  })

interface State {
  title: S
  data: Rec
  vis: Vis
}

const defaults: Partial<State> = {
  title: 'Untitled',
}

const
  View = bond(({ state, changed }: Card<State>) => {
    let
      currentChart: Chart | null = null,
      currentVis: Vis | null = null
    const
      container = React.createRef<HTMLDivElement>(),
      init = () => {
        const el = container.current
        if (!el) return
        const
          s = state,
          raw_data = unpack(s.data) as any[],
          raw_vis = unpack(s.vis) as Vis,
          marks = raw_vis.marks.map(refactorMark),
          vis: Vis = { marks: marks },
          // spaceT = spaceTypeOf(raw_marks, marks),
          data = refactorData(raw_data, vis.marks),
          chart = makeChart(el, vis.marks)
        currentVis = vis
        if (chart) {
          currentChart = chart
          chart.data(data)
          chart.render()
        }
      },
      update = () => {
        const el = container.current
        if (!el || !currentChart || !currentVis) return
        const
          s = state,
          raw_data = unpack(s.data) as any[],
          data = refactorData(raw_data, currentVis.marks)
        currentChart.changeData(data)
      },
      render = () => {
        const
          s = { ...defaults, ...state } as State
        return (
          <div className={css.card}>
            <div className={css.title}>{s.title}</div>
            <div className={css.plot} ref={container} />
          </div>
        )
      }
    return { init, update, render, changed }
  })

cards.register('plot', View)

