// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { FontIcon } from '@fluentui/react'
import { Model, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { clas, cssVar } from './theme'
import { bond, jump } from './ui'

/**
 * Render a card displaying a table of stats.
 */
interface State {
  /** The title. */
  title: S
  /** The names of this table's columns. */
  columns: S[]
  /** The rows displayed in this table. */
  items: StatTableItem[]
  // TODO optional data for buffer-based rendering.
  /** An optional name for this item. */
  name?: S
  /** The subtitle, displayed below the title. */
  subtitle?: S
}

/** Create a stat item (a label and a set of values) for stat_table_card. */
export interface StatTableItem {
  /** The label for the row. */
  label: S
  /** The values displayed in the row. */
  values: S[]
  /** An optional name for this row (required only if this row is clickable). */
  name?: S
  /** The caption for the metric, displayed below the label. */
  caption?: S
  /** An optional icon, displayed next to the label. */
  icon?: S
  /** The color of the icon. */
  icon_color?: S
  /** List of colors used for each value in values ordered respectively. */
  colors?: S[]
}

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: 15,
      // HACK: for some reason, the overflow on 'items' does not take effect without this line.
      overflow: 'auto',
    },
    items: {
      flexGrow: 1,
      overflow: 'auto',
      marginTop: '1em',
    },
    table: {
      borderSpacing: 0,
      width: '100%',
      $nest: {
        tbody: {
          $nest: {
            th: {
              borderTop: '1px solid #ddd',
              textAlign: 'left',
              padding: '0.5em 1em 0.5em 0',
            },
            td: {
              borderTop: '1px solid #ddd',
              padding: '0.5em 0 0.5em 1em',
            },
          },
        },
        td: {
          textAlign: 'right',
          verticalAlign: 'top',
        }
      }
    },
    thead: {
      opacity: 0.4,
      $nest: {
        th: {
          textAlign: 'right',
          width: '1%',
          whiteSpace: 'nowrap',
          padding: '0.5em 0 0.5em 1em',
        },
        'th:first-child': {
          textAlign: 'left',
          width: '100%',
          padding: '0.5em 1em 0.5em 0',
        }
      },
    },
    header: {
      display: 'flex',
    },
    caption: {
      opacity: 0.7,
    },
    icon: {
      padding: '0.2em 0.5em 0em 0.1em',
    },
    clickable: {
      cursor: 'pointer',
      $nest: {
        '&:hover': {
          backgroundColor: cssVar('$themeLighter'),
          color: cssVar('$themeDarker')
        }
      },
    },
  })

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        const
          { name: tableName, title, columns, subtitle, items } = state,
          header = columns.map((label, i) => (
            <th key={`${i}:${label}`}>{label}</th>
          )),
          rows = items.map(({ name: rowName, label, values, caption, icon, icon_color, colors }, i) => {
            const
              onClick = rowName ? () => jump(tableName, rowName) : undefined,
              cells = values.map((value, j) => (<td key={`${j}:${value}`} style={colors && colors[j] ? { color: cssVar(colors[j]) } : undefined}>{value}</td>))

            return (
              <tr key={rowName ?? `${i}:${label}`} className={onClick ? css.clickable : undefined} onClick={onClick}>
                <th key='label'>
                  <div className={css.header}>
                    {icon && <div className={css.icon} style={icon_color ? { color: cssVar(icon_color) } : undefined}>
                      <FontIcon iconName={icon} />
                    </div>}
                    <div>
                      <div className='wave-w6'>{label}</div>
                      {caption && <div className={clas(css.caption, 'wave-s12 wave-w4')}>{caption}</div>}
                    </div>
                  </div>
                </th>
                {cells}
              </tr>
            )
          })

        return (
          <div data-test={name} className={css.card}>
            <div className='wave-s12 wave-w6'>{title}</div>
            {subtitle && <div className='wave-s12'>{subtitle}</div>}
            <div className={css.items}>
              <table className={clas(css.table, 'wave-s13')}>
                <thead className={clas(css.thead, 'wave-w6')}>
                  <tr>{header}</tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('stat_table', View)





