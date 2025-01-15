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

import { F, Model, Rec, S, unpack } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format, grid, substitute } from './layout'
import { ProgressArc } from './parts/progress_arc'
import { centerMixin, clas, cssVar, padding } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      padding: padding(8, grid.gap),
    },
    lhs: {
      position: 'relative',
      width: '100%'
    },
    rhs: {
      marginLeft: grid.gap,
      alignSelf: 'center'
    },
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    percentContainer: {
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0,
      ...centerMixin(),
    },
    percent: {
      opacity: 0.5,
    },
    title: {
      overflow: 'visible'
    },
    aux_value: {
      color: cssVar('$text7'),
      marginLeft: 5,
    }
  })

const
  MAX_CHAR_WIDTH = 14,
  MAX_CHAR_AUX_WIDTH = 9,
  MIN_CHAR_COUNT = 4

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
  /** An optional name for this component. */
  name?: S
}

export const
  View = bond(({ name, state: s, changed }: Model<State>) => {
    const render = () => {
      const
        data = unpack<Rec>(s.data),
        value = substitute(s.value, s.data),
        auxValue = substitute(s.aux_value, s.data),
        valueNonDigitCharCount = (value.match(/[^0-9-]/g) || []).length,
        auxValueNonDigitCharCount = (auxValue.match(/[^0-9-]/g) || []).length,
        // This prevents the jumping layout in the most common scenarios when numbers are changing between ones to tens. 
        valueContainerWidth = MAX_CHAR_WIDTH * Math.max(value.length, MIN_CHAR_COUNT + valueNonDigitCharCount),
        auxValueContainerWidth = MAX_CHAR_AUX_WIDTH * Math.max(auxValue.length, MIN_CHAR_COUNT + auxValueNonDigitCharCount)
      return (
        <div data-test={name} className={css.card}>
          <div className={css.lhs}>
            <ProgressArc thickness={2} color={cssVar(s.plot_color)} value={s.progress} />
            <div className={css.percentContainer}>
              <div className={css.percent}>{`${Math.round(s.progress * 100)}%`}</div>
            </div>
          </div>
          <div className={css.rhs}>
            <Format data={data} format={s.title} className={clas(css.title, 'wave-s12 wave-w6')} />
            <div className={css.values}>
              <Format data={data} format={s.value} style={{ minWidth: valueContainerWidth }} className='wave-s24 wave-w3' />
              <Format data={data} format={s.aux_value} style={{ minWidth: auxValueContainerWidth }} className={clas(css.aux_value, 'wave-s13')} />
            </div>
          </div>
        </div >
      )
    }
    return { render, changed }
  })

cards.register('wide_gauge_stat', View)