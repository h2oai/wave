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

import { Model } from './core'
import React from 'react'
import { Stat } from './stats'
import { cards } from './layout'
import { bond } from './ui'
import { stylesheet } from 'typestyle'
import { clas, cssVar } from './theme'

/** Create a vertical label-value pairs collection. Icon in `ui.stat` is not yet supported in this card. */
export interface State {
  /** The individual stats to be displayed. */
  items: Stat[]
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      padding: 24,
      justifyContent: 'space-around',
    },
    value: {
      color: cssVar('$themePrimary'),
    },
  })

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const render = () => (
      <div data-test={name} className={css.card}>
        {
          state.items.map(({ label, value }, i) => (
            <div key={`${i}-${label}`}>
              {value && <div className={clas(css.value, 'wave-s40 wave-w4')}>{value}</div>}
              <div className='wave-s14 wave-w2'>{label}</div>
            </div>)
          )
        }
      </div>
    )

    return { render, changed }
  })

cards.register('tall_stats', View)