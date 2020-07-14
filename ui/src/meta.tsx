import React from 'react';
import { cards } from './layout';
import { bond, Card, on, S, U, telesync } from './telesync';

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
  /** Notification text that appears in the right top corner. */
  notification?: S
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      init = () => {
        const { title, refresh } = state
        if (title) window.document.title = title
        if (typeof refresh === 'number') telesync.refreshRateB(refresh)
        if (state.notification) showNotification(state.notification)
      },
      showNotification = async (notificationText: string) => {
        // TODO: Decide on fallback when user's browser does not support Notification API.
        if (!('Notification' in window)) return
        else if (Notification.permission === 'granted') new Notification(notificationText)
        else if (Notification.permission !== 'denied') {
          if (await Notification.requestPermission() === 'granted') new Notification(notificationText)
        }
      },
      render = () => (<></>)
    on(changed, init)
    return { init, render }
  })


cards.register('meta', View)

