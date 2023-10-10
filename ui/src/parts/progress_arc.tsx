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
import { F, S, U } from '../core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { debounce } from '../ui'


interface Props {
  thickness: U
  color: S
  value: F
}

const css = stylesheet({
  container: {
    // Height 100% is not working in Safari. Without this, container has 0 height and d3 cannot compute properly.
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0
  }
})

export const ProgressArc = ({ thickness, color, value }: Props) => {
  const
    ref = React.useRef<HTMLDivElement>(null),
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
        diameter = Math.min(width, height),
        outerRadius = diameter / 2,
        innerRadius = diameter / 2 - thickness,
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

      setContent(
        <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <g transform={diameter === height ? `translate(${(width - (2 * outerRadius)) / 2}, 0)` : `translate(0, ${(height - (2 * outerRadius)) / 2})`}>
            <path d={slot as S} fill={color} fillOpacity={0.15} transform={`translate(${outerRadius},${outerRadius})`} />
            <path d={bar as S} fill={color} transform={`translate(${outerRadius},${outerRadius})`} />
          </g>
        </svg>
      )
    }, [color, thickness, value]),
    onResize = debounce(1000, renderViz)

  React.useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useLayoutEffect(renderViz, [value, color, thickness, renderViz])

  return <div ref={ref} className={css.container}>{content}</div>
}