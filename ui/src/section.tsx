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
import { bond, Card, S } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    title: {
      ...theme.font.s14,
      ...theme.font.w6,
    },
    subtitle: {
      ...theme.font.s12,
    },
  })


/**
 * Render a card displaying a title and a subtitle.
 * Section cards are typically used to demarcate different sections on a page. 
 */
interface State {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. */
  subtitle: S
}

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          { title, subtitle } = state

        return (
          <div data-test={name}>
            <div className={css.title}>{title}</div>
            <div className={css.subtitle}>{subtitle}</div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('section', View, CardEffect.Transparent)



