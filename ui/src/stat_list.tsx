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
import { clas, getTheme } from './theme'


/**
 * Render a card displaying a list of stats.
 */
interface State {
  /** The title. */
  title: S
  /** The individual stats to be displayed. */
  items: StatListItem[]
  // TODO optional data for buffer-based rendering.
  /** An optional name for this item. */
  name?: S
  /** The subtitle, displayed below the title. */
  subtitle?: S
}

/** Create a stat item (a label-value pair) for stat_list_card. */
export interface StatListItem {
  /** The label for the metric. */
  label: S
  /** An optional name for this item (required only if this item is clickable). */
  name?: S
  /** The caption for the metric, displayed below the label. */
  caption?: S
  /** The primary value of the metric. */
  value?: S
  /** The font color of the primary value. */
  value_color?: S
  /** The auxiliary value, displayed below the primary value. */
  aux_value?: S
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
      overflow: 'auto',
      flexGrow: 1,
      marginTop: '1em',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #ddd',
      padding: '0.5em 0',
      $nest: {
        '&:last-child': {
          borderBottom: 'none'
        }
      }
    },
    icon: {
      padding: '0.2em 0.5em 0em 0.1em',
    },
    lhs: {
      flexGrow: 1,
    },
    rhs: {
      textAlign: 'right'
    },
    label: {
      ...theme.font.s13,
      ...theme.font.w6,
    },
    caption: {
      ...theme.font.s12,
      opacity: 0.7,
    },
    value: {
      ...theme.font.s13,
      ...theme.font.w6,
    },
    auxValue: {
      ...theme.font.s12,
      opacity: 0.7,
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
          { name: listName, title, subtitle, items } = state,
          list = items.map(({ name: itemName, label, caption, value, value_color, aux_value, icon, icon_color }, i) => {
            const
              onClick = itemName ? () => qd.jump(listName, itemName) : undefined
            return (
              <div key={itemName ?? `${i}:${label}`} className={onClick ? clas(css.item, css.clickable) : css.item} onClick={onClick}>
                { icon && <div className={css.icon} style={icon_color ? { color: theme.color(icon_color) } : undefined}><FontIcon iconName={icon} /></div>}
                <div className={css.lhs}>
                  <div className={css.label}>{label}</div>
                  {caption && <div className={css.caption}>{caption}</div>}
                </div>
                <div className={css.rhs}>
                  {value && (
                    <div className={css.value} style={value_color ? { color: theme.color(value_color) } : undefined}>{value}</div>
                  )}
                  {aux_value && <div className={css.auxValue}>{aux_value}</div>}
                </div>
              </div>
            )
          })

        return (
          <div data-test={name} className={css.card}>
            <div className={css.title}>{title}</div>
            { subtitle && <div className={css.subtitle}>{subtitle}</div>}
            <div className={css.items}>
              {list}
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('stat_list', View, CardEffect.Normal)




