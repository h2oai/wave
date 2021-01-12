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

import { Pivot, PivotItem, PivotLinkFormat } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { B, bond, Card, qd, S } from './qd'
import { Tab } from './tabs'

/** Create a card containing tabs for navigation. */
interface State {
  /** The tabs to display in this card */
  items: Tab[]
  /** The name of the tab to select. */
  value?: S
  /** True if tabs should be rendered as links instead of buttons. */
  link?: B
  /** An optional name for the card. If provided, the selected tab can be accessed using the name of the card. */
  name?: S
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  })

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      onLinkClick = (item?: PivotItem) => {
        const name = item?.props.itemKey
        if (!name) return
        if (name.startsWith('#')) {
          window.location.hash = name.substr(1)
          return
        }
        if (state.name) {
          qd.args[state.name] = name
        } else {
          qd.args[name] = true
        }
        qd.sync()
      },
      render = () => {
        const
          linkFormat = state.link ? PivotLinkFormat.links : PivotLinkFormat.tabs,
          items = state.items.map(({ name, label, icon }) => (
            <PivotItem key={name} itemKey={name} headerText={label} itemIcon={icon} />
          ))
        return (
          <div data-test={name} className={css.card}>
            <Pivot linkFormat={linkFormat} onLinkClick={onLinkClick} defaultSelectedKey={state.value}>{items}</Pivot>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('tab', View, CardEffect.Transparent)
