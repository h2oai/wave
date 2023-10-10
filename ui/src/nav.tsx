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
import { B, Box, Id, Model, S, box, on } from './core'
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
  /** An optional tooltip message displayed when a user hovers over this item. */
  tooltip?: S,
  /** The path or URL to link to. If specified, the `name` is ignored. The URL is opened in a new browser window or tab. E.g. `/foo.html` or `http://example.com/foo.html` */
  path?: S
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

const css = stylesheet({
  card: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    color: cssVar('$themePrimary')
  },
  icon: {
    fontSize: 56,
    display: 'flex',
    justifyContent: 'center'
  },
  header: {
    padding: padding(24, 24, 0),
    textAlign: 'center'
  },
  img: {
    maxHeight: 100
  },
  brand: {
    marginBottom: 10
  },
  secondaryItems: {
    padding: 24,
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
  XNav = ({ items, hideNav, linksOnly = false, valueB }: State & { hideNav?: () => void, linksOnly?: B, valueB: Box<S | undefined> }) => {
    const groups = items.map((g): Fluent.INavLinkGroup => ({
      name: g.label,
      collapseByDefault: g.collapsed,
      links: g.items.map(({ name, label, icon, disabled, tooltip, path }, idx): Fluent.INavLink => ({
        key: name,
        name: label,
        icon,
        disabled,
        title: tooltip,
        style: {
          opacity: disabled ? 0.7 : undefined,
          marginTop: !linksOnly && idx === 0 && !g.label ? 30 : undefined
        },
        url: '',
        onClick: () => {
          valueB(name)
          if (hideNav) hideNav()
          if (path) window.open(path, "_blank")
          else if (name.startsWith('#')) window.location.hash = name.substring(1)
          else {
            wave.args[name] = true
            wave.push()
          }
        }
      }))
    }))
    return <Fluent.Nav groups={groups} selectedKey={valueB() || ''} styles={{ groupContent: { marginBottom: 0, animation: 'none' } }} />
  },
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      valueB = box<S | undefined>(state.value),
      valueWatcher = on(valueB, val => state.value = val),
      render = () => {
        const { title, subtitle, icon, color = 'card', icon_color = color === 'primary' ? '$card' : '$text', image, persona, secondary_items } = state
        return (
          <div data-test={name} className={clas(getEffectClass(toCardEffect(color)), css.card)} style={{ background: cssVar(`$${color}`) }}>
            <div className={css.header}>
              {(image || icon) && (
                <div className={css.brand}>
                  {image && <img src={image} className={css.img} />}
                  {icon && !image && <Fluent.Icon iconName={icon} className={css.icon} style={{ color: cssVar(icon_color) }} />}
                </div>
              )}
              {title && <div className={clas('wave-s24 wave-w6', color === 'card' ? 'wave-p9' : 'wave-c9')}>{title}</div>}
              {subtitle && <div className={clas('wave-s13', color === 'card' ? 'wave-t8' : 'wave-c8')}>{subtitle}</div>}
              {!image && !icon && persona?.persona && <div className={css.persona}><XPersona model={persona.persona} /></div>}
            </div>
            <XNav {...state} linksOnly={!image && !icon && !title && !subtitle && !persona} valueB={valueB} />
            {secondary_items && <div className={css.secondaryItems} style={{ marginTop: state.items.length ? 'auto' : 'initial' }}><XComponents items={secondary_items} /></div>}
          </div>)
      },
      update = (prevProps: Model<State>) => {
        if (prevProps.state.value === valueB()) return
        valueB(prevProps.state.value)
        const name = prevProps.state.value

        if (!name) return
        if (name.startsWith('#')) window.location.hash = name.substring(1)
        else wave.args[name] = true
      },
      dispose = () => valueWatcher.dispose()

    return { render, changed, update, valueB, dispose }
  })

cards.register('nav', View, { effect: CardEffect.Flat, marginless: true, animate: false })