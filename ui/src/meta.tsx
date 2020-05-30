import React from 'react';
import { cards } from './layout';
import { bond, Card, on, Packed, Rec, S, telesync, unpack } from './telesync';


/**
 * Represents page-global state.
 *
 * This card is invisible.
 * It is used to control attributes of the active page.
*/
interface State {
  /** The title of the page. */
  title?: S
  /** Form data. */
  args?: Packed<Rec>
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      init = () => {
        const { title, args } = state
        if (title) window.document.title = title
        if (args) {
          const
            a = telesync.args,
            b = unpack<Rec>(args)
          for (const k in a) delete a[k]
          for (const k in b) a[k] = b[k]
        }
      },
      render = () => (<>{null}</>)
    on(changed, init)
    return { init, render }
  })


cards.register('meta', View)

