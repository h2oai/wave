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

import { INavLink, INavLinkGroup, Nav } from '@fluentui/react'
import React from 'react'
import { CardEffect, cards } from './layout'
import { B, bond, Card, Id, qd, S } from './qd'

/** Create a navigation item. */
export interface NavItem {
  /** The name of this item. Prefix the name with a '#' to trigger hash-change navigation. */
  name: Id
  /** The label to display. */
  label: S
  /** An optional icon to display next to the label. */
  icon?: S
  /** True if this item should be disabled. */
  disabled?: B
}

/** Create a group of navigation items. */
export interface NavGroup {
  /** The label to display for this group. */
  label: S
  /** The navigation items contained in this group. */
  items: NavItem[]
  /** Indicates whether nav groups should be rendered as collapsed initially */
  collapsed?: B
}

/** Create a card containing a navigation pane. */
export interface State {
  /** The navigation groups contained in this pane. */
  items: NavGroup[]
  /** The name of the active (highlighted) navigation item. */
  value?: S
  /** The name of the initially active (highlighted) navigation item. */
  initial_value?: S
}

export const
  XNav = ({ items, value, initial_value }: State) => {
    const groups = items.map((g): INavLinkGroup => ({
      name: g.label,
      collapseByDefault: g.collapsed,
      links: g.items.map(({ name, label, icon, disabled }): INavLink => ({
        key: name,
        name: label,
        icon,
        disabled,
        url: '',
        onClick: () => {
          if (name.startsWith('#')) {
            window.location.hash = name.substr(1)
            return
          }
          qd.args[name] = true
          qd.sync()
        }
      }))
    }))
    return <Nav groups={groups} selectedKey={value} initialSelectedKey={initial_value} />
  },
  View = bond(({ name, state, changed }: Card<State>) => {
    const render = () => <div data-test={name}><XNav {...state} /></div>
    return { render, changed }
  })

cards.register('nav', View, CardEffect.Flat)
