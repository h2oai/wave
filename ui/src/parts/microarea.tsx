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

/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import * as d3 from 'd3'
import { F, S } from '../core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { debounce } from '../ui'

interface Props {
  data: any[]
  zeroValue?: F
  value: S
  color: S
  curve: 'linear' | 'smooth' | 'step' | 'step-after' | 'step-before'
}

const curves: Record<S, d3.CurveFactory> = {
  linear: d3.curveLinear,
  smooth: d3.curveCatmullRom,
  step: d3.curveStep,
  'step-after': d3.curveStepAfter,
  'step-before': d3.curveStepBefore,
}

const css = stylesheet({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    flexGrow: 1,
    minHeight: 32,
  }
})

export const MicroArea = ({ value, color, data, zeroValue, curve }: Props) => {
  const
    ref = React.useRef<HTMLDivElement>(null),
    [minY, maxY] = React.useMemo(() => {
      let [minY, maxY] = d3.extent<any, any>(data, d => d[value])

      if (zeroValue != null) {
        minY = Math.min(zeroValue, minY)
        maxY = Math.max(zeroValue, maxY)
      }
      return [minY, maxY]
    }, [data, value, zeroValue]),
    [content, setContent] = React.useState<JSX.Element | null>(null),
    renderViz = React.useCallback(() => {
      if (!ref.current) return

      const { width, height } = ref.current.getBoundingClientRect()
      if (!height) {
        // Safari has weird event loop meaning this React code can run before Layout phase is finished (flex items not positioned yet).
        setTimeout(renderViz, 300)
        return
      }
      const
        scaleX = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]),
        scaleY = d3.scaleLinear().domain([minY, maxY]).range([height, 2]),
        fcurve = curves[curve] || d3.curveLinear,

        ln = d3.line<any>()
          // .curve(d3.curveBasis) // XXX add support for this
          .defined(d => d && d[value] != null)
          .x((_, i) => scaleX(i)!)
          .y(d => scaleY(d[value])!)
          .curve(fcurve),
        ar = d3.area<any>()
          // .curve(d3.curveBasis) // XXX add support for this
          .defined(d => d && d[value] != null)
          .x((_, i) => scaleX(i)!)
          .y0(_ => scaleY(zeroValue == null ? minY : zeroValue)!)
          .y1(d => scaleY(d[value])!)
          .curve(fcurve)

      setContent(
        <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <path d={ar(data) as S} fill={color} fillOpacity='0.1' strokeLinejoin='round' strokeLinecap='round'></path>
          <path d={ln(data) as S} fill='none' stroke={color} strokeWidth='1.5' strokeLinejoin='round' strokeLinecap='round'></path>
        </svg>
      )
    }, [color, curve, data, maxY, minY, value, zeroValue]),
    onResize = debounce(1000, renderViz)

  React.useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useLayoutEffect(renderViz, [value, color, data, zeroValue, curve, minY, maxY, renderViz])

  return <div ref={ref} className={css.container}>{content}</div>
}