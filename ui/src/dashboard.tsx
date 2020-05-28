import React from 'react';
import { cards } from './grid';
import { bond, Card, S } from './telesync';
import { Cell, Command } from './shared';

interface DashboardPanel {
  cells: Cell[]
  size: S
  commands: Command[]
  data: S
}

interface DashboardRow {
  panels: DashboardPanel[]
  size: S
}

interface DashboardPage {
  title: S
  rows: DashboardRow[]
}

interface State {
  pages: DashboardPage[]
}

const
  View = bond(({ changed }: Card<State>) => {
    const render = () => <div />
    return { render, changed }
  })

cards.register('dashboard', View)
