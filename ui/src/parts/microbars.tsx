import * as d3 from 'd3';
import React from 'react';
import { F, S, U } from '../telesync';

interface Props {
  width: U
  height: U
  data: any[]
  zeroValue?: F
  category?: S
  value: S
  color: S
}

export class MicroBars extends React.Component<Props> {
  ref = React.createRef<SVGSVGElement>()
  render() {
    const
      { width, height, value, category: _category, color, data, zeroValue } = this.props,
      category = _category ? _category : 'x'


    let [minY, maxY] = d3.extent<any, any>(data, d => d[value])

    if (zeroValue != null) {
      if (minY > zeroValue) {
        minY = zeroValue
      } else if (maxY < zeroValue) {
        maxY = zeroValue
      }
    }

    const
      maxWidth = data.length * 8,
      scaleX = d3.scaleBand().domain(data.map(d => d[category])).range([0, Math.min(width, maxWidth)]).paddingInner(0.1),
      scaleY = d3.scaleLinear().domain([minY, maxY]).range([height, 0]),
      rects = data.map((d, i) => {
        const x = scaleX(d[category]), y = scaleY(d[value])
        return <rect key={i} fill={color} x={x} y={y} width={2} height={height - y} />
      })
    return (
      <svg ref={this.ref} width={width} height={height}>
        {rects}
      </svg>
    )
  }
}
