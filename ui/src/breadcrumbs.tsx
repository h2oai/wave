import { Breadcrumb } from '@fluentui/react';
import React from 'react';
import { cards } from './layout';
import { bond, Card, S, qd } from './qd';

/** Create a breadcrumb for a `h2o_q.types.BreadcrumbsCard()`. */
interface Breadcrumb {
  /** The name of this item. Prefix the name with a '#' to trigger hash-change navigation. */
  name: S
  /** The label to display. */
  label: S
}
/**
 * Create a card containing breadcrumbs.
 * Breadcrumbs should be used as a navigational aid in your app or site.
 * They indicate the current page’s location within a hierarchy and help
 * the user understand where they are in relation to the rest of that hierarchy.
 * They also afford one-click access to higher levels of that hierarchy. 
 * Breadcrumbs are typically placed, in horizontal form, under the masthead 
 * or navigation of an experience, above the primary content area.
 */
interface State {
  /** A list of `h2o_q.types.Breadcrumb` instances to display. See `h2o_q.ui.breadcrumb()` */
  items: Breadcrumb[]
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
