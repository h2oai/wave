import React from 'react';
import { Card, Data, Rec, S } from '../delta';
import { cards, Repeat } from '../grid';
import bond from '../bond';

interface Opts {
  title: S
  item_view: S
  item_props: S | Rec
  data: S | Data
}

type State = Partial<Opts>

const defaults: State = {
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = { ...defaults, ...state } as Opts
        return (
          <div>
            <Repeat view={s.item_view} props={s.item_props} data={s.data} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('repeat', View)
