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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: grid.gap,
    },
    values: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    aux_value: {
      color: cssVar('$text7'),
    },
    caption: {
      color: cssVar('$text5'),
    },
    captions: {
      display: 'flex',
      justifyContent: 'space-between',
      color: cssVar('$text7'),
    },
  })/** Create a large captioned card displaying a primary value, an auxiliary value and a progress bar, with captions for each value. */
interface State {
    /** The card's title. */
    title: S;
    /** The card's caption. */
    caption: S;
    /** The primary value displayed. */
    value: S;
    /** The auxiliary value, typically a target value. */
    aux_value: S;
    /** The caption displayed below the primary value. */
    value_caption: S;
    /** The caption displayed below the auxiliary value. */
    aux_value_caption: S;
    /** The value of the progress bar, between 0 and 1. */
    progress: F;
    /** The color of the progress bar. */
    plot_color?: S;
    /** Data for this card. */
    data?: Rec;
    /**
     * An optional name for this card.
     */
    name?: S;
}

export const
  View = bond(({ name, state: s, changed }: Model<State>) => {
    const render = () => {
      const data = unpack<Rec>(s.data)
      return (
        <div data-test={name} className={css.card}>
          <Format data={data} format={s.title} className='wave-s12 wave-w6' />
          <Format data={data} format={s.caption} className={clas(css.caption, 'wave-s13')} />
          <div>
            <div className={clas(css.values, 'wave-s18 wave-w3')}>
              <div><Format data={data} format={s.value} /></div>
              <Format data={data} format={s.aux_value} className={css.aux_value} />
            </div>
            <ProgressBar thickness={2} color={cssVar(s.plot_color)} value={s.progress} />
            <div className={clas(css.captions, 'wave-s12')}>
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