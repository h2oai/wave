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
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      init = () => {
        const { title, refresh } = state
        if (title) window.document.title = title
        if (typeof refresh === 'number') telesync.refreshRateB(refresh)
      },
      render = () => (<></>)
    on(changed, init)
    return { init, render }
  })


cards.register('meta', View)

