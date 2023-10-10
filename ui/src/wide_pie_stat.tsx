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

import * as d3 from 'd3'
import { F, Model, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { clas, cssVar, getContrast, pc } from './theme'
import { bond } from './ui'

const css = stylesheet({
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: grid.gap,
    maxHeight: pc(100)
  },
  cardContent: {
    display: 'flex',
    flexGrow: 1,
    maxHeight: `calc(100% - ${2 * grid.gap}px)`
  },
  title: {
    color: cssVar('$neutralPrimary'),
    marginBottom: grid.gap,
  },
  value: {
    color: cssVar('$neutralPrimary'),
    marginTop: -5
  },
  description: {
    marginLeft: 4,
    marginBottom: 16
  },
  label: {
    marginTop: -3,
    marginBottom: 4
  },
  pieContainer: {
    minWidth: 150,
    flexGrow: 1,
    position: 'relative',
  },
  pie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: '0 auto',
    maxHeight: `calc(100% - ${2 * grid.gap}px)`
  },
  pieText: {
    textAnchor: 'middle',
    fontSize: 10,
  },
  pieLegendContainer: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    // HACK: https://github.com/philipwalton/flexbugs#flexbug-14.
    writingMode: 'vertical-lr'
  },
  pieLegend: {
    display: 'flex',
    marginRight: grid.gap,
    writingMode: 'horizontal-tb'
  },
  colorPreview: {
    borderRadius: 4,
    width: 16,
    height: 16
  }
})

/** Card's pie chart data to be displayed. */
interface Pie {
  /** The description for the pie, displayed in the legend. */
  label: S
  /** The formatted value displayed on the pie. */
  value: S
  /** A value between 0 and 1 indicating the size of the pie. */
  fraction: F
  /** The color of the pie. */
  color: S
  /** The auxiliary value, displayed below the label. */
  aux_value?: S
}

/** Create a wide pie stat card displaying a title and pie chart with legend. */
interface State {
  /** The card's title. */
  title: S
  /** The pies to be included in the pie chart. */
  pies: Pie[]
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => {
    const
      { title, pies } = state,
      colorDomain = d3.scaleOrdinal<S>().domain(pies.map(({ label }) => label)).range(pies.map(({ color }) => color)),
      innerRadius = 0,
      outerRadius = 50,
      arc = d3.arc()
    return (
      <div data-test={name} className={css.card}>
        <div className={clas('wave-s20 wave-w6', css.title)}>{title}</div>
        <div className={css.cardContent}>
          <div className={css.pieLegendContainer}>
            {
              pies.map(({ label, aux_value }, idx) => (
                <div key={idx} className={css.pieLegend}>
                  <div className={css.colorPreview} style={{ background: cssVar(colorDomain(label)) }}></div>
                  <div className={css.description}>
                    <div className={clas('wave-s16 wave-w6 wave-t7', css.label)}>{label}</div>
                    {aux_value && <div className={clas('wave-s24 wave-w7', css.value)}>{aux_value}</div>}
                  </div>
                </div>
              ))
            }
          </div>
          {/* HACK: Safari has problems with correct Flexbox layout compute sometimes so position the SVG absolutely.*/}
          <div className={css.pieContainer}>
            <svg viewBox='0 0 100 100' className={css.pie}>
              {
                d3.pie<Pie>().value(d => d.fraction)(pies).map(({ startAngle, endAngle, data }, idx) => {
                  const [translateX, translateY] = arc.centroid({ innerRadius, outerRadius, startAngle, endAngle })
                  const color = colorDomain(data.label)
                  return (
                    <React.Fragment key={idx}>
                      <path
                        d={arc({ innerRadius, outerRadius, startAngle, endAngle }) as S}
                        fill={cssVar(color)}
                        transform={`translate(${outerRadius}, ${outerRadius})`}
                      />
                      <text className={css.pieText} fill={getContrast(color)} transform={`translate(${translateX + outerRadius}, ${translateY + outerRadius})`}>{data.value}</text>
                    </React.Fragment>
                  )
                })
              }
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return { render, changed }
})

cards.register('wide_pie_stat', View)