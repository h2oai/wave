import React from 'react';
import { cards } from './layout';
import { bond, Card, on, S } from './telesync';


/**
 * Represents page-global state.
 *
 * This card is invisible.
 * It is used to control attributes of the active page.
*/
interface State {
  /** The title of the page. */
  title?: S
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      init = () => {
        const { title } = state
        if (title) window.document.title = title
      },
      render = () => (<></>)
    on(changed, init)
    return { init, render }
  })


cards.register('meta', View)

