import { Breadcrumb } from '@fluentui/react';
import React from 'react';
import { cards } from './layout';
import { bond, Card, S, qd } from './qd';

/** Create a breadcrumb item. */
interface BreadcrumbItem {
  /** The name of this item. Prefix the name with a '#' to trigger hash-change navigation. */
  name: S
  /** The label to display. */
  label: S
}
/** Create a card containing navigation breadcrumbs. */
interface State {
  /** Items to render. */
  items: BreadcrumbItem[]
}

export const
  View = bond(({ state, changed }: Card<State>) => {
    const
      items = state.items.map(({ name, label }) => ({
        key: name,
        text: label,
        onClick: () => {
          if (name.startsWith('#')) {
            window.location.hash = name.substr(1)
            return
          }
          qd.args[name] = true
          qd.sync()
        }
      }
      )),
      render = () => <Breadcrumb items={items} />

    return { render, changed }
  })

cards.register('breadcrumbs', View)
