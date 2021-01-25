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
import { cards, Format, grid } from './layout'
import { ProgressArc } from './parts/progress_arc'
import { bond, Card, F, Rec, S, unpack } from './qd'
import { cssVar, pc, clas } from './theme'

const
  css = stylesheet({
    card: {
      display: 'flex',
      padding: grid.gap,
    },
    lhs: {
      position: 'relative',
      width: pc(50)
    },
    rhs: {
      width: pc(50),
      marginLeft: grid.gap,
    },
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    percentContainer: {
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    percent: {
      opacity: 0.5,
    },
    title: {
      overflow: 'visible'
    },
    value: {
      lineHeight: '28px', // Override to fit inside 1 unit height in grid layout.
    },
    aux_value: {
      color: 'var(--text7)',
      marginLeft: 5,
    }
  })

/** Create a wide stat card displaying a primary value, an auxiliary value and a progress gauge. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value displayed next to the primary value. */
  aux_value: S
  /** The value of the progress gauge, between 0 and 1. */
  progress: F
  /** The color of the progress gauge. */
  plot_color?: S
  /** Data for this card. */
  data?: Rec
}

export const
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => {
      const data = unpack(s.data)
      return (
        <div data-test={name} className={css.card}>
          <div className={css.lhs}>
            <ProgressArc thickness={2} color={cssVar(s.plot_color)} value={s.progress} />
            <div className={css.percentContainer}>
              <div className={css.percent}>{`${Math.round(s.progress * 100)}%`}</div>
            </div>
          </div>
          <div className={css.rhs}>
            <Format data={data} format={s.title} className='s12 w6' />
            <div className={css.values}>
              <Format data={data} format={s.value} className='s24 w3' />
              <Format data={data} format={s.aux_value} className={clas(css.aux_value, 's13')} />
            </div>
          </div>
        </div >
      )
    }
    return { render, changed }
  })

cards.register('wide_gauge_stat', View)