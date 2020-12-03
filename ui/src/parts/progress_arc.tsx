import * as d3 from 'd3'
import React from 'react'
import { F, S, U } from '../qd'

interface Props {
  thickness: U
  color: S
  value: F
}

export const ProgressArc = ({ thickness, color, value }: Props) => {
  const
    ref = React.useRef<SVGSVGElement>(null),
    [SVGContent, setSVGContent] = React.useState<JSX.Element | null>(null)

  React.useLayoutEffect(() => {
    const
      width = ref.current?.clientWidth!,
      height = ref.current?.clientHeight!,
      size = Math.min(width, height),
      outerRadius = size / 2,
      innerRadius = size / 2 - thickness,
      slot = d3.arc()({
        outerRadius,
        innerRadius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      }),
      bar = d3.arc()({
        outerRadius,
        innerRadius,
        startAngle: 0,
        endAngle: 2 * Math.PI * value,
      })
    setSVGContent((
      <g transform={size === height ? `translate(${(width - (2 * outerRadius)) / 2}, 0)` : `translate(0, ${(height - (2 * outerRadius)) / 2})`}>
        <path d={slot as S} fill={color} fillOpacity={0.15} transform={`translate(${outerRadius},${outerRadius})`} />
        <path d={bar as S} fill={color} transform={`translate(${outerRadius},${outerRadius})`} />
      </g>
    ))
  }, [thickness, color, value])

  return <svg ref={ref} width='100%' height='100%'>{SVGContent}</svg>
}