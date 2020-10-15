import * as Fluent from '@fluentui/react'
import React from 'react'
import { cards } from './layout'
import { B, bond, Card, qd, S, box } from './qd'

/** Create a breadcrumb for a `h2o_wave.types.BreadcrumbsCard()`. */
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
  /** A list of `h2o_wave.types.Breadcrumb` instances to display. See `h2o_wave.ui.breadcrumb()` */
  items: Breadcrumb[]
  /** Turn off automatic breadcrumbs generator based on current URL.` */
  auto?: B
}

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      mapToBreadcrumb = ({ name, label }: Breadcrumb) => ({
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
      }),
      itemsB = box<Fluent.IBreadcrumbItem[]>([]),
      onHashChanged = () => {
        const items = window.location.hash.substr(1)
          .split('/')
          .map((url, i, urls) => {
            const
              basePath = urls.slice(0, i).join('/'),
              name = basePath ? `#${basePath}/${url}` : `#${url}`

            return mapToBreadcrumb({ name, label: url.replace(/-/g, ' ') })
          })

        itemsB(items)
      },
      init = () => {
        if (state.auto) {
          window.addEventListener('hashchange', onHashChanged)
          onHashChanged()
        } else itemsB(state.items.map(mapToBreadcrumb))
      },
      render = () => <Fluent.Breadcrumb data-test={name} styles={{ itemLink: { textTransform: 'capitalize' } }} items={itemsB()} />,
      dispose = () => { if (state.auto) window.removeEventListener('hashchange', onHashChanged) }

    return { init, render, changed, itemsB, dispose }
  })

cards.register('breadcrumbs', View)
