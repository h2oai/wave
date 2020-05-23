import React from 'react';
import bond from '../bond';
import { Card, S } from '../delta';
import { cards } from '../grid';
import { Cell, Command } from './shared';

export interface Section {
  cells: Cell[]
  commands: Command[]
  data: S
}

interface State {
  sections: Section[]
}

const
  View = bond(({ changed }: Card<State>) => {
    const render = () => <div />
    return { render, changed }
  })

cards.register('notebook', View)
