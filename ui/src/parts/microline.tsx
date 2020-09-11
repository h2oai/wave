import * as d3 from 'd3'
import React from 'react'
import { F, S, U } from '../qd'

interface Props {
  width: U
  height: U
  data: any[]
  zeroValue?: F
  value: S
  color: S
  curve: 'linear' | 'smooth' | 'step' | 'step-after' | 'step-before'
}

const
  curves: any = {
    linear: d3.curveLinear,
    smooth: d3.curveCatmullRom,
    step: d3.curveStep,
    'step-after': d3.curveStepAfter,
    'step-before': d3.curveStepBefore,
  }

export class MicroArea extends React.Component<Props> {
  ref = React.createRef<SVGSVGElement>()
  render() {
    const { width, height, value, color, data, zeroValue, curve } = this.props

    let [minY, maxY] = d3.extent<any, any>(data, d => d[value])

    if (zeroValue != null) {
      if (minY > zeroValue) {
        minY = zeroValue
      } else if (maxY < zeroValue) {
        maxY = zeroValue
      }
    }

    const
      scaleX = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]),
      scaleY = d3.scaleLinear().domain([minY, maxY]).range([height, 2]), // 2px less so that stroke doesn't clip at edges
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

    return (
      <svg ref={this.ref} width={width} height={height}>
        <path d={ar(data) as S} fill={color} fillOpacity='0.1' strokeLinejoin='round' strokeLinecap='round'></path>
        <path d={ln(data) as S} fill='none' stroke={color} strokeWidth='1.5' strokeLinejoin='round' strokeLinecap='round'></path>
      </svg>
    )
  }
}
