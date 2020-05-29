import React from 'react';
import { cards } from './layout';
import { bond, Card, S } from './telesync';
import { Cell, Command } from './notebook';

/**
 * Create a dashboard panel.
 */
interface DashboardPanel {
  /** A list of cells to display in the panel (top to bottom). */
  cells: Cell[]
  /** The absolute or relative width of the panel. */
  size?: S
  /** A list of custom commands to allow on this panel. */
  commands?: Command[]
  /** Data associated with this section, if any. */
  data?: S
}

/**
 * Create a dashboard row.
 */
interface DashboardRow {
  /** A list of panels to display in the row (left to right). */
  panels: DashboardPanel[]
  /** The absolute or relative height of the row. */
  size?: S
}

/**
 * Create a dashboard page.
 */
interface DashboardPage {
  /** The text displayed on the page's tab. */
  title: S
  /** A list of rows to display in the dashboard page (top to bottom). */
  rows: DashboardRow[]
}

/**
 * Create a dashboard.
 *
 * A dashboard consists of one or more pages.
 * The dashboard is displayed as a tabbed layout, with each tab corresponding to a page.
 *
 * A dashboard page consists of one or more rows, laid out top to bottom.
 * Each dashboard row in turn contains one or more panels, laid out left to right.
 * Each dashboard panel in turn conttains one or more cells, laid out top to bottom.
 *
 * Dashboard rows and panels support both flexible and fixed sizing.
 *
 * For flexible sizes, specify an integer without units, e.g. '2', '5', etc. These are interpreted as ratios.
 *
 * For fixed sizes, specify the size with units, e.g. '200px', '2vw', etc.
 * The complete list of units can be found at https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
 *
 * You can combine fixed and flexible sizes to make your dashboard responsive (adjust to different screen sizes).
 *
 * Examples:
 * Two panels with sizes '3', '1' will result in a 3:1 split.
 * Three panels with sizes '300px', '1' and '300px' will result in a an expandable center panel in between two 300px panels.
 * Four panels with sizes '200px', '400px', '1', '2' will result in two fixed-width panels followed by a 1:2 split.
 */
interface State {
  /** A list of pages contained in the dashboard. */
  pages: DashboardPage[]
}

const
  View = bond(({ changed }: Card<State>) => {
    const render = () => <div />
    return { render, changed }
  })

cards.register('dashboard', View)
