import React from 'react';
import { cards } from './layout';
import { bond, Card, S, U } from './telesync';

/**
 * Create a reference to a data source.
 */
export interface DataSource {
  /** The type of the data source. */
  t: 'table' | 'view'
  /** The ID of the data source */
  id: U
}

/**
 * Create a stored query.
 */
export interface DataSourceQuery {
  /** The SQL query. */
  sql: S
  /** The data sources referred to in the SQL query. */
  sources: DataSource[]
}

/**
 * Create a heading cell.
 *
 * A heading cell is rendered as a HTML heading (H1 to H6).
 */
export interface HeadingCell {
  /** The heading level (between 1 and 6) */
  level: U
  /** The heading text. */
  content: S
}

/**
 * Create a markdown cell.
 *
 * A markdown cell is rendered using Github-flavored markdown.
 * HTML markup is allowed in markdown content.
 * URLs, if found, are displayed as hyperlinks.
 * Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.
 */
export interface MarkdownCell {
  /** The markdown content of this cell. */
  content: S
}

/**
 * Create a frame cell
 *
 * A frame cell is rendered as in inline frame (iframe) element.
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/length for `width` and `height` parameters.
 */
export interface FrameCell {
  /** The HTML content of the frame. */
  source: S
  /** The CSS width of the frame. */
  width: S
  /** The CSS height of the frame. */
  height: S
}

/**
 * Create a VegaLite cell.
 */
export interface VegaCell {
  /** The VegaLite specification. */
  specification: S
  /** The query to be executed to populate this visualization. */
  query: DataSourceQuery
}

/**
 * Create a cell.
 */
export interface Cell {
  /** A heading cell. */
  heading?: HeadingCell
  /** A markdown cell. */
  markdown?: MarkdownCell
  /** A frame cell. */
  frame?: FrameCell
  /** A vega cell. */
  vega?: VegaCell
}

/**
 * Create a command.
 *
 * Commands are typically displayed as context menu items associated with
 * parts of notebooks or dashboards.
 */
export interface Command {
  /** An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed. */
  name: S
  /** The text displayed for this command. */
  label?: S
  /** The caption for this command (typically a tooltip). */
  caption?: S
  /** The icon to be displayed for this command. */
  icon?: S
  /** Sub-commands, if any */
  items?: Command[]
  /** Data associated with this command, if any. */
  data?: S
}

/**
 * Create a notebook section.
 *
 * A notebook section is rendered as a sequence of cells.
 */
export interface NotebookSection {
  /** A list of cells to display in this notebook section. */
  cells: Cell[]
  /** A list of custom commands to allow on this section. */
  commands?: Command[]
  /** Data associated with this section, if any. */
  data?: S
}

/**
 * Create a notebook.
 *
 * A notebook is rendered as a sequence of sections.
 */
interface State {
  /** A list of sections to display in the notebook. */
  sections: NotebookSection[]
}

const
  View = bond(({ changed }: Card<State>) => {
    const render = () => <div />
    return { render, changed }
  })

cards.register('notebook', View)
