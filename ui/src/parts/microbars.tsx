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
import { F, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cssVarValue } from '../theme'
import { debounce } from '../ui'

interface Props {
  data: any[]
  zeroValue?: F
  category?: S
  value: S
  color: S
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

export const MicroBars = ({ value, category = 'x', color, data, zeroValue }: Props) => {
  const
    ref = React.useRef<HTMLDivElement | null>(null),
    [content, setContent] = React.useState<JSX.Element | null>(null),
    [minY, maxY] = React.useMemo(() => {
      let [minY, maxY] = d3.extent<any, any>(data, d => d[value])

      if (zeroValue != null) {
        minY = Math.min(zeroValue, minY)
        maxY = Math.max(zeroValue, maxY)
      }
      return [minY, maxY]
    }, [data, value, zeroValue]),
    renderViz = React.useCallback(() => {
      if (!ref.current) return

      const { width, height } = ref.current.getBoundingClientRect()
      if (!height) {
        // Safari has weird event loop meaning this React code can run before Layout phase is finished (flex items not positioned yet).
        setTimeout(renderViz, 300)
        return
      }

      const
        scaleX = d3.scaleBand().domain(data.map(d => d[category])).range([0, width]).paddingInner(0.1),
        scaleY = d3.scaleLinear().domain([minY, maxY]).range([height, 0]),
        rects = data.map((d, i) => {
          const x = scaleX(d[category]), y = scaleY(d[value])
          return <rect key={i} fill={cssVarValue(color)} x={x} y={y} width={2} height={height - y!} />
        })
      setContent(<svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{rects}</svg>)
    }, [category, color, data, maxY, minY, value]),
    onResize = debounce(1000, renderViz)

  React.useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useLayoutEffect(renderViz, [value, category, color, data, zeroValue, minY, maxY, renderViz])

  return <div ref={ref} className={css.container}>{content}</div>
}