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
import { cssVar, getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
      position: 'relative',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    body: {
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
    },
    value_overlay: {
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    },
    aux_value: {
      ...theme.font.s12,
      color: 'var(--text7)',
    },
  })

/** Create a tall stat card displaying a primary value, an auxiliary value and a progress gauge. */
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
          <Format data={data} format={s.title} className={css.title} />
          <div className={css.body}>
            <ProgressArc thickness={2} color={cssVar(s.plot_color as any)} value={s.progress} />
            <div className={css.value_overlay}>
              <Format data={data} format={s.value} className={css.value} />
              <Format data={data} format={s.aux_value} className={css.aux_value} />
            </div>
          </div>
        </div>
      )
    }
    return { render, changed }
  })

cards.register('tall_gauge_stat', View)