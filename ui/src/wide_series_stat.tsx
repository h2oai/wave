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

import { Data, F, Model, Rec, S, unpack } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format, grid, substitute } from './layout'
import { MicroArea } from './parts/microarea'
import { MicroBars } from './parts/microbars'
import { clas, cssVar } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      padding: grid.gap,
    },
    plot: {
      width: '100%',
    },
    text: {
      paddingLeft: grid.gap,
      alignSelf: 'center',
    },
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    value: {
      lineHeight: '28px', // Override to fit inside 1 unit height in grid layout.
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
  /** An optional name for this card. */
  name?: S
}

export const
  View = bond(({ name, state: s, changed }: Model<State>) => {
    const render = () => {
      const
        data = unpack<Rec>(s.data),
        plot = s.plot_type === 'interval'
          ? (
            <MicroBars
              data={unpack<any[]>(s.plot_data)}
              category={s.plot_category}
              value={s.plot_value}
              color={cssVar(s.plot_color)}
              zeroValue={s.plot_zero_value}
            />
          ) : (
            <MicroArea
              data={unpack<any[]>(s.plot_data)}
              value={s.plot_value}
              color={cssVar(s.plot_color)}
              zeroValue={s.plot_zero_value}
              curve={s.plot_curve || 'linear'}
            />
          ),
        value = substitute(s.value, s.data),
        auxValue = substitute(s.aux_value, s.data),
        valueNonDigitCharCount = (value.match(/[^0-9-]/g) || []).length,
        auxValueNonDigitCharCount = (auxValue.match(/[^0-9-]/g) || []).length,
        // This prevents the jumping layout in the most common scenarios when numbers are changing between ones to tens. 
        valueContainerWidth = MAX_CHAR_WIDTH * Math.max(value.length, MIN_CHAR_COUNT + valueNonDigitCharCount),
        auxValueContainerWidth = MAX_CHAR_AUX_WIDTH * Math.max(auxValue.length, MIN_CHAR_COUNT + auxValueNonDigitCharCount)
      return (
        <div data-test={name} className={css.card}>
          <div className={css.plot}>{plot}</div>
          <div className={css.text}>
            <Format data={data} format={s.title} className='wave-s12 wave-w6' />
            <div className={css.values}>
              <Format data={data} format={s.value} style={{ minWidth: valueContainerWidth }} className={clas(css.value, 'wave-s24 wave-w3')} />
              <Format data={data} format={s.aux_value} style={{ minWidth: auxValueContainerWidth }} className={clas(css.aux_value, 'wave-s13')} />
            </div>
          </div>
        </div>
      )
    }
    return { render, changed }
  })

cards.register('wide_series_stat', View)