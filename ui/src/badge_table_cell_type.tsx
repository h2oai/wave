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

import { S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, getContrast, padding } from './theme'


/** 
 * Creates a collection of badges, usually used for rendering state values.
 * In case of multiple badges per row, make sure the row values are
 * separated by "," within a single cell string.
 * E.g. ui.table_row(name="...", cells=["cell1", "BADGE1,BADGE2"]).
 * Each value should correspond to a `ui.badge.label` attr.
 * For the example above: [
 *  ui.badge(label="BADGE1", color="red"),
 *  ui.badge(label="BADGE2", color="green"),
 * ]
 */
export interface BadgeTableCellType {
  /** An identifying name for this component. */
  name: S
  /** Badges to be rendered. */
  badges?: Badge[]
}

/**
 * Create a badge.
 */
export interface Badge {
  /** The text displayed within the badge. */
  label: S
  /** Badge's background color. */
  color: S
  /** Badge's label color. If not specified, black or white will be picked based on correct contrast with background. */
  label_color?: S
}
const css = stylesheet({
  badge: {
    borderRadius: 4,
    padding: padding(4, 16),
    '&:not(:first-child)': {
      marginLeft: 8
    }
  }
})

export const XBadgeTableCellType = ({ model, serializedBadges }: { model: BadgeTableCellType, serializedBadges: S }) => {
  const
    mapBadges = ((v: S, i: U) => {
      const
        badge = model.badges?.find(({ label: label }) => label === v),
        badgeColor = badge?.color || '$text',
        background = cssVar(badgeColor),
        color = cssVar(badge?.label_color || getContrast(badgeColor))

      return <span key={i} style={{ background, color }} className={clas(css.badge, 'wave-s12 wave-w6')}>{v}</span>
    })
  return <div data-test={model.name}>{serializedBadges.split(',').map(mapBadges)}</div>
}
