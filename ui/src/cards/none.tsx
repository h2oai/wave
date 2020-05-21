import React from 'react';
import { Card } from '../delta';
import { cards } from '../grid';
import bond from '../bond';

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