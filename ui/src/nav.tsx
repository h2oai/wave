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

import * as Fluent from '@fluentui/react'
import { B, Id, Model, S } from 'h2o-wave'
import React from 'react'
import { Component,  } from './form'
import { CardEffect, cards } from './layout'
import { bond, wave } from './ui'

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
  /** An optional tooltip message displayed when a user hovers over this item. */
  tooltip?: S
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
  /** The name of the initially active (highlighted) navigation item. */
  value?: S
  /** The card's title. */
  title?: S
  /** The card's subtitle. */
  subtitle?: S
  /** The icon, displayed to the left. **/
  icon?: S
  /** The icon's color. **/
  icon_color?: S
  /** The URL of an image (usually logo) displayed at the top. **/
  image?: S
  /** The user avatar displayed at the top. Mutually exclusive with image, title and subtitle. **/
  persona?: Component
  /** Items that should be displayed at the bottom of the card if items are not empty, otherwise displayed under subtitle. */
  secondary_items?: Component[]
  /** Card background color. Defaults to 'card'. */
  color?: 'card' | 'primary'
}

export const
  XNav = (props: State & { hideNav?: () => void }) => {
    const
      { items, hideNav } = props,
      [value, setValue] = React.useState(props.value),
      ref = React.useRef(false),
      groups = items.map((g): Fluent.INavLinkGroup => ({
        name: g.label,
        collapseByDefault: g.collapsed,
        links: g.items.map(({ name, label, icon, disabled, tooltip }): Fluent.INavLink => ({
          key: name,
          name: label,
          icon,
          disabled,
          title: tooltip,
          style: disabled ? { opacity: 0.7 } : undefined,
          url: '',
          onClick: () => {
            setValue(name)
            ref.current = true
            if (hideNav) hideNav()
            if (name.startsWith('#')) {
              window.location.hash = name.substr(1)
              return
            }
            wave.args[name] = true
            wave.push()
          }
        }))
      }))
    
    React.useEffect(() => {
      if (!ref.current) setValue(props.value)
      else ref.current = false
    }, [props])
    
    
    
    return <Fluent.Nav groups={groups} selectedKey={value} />
  },
  View = bond(({ state, changed }: Model<State>) => {
    const render = () => {
      return <XNav {...state} />
    }
    return { render, changed }
  })

cards.register('nav', View, { effect: CardEffect.Flat, marginless: true })