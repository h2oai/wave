import React from 'react';
import { cards } from './grid';
import { bond, Card, S } from './telesync';
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
