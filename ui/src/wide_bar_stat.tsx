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
import { ProgressBar } from './parts/progress_bar'
import { bond, Card, F, Rec, S, unpack } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      padding: grid.gap,
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
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
    value: {
      ...theme.font.s18,
      ...theme.font.w3,
    },
    aux_value: {
      ...theme.font.s13,
      color: theme.colors.text7,
      marginLeft: 5,
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
}

export const
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => {
      const data = unpack(s.data)
      return (
        <div data-test={name} className={css.card}>
          <Format data={data} format={s.title} className={css.title} />
          <div className={css.content}>
            <div className={css.values}>
              <Format data={data} format={s.value} className={css.value} />
              <Format data={data} format={s.aux_value} className={css.aux_value} />
            </div>
            <ProgressBar thickness={2} color={theme.color(s.plot_color)} value={s.progress} />
          </div>
        </div>
      )
    }
    return { render, changed }
  })

cards.register('wide_bar_stat', View)