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
  category?: S
  value: S
  color: S
}

export const MicroBars = ({ value, category = 'x', color, data, zeroValue }: Props) => {
  const
    ref = React.useRef<SVGSVGElement | null>(null),
    [rects, setRects] = React.useState<JSX.Element[] | null>(null),
    [minY, maxY] = React.useMemo(() => {
      let [minY, maxY] = d3.extent<any, any>(data, d => d[value])

      if (zeroValue != null) {
        minY = Math.min(zeroValue, minY)
        maxY = Math.max(zeroValue, maxY)
      }
      return [minY, maxY]
    }, [data, zeroValue]),
    renderViz = () => {
      const
        height = ref.current?.clientHeight!,
        scaleX = d3.scaleBand().domain(data.map(d => d[category])).range([0, ref.current?.clientWidth!]).paddingInner(0.1),
        scaleY = d3.scaleLinear().domain([minY, maxY]).range([height, 0]),
        rects = data.map((d, i) => {
          const x = scaleX(d[category]), y = scaleY(d[value])
          return <rect key={i} fill={color} x={x} y={y} width={2} height={height - y} />
        })
      setRects(rects)
    }

  React.useEffect(() => {
    window.addEventListener('resize', renderViz)
    return () => window.removeEventListener('resize', renderViz)
  }, [])
  React.useLayoutEffect(renderViz, [value, category, color, data, zeroValue])

  return <svg ref={ref} width='100%' height='100%'>{rects}</svg>
}