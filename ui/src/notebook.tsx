import React from 'react';
import { cards } from './grid';
import { bond, Card, S } from './telesync';
import { Cell, Command } from './shared';

export interface NotebookSection {
  cells: Cell[]
  commands: Command[]
  data: S
}

interface State {
  sections: NotebookSection[]
}

const
  View = bond(({ changed }: Card<State>) => {
    const render = () => <div />
    return { render, changed }
  })

cards.register('notebook', View)
