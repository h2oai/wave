import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, iff, Rec, S } from './telesync';

interface Tab {
  name: S
  label: S
  icon: S
}

export interface Tabs {
  name: S
  value: S
  items: Tab[]
}

export const
  XTabs = bond(({ args, model: m, submit }: { args: Rec, model: Tabs, submit: () => void }) => {
    const
      render = () => {
        const onLinkClick = (item?: Fluent.PivotItem) => {
          if (!item) return
          if (item.props.itemKey !== args[m.name]) {
            args[m.name] = item.props.itemKey || null
            submit()
          }
        }
        const selectedKey = (m.value !== undefined && m.value !== null) ? m.value : null
        const ts = m.items.map(t => {
          return (<Fluent.PivotItem key={t.name} itemIcon={iff(t.icon)} itemKey={t.name} headerText={t.label}></Fluent.PivotItem>)
        })
        return (<Fluent.Pivot selectedKey={selectedKey} onLinkClick={onLinkClick}>{ts}</Fluent.Pivot>)
      }
    return { render }
  })