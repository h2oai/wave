import React from 'react';
import { cards } from '../grid';
import { bond, Card, S } from '../telesync';
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
