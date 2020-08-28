import React from 'react';
import { bond, Card } from './qd';
import { cards } from './layout';

export const
  View = bond(({ state, changed }: Card<{}>) => {
    const
      render = () => (
        <div data-test='none'>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )
    return { render, changed }
  })

cards.register('', View)