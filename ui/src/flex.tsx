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
import { alignments, directions, justifications, wrappings } from './theme'
import { bond } from './ui'/**
 * EXPERIMENTAL. DO NOT USE.
 * Create a card containing other cards laid out using a one-dimensional model with flexible alignemnt and wrapping capabilities.
 **/
interface State {
    /** The child card type. */
    item_view: S;
    /** The child card properties. */
    item_props: Rec;
    /** Data for this card. */
    data: Data;
    /** Layout direction. */
    direction?: 'horizontal' | 'vertical';
    /** Layout strategy for main axis. */
    justify?: 'start' | 'end' | 'center' | 'between' | 'around';
    /** Layout strategy for cross axis. */
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    /** Wrapping strategy. */
    wrap?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch';
    /** An optional name for this card. */
    name?: S;
}

const
  toFlexStyle = (state: State): React.CSSProperties => {
    const
      css: React.CSSProperties = { display: 'flex' },
      direction = directions[state.direction || ''],
      justify = justifications[state.justify || ''],
      align = alignments[state.align || ''],
      wrap = wrappings[state.wrap || '']

    if (direction) css.flexDirection = direction as any
    if (justify) css.justifyContent = justify
    if (align) css.alignItems = align
    if (wrap) {
      css.flexWrap = 'wrap'
      css.alignContent = wrap
    }
    return css
  }

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        // FIXME theme.merge()
        return (
          <div data-test={name} style={toFlexStyle(state)} >
            <Repeat view={state.item_view} props={state.item_props} data={state.data} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('flex', View)
