import React from 'react'
import { cards, Repeat } from './grid_layout'
import { bond, Card, Rec, S, Data } from './qd'

/**
 * EXPERIMENTAL. DO NOT USE.
 * Create a card containing other cards.
 **/
interface State {
  /** EXPERIMENTAL. DO NOT USE. */
  item_view: S
  /** The child card properties. */
  item_props: Rec
  /** Data for this card. */
  data: Data
}

export const
  View = bond(({ state: s, changed }: Card<State>) => {
    const
      render = () => (
        <div data-test='repeat'>
          <Repeat view={s.item_view} props={s.item_props} data={s.data} />
        </div>
      )
    return { render, changed }
  })

cards.register('repeat', View)
