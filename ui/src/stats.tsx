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

import React from 'react'
import { stylesheet } from 'typestyle'
import { S } from './qd'
import { getTheme } from './theme'

/** Create a set of stats laid out horizontally. */
export interface Stats {
  /** The individual stats to be displayed. */
  items: Stat[]
}

/** Create a stat (a label-value pair) for displaying a metric. */
export interface Stat {
  /** The label for the metric. */
  label: S
  /** The value of the metric. */
  value: S
}

const
  theme = getTheme(),
  css = stylesheet({
    stats: {
      display: 'flex'
    },
    stat: {
      marginRight: '2em'
    },
    statLabel: {
      ...theme.font.s12,
      ...theme.font.w5,
    },
    statValue: {
      ...theme.font.s24,
      ...theme.font.w3,
    },
  })

export const
  XStats = ({ model: m }: { model: Stats }) => {
    const stats = m.items.map(({ label, value }, i) => (
      <div key={`${i}:${label}`} className={css.stat}>
        <div className={css.statLabel}>{label}</div>
        <div className={css.statValue}>{value}</div>
      </div>
    ))
    return (
      <div className={css.stats}>{stats}</div>
    )
  }