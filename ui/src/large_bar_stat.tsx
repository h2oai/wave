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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: grid.gap,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    values: {
      display: 'flex',
      justifyContent: 'space-between',
      ...theme.font.s18,
      ...theme.font.w3,
    },
    aux_value: {
      color: theme.colors.text7,
    },
    caption: {
      ...theme.font.s13,
      color: theme.colors.text5,
    },
    captions: {
      display: 'flex',
      justifyContent: 'space-between',
      ...theme.font.s12,
      color: theme.colors.text7,
    },
  })

/** Create a large captioned card displaying a primary value, an auxiliary value and a progress bar, with captions for each value. */
interface State {
  /** The card's title. */
  title: S
  /** The card's caption. */
  caption: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value, typically a target value. */
  aux_value: S
  /** The caption displayed below the primary value. */
  value_caption: S
  /** The caption displayed below the auxiliary value. */
  aux_value_caption: S
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
          <Format data={data} format={s.caption} className={css.caption} />
          <div>
            <div className={css.values}>
              <div><Format data={data} format={s.value} /></div>
              <Format data={data} format={s.aux_value} className={css.aux_value} />
            </div>
            <ProgressBar thickness={2} color={theme.color(s.plot_color)} value={s.progress} />
            <div className={css.captions}>
              <div><Format data={data} format={s.value_caption} /></div>
              <div><Format data={data} format={s.aux_value_caption} /></div>
            </div>
          </div>
        </div>
      )
    }
    return { render, changed }
  })

cards.register('large_bar_stat', View)