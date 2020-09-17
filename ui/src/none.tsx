import React from 'react'
import { bond, Card, S } from './qd'
import { cards } from './grid_layout'

export const
  View = bond(({ state, changed }: Card<Record<S, unknown>>) => {
    const
      render = () => (
        <div data-test='none'>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )
    return { render, changed }
  })

cards.register('', View)