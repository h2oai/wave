import * as d3 from 'd3'
import React from 'react'
import { F, S } from '../qd'

interface Props {
  data: any[]
  zeroValue?: F
  category?: S
  value: S
  color: S
}

export const MicroBars = ({ value, category = 'x', color, data, zeroValue }: Props) => {
  const
    ref = React.useRef<SVGSVGElement | null>(null),
    [rects, setRects] = React.useState<JSX.Element[] | null>(null)

  React.useLayoutEffect(() => {
    let [minY, maxY] = d3.extent<any, any>(data, d => d[value])

    if (zeroValue != null) {
      minY = Math.min(zeroValue, minY)
      maxY = Math.max(zeroValue, maxY)
    }

    const
      height = ref.current?.clientHeight!,
      scaleX = d3.scaleBand().domain(data.map(d => d[category])).range([0, ref.current?.clientWidth!]).paddingInner(0.1),
      scaleY = d3.scaleLinear().domain([minY, maxY]).range([height, 0]),
      rects = data.map((d, i) => {
        const x = scaleX(d[category]), y = scaleY(d[value])
        return <rect key={i} fill={color} x={x} y={y} width={2} height={height - y} />
      })
    setRects(rects)
  }, [value, category, color, data, zeroValue])

  return <svg ref={ref} width='100%' height='100%'>{rects}</svg>
}