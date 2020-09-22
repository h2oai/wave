import React from 'react'
import { cards } from './layout'
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
}

export const
  View = bond(({ state, changed }: Card<State>) => {
    const
      init = () => {
        const { title, refresh, notification, redirect } = state
        if (title) window.document.title = title
        if (typeof refresh === 'number') qd.refreshRateB(refresh)
        if (notification) showNotification(notification)
        if (redirect) {
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
      },
      render = () => (<></>)
    on(changed, init)
    return { init, render }
  })


cards.register('meta', View)

