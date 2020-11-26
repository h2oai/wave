import { INavLink, INavLinkGroup, Nav } from '@fluentui/react'
import React from 'react'
import { CardEffect, cards } from './layout'
import { bond, Card, S, qd, B } from './qd'

/** Create a navigation item. */
export interface NavItem {
  /** The name of this item. Prefix the name with a '#' to trigger hash-change navigation. */
  name: S
  /** The label to display. */
  label: S
  /** An optional icon to display next to the label. */
  icon?: S
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
}

export const
  XNav = ({ items, value }: State) => {
    const groups = items.map((g): INavLinkGroup => ({
      name: g.label,
      collapseByDefault: g.collapsed,
      links: g.items.map(({ name, label, icon }): INavLink => ({
        key: name,
        name: label,
        icon,
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
    return <Nav groups={groups} selectedKey={value} />
  },
  View = bond(({ name, state, changed }: Card<State>) => {
    const render = () => <div data-test={name}><XNav {...state} /></div>
    return { render, changed }
  })

cards.register('nav', View, CardEffect.Flat)