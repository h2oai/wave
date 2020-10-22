import * as Fluent from '@fluentui/react'
import React from 'react'
import { cards } from './layout'
import { bond, box, Card, qd, S } from './qd'

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
 * 
 * If items is an empty array, the automatic mode is activated. This means
 * breadcrumbs will be generated automatically based on current url. 
 *
 * Multiple routes should be separated by "/". E.g. /main/sub/susub generates Main -> Sub -> Subsub breadcrumb.
 * Multi word route names should be separated by "-". E.g. /long-word/sub-route generates Long Word -> Sub Route.
 */
interface State {
  /** A list of `h2o_wave.types.Breadcrumb` instances to display. See `h2o_wave.ui.breadcrumb()` */
  items: Breadcrumb[]
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
      autoMode = !state.items.length,
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
        if (autoMode) {
          window.addEventListener('hashchange', onHashChanged)
          onHashChanged()
        } else itemsB(state.items.map(mapToBreadcrumb))
      },
      render = () => <Fluent.Breadcrumb data-test={name} styles={{ itemLink: { textTransform: 'capitalize' } }} items={itemsB()} />,
      dispose = () => { if (autoMode) window.removeEventListener('hashchange', onHashChanged) }

    return { init, render, changed, itemsB, dispose }
  })

cards.register('breadcrumbs', View)
