import { Pivot, PivotItem, PivotLinkFormat } from '@fluentui/react';
import React from 'react';
import { cards } from './layout';
import { Tab } from './tabs';
import { bond, Card, qd, B } from './qd';

/** Create a card containing tabs for navigation. */
interface State {
  /** Items to render. */
  items: Tab[]
  /** True if tabs should be rendered as links and not a standard tab. */
  link?: B
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      onLinkClick = (item?: PivotItem) => {
        const name = item?.props.itemKey
        if (!name) return
        if (name[0] === '#') {
          window.location.hash = name.substr(1)
          return
        }
        qd.args[name] = true
        qd.sync()
      },
      render = () => {
        const
          linkFormat = state.link ? PivotLinkFormat.links : PivotLinkFormat.tabs,
          items = state.items.map(({ name, label, icon }) => (
            <PivotItem key={name} itemKey={name} headerText={label} itemIcon={icon} />
          ))
        return <Pivot linkFormat={linkFormat} onLinkClick={onLinkClick}>{items}</Pivot>

      }
    return { render, changed }
  })

cards.register('tab', View)
