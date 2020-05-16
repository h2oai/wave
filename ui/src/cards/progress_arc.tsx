import * as d3 from 'd3';
import React from 'react';
import { F, S, U } from '../delta';

interface Props {
  size: U
  thickness: U
  color: S
  value: F
}

export const ProgressArc = ({ size, thickness, color, value }: Props) => {
  const
    outerRadius = size / 2,
    innerRadius = size / 2 - thickness,
    slot = d3.arc()({
      outerRadius,
      innerRadius,
      startAngle: 0,
      endAngle: 2 * Math.PI,
    }) as any,
    bar = d3.arc()({
      outerRadius,
      innerRadius,
      startAngle: 0,
      endAngle: 2 * Math.PI * value,
    }) as any
  return (
    <svg width={size} height={size}>
      <path d={slot} fill={color} fillOpacity={0.15} transform={`translate(${outerRadius},${outerRadius})`} />
      <path d={bar} fill={color} transform={`translate(${outerRadius},${outerRadius})`} />
    </svg>
  )
}