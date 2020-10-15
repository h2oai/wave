import { Pivot, PivotItem, PivotLinkFormat } from '@fluentui/react'
import React from 'react'
import { cards } from './layout'
import { Tab } from './tabs'
import { bond, Card, qd, B, S, box } from './qd'

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
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      selectedKeyB = box(state.value),
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
      onHashChanged = () => {
        selectedKeyB(window.location.hash)
      },
      init = () => {
        window.addEventListener('hashchange', onHashChanged)
        if (!state.value) onHashChanged()
      },
      render = () => {
        const
          linkFormat = state.link ? PivotLinkFormat.links : PivotLinkFormat.tabs,
          items = state.items.map(({ name, label, icon }) => (
            <PivotItem key={name} itemKey={name} headerText={label} itemIcon={icon} />
          ))
        return <Pivot data-test={name} linkFormat={linkFormat} onLinkClick={onLinkClick} selectedKey={selectedKeyB()}>{items}</Pivot>

      },
      dispose = () => { window.removeEventListener('hashchange', onHashChanged) }

    return { init, render, changed, selectedKeyB, dispose }
  })

cards.register('tab', View)
