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

import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format } from './layout'
import { MicroArea } from './parts/microarea'
import { MicroBars } from './parts/microbars'
import { bond, Card, Data, F, Rec, S, unpack } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    },
    aux_value: {
      ...theme.font.s12,
      color: theme.colors.text7,
    },
    plot: {
      // 98px is the height of titlebar
      height: 'calc(100% - 98px)',
      width: '100%'
    }
  })

/** Create a tall stat card displaying a primary value, an auxiliary value and a series plot. */
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
              color={theme.color(s.plot_color)}
              zeroValue={s.plot_zero_value}
            />
          ) : (
            <MicroArea
              data={unpack(s.plot_data)}
              value={s.plot_value}
              color={theme.color(s.plot_color)}
              zeroValue={s.plot_zero_value}
              curve={s.plot_curve || 'linear'}
            />
          )

      return (
        <Fluent.Stack data-test={name} style={{ position: 'static', height: '100%' }}>
          <Fluent.StackItem tokens={{ padding: 15 }}>
            <Format data={data} format={s.title || 'Untitled'} className={css.title} />
            <Format data={data} format={s.value} className={css.value} />
            <Format data={data} format={s.aux_value} className={css.aux_value} />
          </Fluent.StackItem>
          <div className={css.plot}>{plot}</div>
        </Fluent.Stack>
      )
    }
    return { render, changed }
  })

cards.register('tall_series_stat', View)