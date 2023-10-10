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
import { cards, Format } from './layout'
import { clas, cssVar } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    item: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    left: {
      flexDirection: 'column',
    },
    right: {
      flexDirection: 'column',
    },
    caption: {
      color: cssVar('text5'),
    },
    aux_value: {
      color: cssVar('text5'),
    },
  })

/** EXPERIMENTAL. DO NOT USE. */
interface State {
  /** EXPERIMENTAL. DO NOT USE. */
  title: S
  /** EXPERIMENTAL. DO NOT USE. */
  caption: S
  /** EXPERIMENTAL. DO NOT USE. */
  value: S
  /** EXPERIMENTAL. DO NOT USE. */
  aux_value: S
  /** EXPERIMENTAL. DO NOT USE. */
  data: Rec
}

const defaults: Partial<State> = {
  title: 'Untitled',
}

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        const
          s = { ...defaults, ...state },
          data = unpack<Rec>(s.data)

        return (
          <div data-test={name} className={css.item}>
            <div className={css.left}>
              <Format data={data} format={s.title} className='wave-s12 wave-w6' />
              <Format data={data} format={s.caption} className={clas(css.caption, 'wave-s13')} />
            </div>
            <div className={css.right}>
              <Format data={data} format={s.value} className='wave-s12' />
              <Format data={data} format={s.aux_value} className={clas(css.aux_value, 'wave-s13')} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('list_item1', View)