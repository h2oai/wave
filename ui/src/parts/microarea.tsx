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
import React from 'react'
import { F, S } from '../qd'

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

export const MicroArea = ({ value, color, data, zeroValue, curve }: Props) => {
  const
    ref = React.useRef<SVGSVGElement>(null),
    [SVGContent, setSVGContent] = React.useState<JSX.Element | null>(null)

  React.useLayoutEffect(() => {
    let [minY, maxY] = d3.extent<any, any>(data, d => d[value])

    if (zeroValue != null) {
      minY = Math.min(zeroValue, minY)
      maxY = Math.max(zeroValue, maxY)
    }

    const
      scaleX = d3.scaleLinear().domain([0, data.length - 1]).range([0, ref.current?.clientWidth!]),
      scaleY = d3.scaleLinear().domain([minY, maxY]).range([ref.current?.clientHeight!, 2]), // 2px less so that stroke doesn't clip at edges
      fcurve = curves[curve] || d3.curveLinear,
      ln = d3.line<any>()
        // .curve(d3.curveBasis) // XXX add support for this
        .defined(d => d && d[value] != null)
        .x((_, i) => scaleX(i))
        .y(d => scaleY(d[value]))
        .curve(fcurve),
      ar = d3.area<any>()
        // .curve(d3.curveBasis) // XXX add support for this
        .defined(d => d && d[value] != null)
        .x((_, i) => scaleX(i))
        .y0(_ => scaleY(zeroValue == null ? minY : zeroValue))
        .y1(d => scaleY(d[value]))
        .curve(fcurve)
    setSVGContent(
      <>
        <path d={ar(data) as S} fill={color} fillOpacity='0.1' strokeLinejoin='round' strokeLinecap='round' ></path>
        <path d={ln(data) as S} fill='none' stroke={color} strokeWidth='1.5' strokeLinejoin='round' strokeLinecap='round'></path>
      </>
    )
  }, [value, color, data, zeroValue, curve])

  return <svg ref={ref} width='100%' height='100%'>{SVGContent}</svg>
}