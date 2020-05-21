import React from 'react';
import { Card, Data, Rec, S } from '../delta';
import { cards, Repeat } from '../grid';
import bond from '../bond';

interface State {
  title: S
  item_view: S
  item_props: S | Rec
  data: S | Data
}

const defaults: Partial<State> = {
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = { ...defaults, ...state } as State
        return (
          <div>
            <Repeat view={s.item_view} props={s.item_props} data={s.data} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('repeat', View)
