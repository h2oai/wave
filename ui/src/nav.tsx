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
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { CardEffect, cards, getEffectClass, toCardEffect } from './layout'
import { XPersona } from './persona'
import { clas, cssVar, padding } from './theme'
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
  /** The card's title. */
  title?: S
  /** The card's subtitle. */
  subtitle?: S
  /** The icon, displayed to the left. **/
  icon?: S
  /** The icon's color. **/
  icon_color?: S
  /** The logo displayed at the top. **/
  image?: S
  /** The name of the active (highlighted) navigation item. */
  value?: S
  /** The user avatar displayed at the top. Mutually exclusive with image, title and subtitle. **/
  persona?: Component
  /** Items that should be displayed at the bottom of the card. */
  secondary_items?: Component[]
  /** Card background color. Defaults to 'card'. */
  color?: 'card' | 'primary'
}

const css = stylesheet({
  title: {
    color: cssVar('$themePrimary')
  },
  subtitle: {
    marginTop: -4
  },
  icon: {
    fontSize: 56
  },
  header: {
    padding: padding(24, 24, 0),
    textAlign: 'center'
  },
  brand: {
    marginBottom: 20
  },
  persona: {
    $nest: {
      '.ms-Persona': {
        flexDirection: 'column',
        height: 'auto',
      },
      '.ms-Persona-details': {
        alignItems: 'center',
        padding: 0
      },
      '.ms-Persona-primaryText': {
        fontWeight: 500,
        marginTop: 12,
      }
    },

  },
})

export const
  XNav = ({ items, value, hideNav }: State & { hideNav?: () => void }) => {
    const groups = items.map((g): Fluent.INavLinkGroup => ({
      name: g.label,
      collapseByDefault: g.collapsed,
      links: g.items.map(({ name, label, icon, disabled }): Fluent.INavLink => ({
        key: name,
        name: label,
        icon,
        disabled,
        url: '',
        onClick: () => {
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
    return <Fluent.Nav groups={groups} selectedKey={value} />
  },
  View = bond(({ name, state, changed }: Model<State>) => {
    const render = () => {
      const { title, subtitle, icon, icon_color = '$text', image, persona, secondary_items, color = 'card' } = state
      return (
        <div data-test={name} className={getEffectClass(toCardEffect(color))}>
          <div className={css.header}>
            {(image || icon) && (
              <div className={css.brand}>
                {image && <Fluent.Image src={image} imageFit={Fluent.ImageFit.centerCover} height={150} />}
                {icon && !image && <Fluent.FontIcon iconName={icon} className={css.icon} style={{ color: cssVar(icon_color) }} />}
              </div>
            )}
            {title && <div className={clas('wave-s24 wave-w6', css.title)}>{title}</div>}
            {subtitle && <div className={clas('wave-s13', css.subtitle)}>{subtitle}</div>}
            {!image && !icon && persona?.persona && <div className={css.persona}><XPersona model={persona.persona} /></div>}
          </div>
          <XNav {...state} />
          {secondary_items && <XComponents items={secondary_items} />}
        </div>)
    }
    return { render, changed }
  })

cards.register('nav', View, { effect: CardEffect.Flat, marginless: true })