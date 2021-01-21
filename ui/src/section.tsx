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
import { Component, XComponentAlignment, XComponents } from './form'
import { CardEffect, cards } from './layout'
import { Markdown } from './markdown'
import { bond, Card, Packed, S, unpack } from './qd'
import { clas } from './theme'

const
  css = stylesheet({
    card: {
      display: 'flex',
      paddingTop: 5,
    },
    lhs: {
      flexGrow: 1,
    },
    subtitle: {
      $nest: {
        '>div>p': { margin: 0 },
      },
    },
  })


/**
 * Render a card displaying a title, a subtitle, and optional components.
 * Section cards are typically used to demarcate different sections on a page. 
 */
interface State {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. Supports Markdown. */
  subtitle: S
  /** The components to display in this card */
  items?: Packed<Component[]>
}

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          { title, subtitle, items } = state,
          components = unpack<Component[]>(items), // XXX ugly
          form = items && (
            <div>
              <XComponents items={components} alignment={XComponentAlignment.Right} />
            </div>
          )

        return (
          <div data-test={name} className={css.card}>
            <div className={css.lhs}>
              <div className='s14 w6'>{title}</div>
              <div className={clas(css.subtitle, 's12')}><Markdown source={subtitle} /></div>
            </div>
            {form}
          </div>
        )
      }
    return { render, changed }
  })

cards.register('section', View, CardEffect.Transparent)



