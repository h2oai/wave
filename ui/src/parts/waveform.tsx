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

import React from 'react'
import { stylesheet } from 'typestyle'
import { cssVarValue } from '../theme'
import { F, S } from 'h2o-wave'
import { debounce } from '../ui'

interface Props {
  color: S
  data: F[]
}

const
  TICK_WIDTH = 2,
  css = stylesheet({
    container: {
      width: '100%',
      height: '100%',
      position: 'relative',
      flexGrow: 1,
    }
  })

export const Waveform = ({ color, data }: Props) => {
  const
    ref = React.useRef<HTMLDivElement | null>(null),
    [height, setHeight] = React.useState(0),
    [width, setWidth] = React.useState(0),
    xStep = React.useMemo(() => width / data.length, [data.length, width]),
    updateDimensions = () => {
      if (!ref.current) return
      const { width, height } = ref.current.getBoundingClientRect()
      setWidth(width)
      setHeight(height)
    }

  React.useLayoutEffect(() => {
    updateDimensions()
    const onResize = debounce(1000, updateDimensions)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} className={css.container}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {data.map((d, i) => (
          <rect
            key={i}
            x={i * xStep}
            y={(height - height * d) / 2}
            width={TICK_WIDTH}
            height={height * d}
            fill={cssVarValue(color)}
          />
        ))}
      </svg>
    </div>
  )
}