import React from 'react';
import { bond, Card } from './qd';
import { cards } from './layout';

const
  View = bond(({ state, changed }: Card<{}>) => {
    const
      render = () => (
        <div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )
    return { render, changed }
  })

cards.register('', View)