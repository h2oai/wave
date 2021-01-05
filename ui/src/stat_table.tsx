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
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { bond, Card, qd, S } from './qd'
import { getTheme } from './theme'


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
}

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: 15,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    subtitle: {
      ...theme.font.s12,
    },
    items: {
      flexGrow: 1,
      overflow: 'auto',
      marginTop: '1em',
    },
    table: {
      ...theme.font.s13,
      borderSpacing: 0,
      width: '100%',
      $nest: {
        thead: {
          ...theme.font.w6,
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
    header: {
      display: 'flex',
    },
    label: {
      ...theme.font.w6,
    },
    caption: {
      ...theme.font.s12,
      ...theme.font.w4,
      opacity: 0.7,
    },
    icon: {
      padding: '0.2em 0.5em 0em 0.1em',
    },
    clickable: {
      cursor: 'pointer',
      $nest: {
        '&:hover': {
          backgroundColor: '#fafafa',
        }
      },
    },
  })

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          { name: tableName, title, columns, subtitle, items } = state,
          header = columns.map((label, i) => (
            <th key={`${i}:${label}`}>{label}</th>
          )),
          rows = items.map(({ name: rowName, label, values, caption, icon, icon_color }, i) => {
            const
              onClick = rowName ? () => qd.jump(tableName, rowName) : undefined,
              cells = values.map((value, j) => (<td key={`${j}:${value}`}>{value}</td>))

            return (
              <tr key={rowName ?? `${i}:${label}`} className={onClick ? css.clickable : undefined} onClick={onClick}>
                <th key='label'>
                  <div className={css.header}>
                    {icon && <div className={css.icon} style={icon_color ? { color: theme.color(icon_color) } : undefined}>
                      <FontIcon iconName={icon} />
                    </div>}
                    <div>
                      <div className={css.label}>{label}</div>
                      {caption && <div className={css.caption}>{caption}</div>}
                    </div>
                  </div>
                </th>
                {cells}
              </tr>
            )
          })

        return (
          <div data-test={name} className={css.card}>
            <div className={css.title}>{title}</div>
            { subtitle && <div className={css.subtitle}>{subtitle}</div>}
            <div className={css.items}>
              <table className={css.table}>
                <thead>
                  <tr>
                    {header}
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('stat_table', View, CardEffect.Normal)





