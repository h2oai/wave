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
import { MicroArea } from './parts/microarea'
import { MicroBars } from './parts/microbars'
import { bond, Card, Data, F, Rec, S, unpack } from './qd'
import { cssVar, getTheme, pc } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      padding: grid.gap,
    },
    plot: {
      display: 'flex',
      width: pc(50),
    },
    text: {
      width: pc(50),
      paddingLeft: grid.gap,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
      lineHeight: '28px', // Override to fit inside 1 unit height in grid layout.
    },
    aux_value: {
      ...theme.font.s13,
      color: 'var(--text7)',
      marginLeft: 5,
    }
  })

/** Create a wide stat card displaying a primary value, an auxiliary value and a series plot. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value displayed below the primary value. */
  aux_value: S
  /** The plot's data. */
  plot_data: Data
  /** The data field to use for y-axis values. */
  plot_value: S
  /** The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used. */
  plot_zero_value?: F
  /** The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'. */
  plot_category?: S
  /** The type of plot. Defaults to `area`. */
  plot_type?: 'area' | 'interval'
  /** The plot's curve style. Defaults to `linear`. */
  plot_curve?: 'linear' | 'smooth' | 'step' | 'step-after' | 'step-before'
  /** The plot's color. */
  plot_color?: S
  /** Data for this card. */
  data?: Rec
}

export const
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => {
      const
        data = unpack(s.data),
        plot = s.plot_type === 'interval'
          ? (
            <MicroBars
              data={unpack(s.plot_data)}
              category={s.plot_category}
              value={s.plot_value}
              color={cssVar(s.plot_color as any)}
              zeroValue={s.plot_zero_value}
            />
          ) : (
            <MicroArea
              data={unpack(s.plot_data)}
              value={s.plot_value}
              color={cssVar(s.plot_color as any)}
              zeroValue={s.plot_zero_value}
              curve={s.plot_curve || 'linear'}
            />
          )

      return (
        <div data-test={name} className={css.card}>
          <div className={css.plot}>{plot}</div>
          <div className={css.text}>
            <Format data={data} format={s.title} className={css.title} />
            <div className={css.values}>
              <Format data={data} format={s.value} className={css.value} />
              <Format data={data} format={s.aux_value} className={css.aux_value} />
            </div>
          </div>
        </div>
      )
    }
    return { render, changed }
  })

cards.register('wide_series_stat', View)