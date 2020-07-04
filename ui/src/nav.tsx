import { INavLink, INavLinkGroup, Nav } from '@fluentui/react';
import React from 'react';
import { cards } from './layout';
import { bond, Card, S, telesync } from './telesync';

interface NavItem {
  name: S
  label: S
}

interface NavGroup {
  label: S
  items: NavItem[]
}

interface State {
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
              telesync.args[name] = true
              telesync.sync()
            }
          }))
        }))
        return <Nav groups={groups} />
      }
    return { render, changed }
  })

cards.register('nav', View)
