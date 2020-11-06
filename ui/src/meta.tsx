import React from 'react'
import { cards, Grid, gridsB } from './layout'
import { bond, Card, on, S, U, qd } from './qd'
import { showNotification } from './notification'

/**
 * Represents page-global state.
 *
 * This card is invisible.
 * It is used to control attributes of the active page.
*/
interface State {
  /** The title of the page. */
  title?: S
  /** Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use). */
  refresh?: U
  /** Display a desktop notification to the user. */
  notification?: S
  /** Redirect the page to a new URL. */
  redirect?: S
  /** Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers). */
  icon?: S
  /** The layout grids for the page. */
  grids?: Grid[]
}

export const
  View = bond(({ state, changed }: Card<State>) => {
    const
      init = () => {
        const { title, icon, refresh, notification, redirect, grids } = state

        if (title) {
          delete state.title
          window.document.title = title
        }

        if (icon) {
          delete state.icon
          const
            iconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement,
            touchIconLink = document.querySelector("link[rel*='apple-touch-icon']") as HTMLLinkElement
          if (iconLink) iconLink.href = icon
          if (touchIconLink) touchIconLink.href = icon
        }

        if (typeof refresh === 'number') {
          delete state.refresh
          qd.refreshRateB(refresh)
        }

        if (notification) {
          delete state.notification
          showNotification(notification)
        }

        if (redirect) {
          delete state.redirect
          try {
            const url = new URL(redirect)
            if (redirect === url.hash) {
              window.location.hash = redirect
            } else {
              window.location.replace(redirect)
            }
          } catch (e) {
            console.error(`Could not redirect: ${redirect} is an invalid URL`)
          }
        }

        if (grids) {
          delete state.grids
          gridsB(grids)
        }

      },
      render = () => (<></>)

    on(changed, init)

    return { init, render }
  })


cards.register('meta', View)

