import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, S, telesync } from './telesync';

interface NavItem {
  name: S
  label: S
}

interface NavGroup {
  label: S
  items: NavItem[]
}

export interface Nav {
  name: S
  items: NavGroup[]
}

export const
  XNav = bond(({ model: m }: { model: Nav }) => {
    telesync.args[m.name] = null
    const
      onLinkClick = (_ev?: React.MouseEvent<HTMLElement>, item?: Fluent.INavLink) => {
        if (!item) return
        telesync.args[m.name] = item.key || null
        telesync.sync()
      },
      render = () => {
        const groups = m.items.map((g): Fluent.INavLinkGroup => ({
          name: g.label,
          links: g.items.map((i): Fluent.INavLink => ({
            key: i.name,
            name: i.label,
            url: '#'
          }))
        }))
        return <Fluent.Nav groups={groups} onLinkClick={onLinkClick} />
      }
    return { render }
  })