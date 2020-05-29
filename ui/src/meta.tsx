import React from 'react';
import { cards } from './layout';
import { on, bond, Card, Rec, S, Packed, telesync, unpack } from './telesync';


interface State {
  title?: S
  args?: Packed<Rec>
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      init = () => {
        const { title, args } = state
        console.log(title, args)
        if (title) window.document.title = title
        if (args) telesync.argsB(unpack(args))
      },
      render = () => (<>{null}</>)
    on(changed, init)
    return { init, render }
  })


cards.register('meta', View)

