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

import { Model, Rec, S, unpack } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format, grid } from './layout'
import { clas } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
    },
    value: {
      lineHeight: '28px', // Override to fit inside 1 unit height in grid layout.
    }
  })

/** Create a stat card displaying a single value. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** Data for this card. */
  data?: Rec
  /** An optional identifying name for this card. */
  name?: S
}

export const
  View = bond(({ name, state: s, changed }: Model<State>) => {
    const render = () => {
      const data = unpack<Rec>(s.data)
      return (
        <div data-test={name} className={css.card}>
          <Format data={data} format={s.title} className='wave-s12 wave-w6' />
          <Format data={data} format={s.value} className={clas(css.value, 'wave-s24 wave-w3')} />
        </div>
      )
    }
    return { render, changed }
  })

cards.register('small_stat', View)