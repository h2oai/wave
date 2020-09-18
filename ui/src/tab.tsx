import { Pivot, PivotItem, PivotLinkFormat } from '@fluentui/react'
import React from 'react'
import { cards } from './grid_layout'
import { Tab } from './tabs'
import { bond, Card, qd, B, S } from './qd'

/** Create a card containing tabs for navigation. */
interface State {
  /** Items to render. */
  items: Tab[]
  /** The name of the tab to select. */
  value?: S
  /** True if tabs should be rendered as links and not a standard tab. */
  link?: B
}

export const
  TabComponent = (state: State) => {
    const
      onLinkClick = (item?: PivotItem) => {
        const name = item?.props.itemKey
        if (!name) return
        if (name.startsWith('#')) {
          window.location.hash = name.substr(1)
          return
        }
        qd.args[name] = true
        qd.sync()
      },
      linkFormat = state.link ? PivotLinkFormat.links : PivotLinkFormat.tabs,
      items = state.items.map(({ name, label, icon }) => (
        <PivotItem key={name} itemKey={name} headerText={label} itemIcon={icon} />
      ))
    return <Pivot data-test='tab' linkFormat={linkFormat} onLinkClick={onLinkClick} defaultSelectedKey={state.value}>{items}</Pivot>
  },
  View = bond(({ state, changed }: Card<State>) => {
    const render = () => <TabComponent {...state} />
    return { render, changed }
  })

cards.register('tab', View)
