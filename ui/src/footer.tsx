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
import { CardEffect, cards } from './layout'
import { Markdown } from './markdown'
import { bond, Card, S } from './qd'

const
  css = stylesheet({
    card: {
      display: 'flex',
      alignItems: 'center',
    },
  })


/**
 * Render a page footer displaying a caption.
 * Footer cards are typically displayed at the bottom of a page.
 * :icon "Footer"
 */
interface State {
  /**
   * The caption. Supports markdown.
   * :t "textbox"
   * :value "(c) Your Company, Inc."
   **/
  caption: S
}

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          { caption } = state

        return (
          <div data-test={name} className={css.card}>
            <div className='wave-s13'><Markdown source={caption} /></div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('footer', View, { effect: CardEffect.Transparent })



