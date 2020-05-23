import React from 'react';
import bond from '../bond';
import { Card, S } from '../delta';
import { cards } from '../grid';
import { Cell, Command } from './shared';

interface Panel {
  cells: Cell[]
  size: S
  commands: Command[]
  data: S
}

interface Row {
  panels: Panel[]
  size: S
}

interface Page {
  title: S
  rows: Row[]
}

interface State {
  pages: Page[]
}

const
  View = bond(({ changed }: Card<State>) => {
    const render = () => <div />
    return { render, changed }
  })

cards.register('dashboard', View)
