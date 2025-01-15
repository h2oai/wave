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
import { cards, Format, grid } from './layout'
import { ProgressBar } from './parts/progress_bar'
import { clas, cssVar } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      padding: grid.gap,
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    aux_value: {
      marginLeft: 5,
      color: cssVar('$text7'),
    }
  })

/** Create a wide stat card displaying a primary value, an auxiliary value and a progress bar. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value displayed next to the primary value. */
  aux_value: S
  /** The value of the progress bar, between 0 and 1. */
  progress: F
  /** The color of the progress bar. */
  plot_color?: S
  /** Data for this card. */
  data?: Rec
  /** An optional name for this component. */
  name?: S
}

export const
  View = bond(({ name, state: s, changed }: Model<State>) => {
    const render = () => {
      const data = unpack<Rec>(s.data)
      return (
        <div data-test={name} className={css.card}>
          <Format data={data} format={s.title} className='wave-s12 wave-w6' />
          <div className={css.content}>
            <div className={css.values}>
              <Format data={data} format={s.value} className='wave-s18 wave-w3' />
              <Format data={data} format={s.aux_value} className={clas(css.aux_value, 'wave-s13')} />
            </div>
            <ProgressBar thickness={2} color={cssVar(s.plot_color)} value={s.progress} />
          </div>
        </div>
      )
    }
    return { render, changed }
  })

cards.register('wide_bar_stat', View)