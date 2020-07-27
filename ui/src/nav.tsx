import { INavLink, INavLinkGroup, Nav } from '@fluentui/react';
import React from 'react';
import { cards } from './layout';
import { bond, Card, S, qd } from './qd';

/** Create a navigation item. */
interface NavItem {
  /** The name of this item. Prefix the name with a '#' to trigger hash-change navigation. */
  name: S
  /** The label to display. */
  label: S
}

/** Create a group of navigation items. */
interface NavGroup {
  /** The label to display for this group. */
  label: S
  /** The navigation items contained in this group. */
  items: NavItem[]
}

/** Create a card containing a navigation pane. */
interface State {
  /** The navigation groups contained in this pane. */
  items: NavGroup[]
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const groups = state.items.map((g): INavLinkGroup => ({
          name: g.label,
          links: g.items.map((i): INavLink => ({
            key: i.name,
            name: i.label,
            url: '',
            onClick: () => {
              const name = i.name
              if (name[0] === '#') {
                window.location.hash = name.substr(1)
                return
              }
              qd.args[name] = true
              qd.sync()
            }
          }))
        }))
        return <Nav groups={groups} />
      }
    return { render, changed }
  })

cards.register('nav', View)
