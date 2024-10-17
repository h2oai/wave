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

import { Data, Model, Rec, S } from './core'
import React from 'react'
import { cards, Repeat } from './layout'
import { bond } from './ui'

/**
 * EXPERIMENTAL. DO NOT USE.
 * Create a card containing other cards.
 **/
interface State {
  /** EXPERIMENTAL. DO NOT USE. */
  item_view: S
  /** The child card properties. */
  item_props: Rec
  /** Data for this card. */
  data: Data
}

export const
  View = bond(({ name, state: s, changed }: Model<State>) => {
    const
      render = () => (
        <div data-test={name}>
          <Repeat view={s.item_view} props={s.item_props} data={s.data} />
        </div>
      )
    return { render, changed }
  })

cards.register('repeat', View)