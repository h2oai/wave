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


import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { ProgressArc } from './parts/progress_arc'
import { F, S } from './qd'
import { font, cssVar } from './theme'

const
  css = stylesheet({
    container: {
      position: 'relative',
      width: 50,
      height: 50
    },
    percentContainer: {
      position: 'absolute',
      top: 0, left: 0, bottom: 0, right: 0
    },
    percent: {
      ...font.s12,
      opacity: 0.5,
    },
  })

/**
 * Create a cell type that renders a column's cells as progress bars instead of plain text.
 * If set on a column, the cell value must be between 0.0 and 1.0.
*/
export interface ProgressTableCellType {
  /** Color of the progress arc. */
  color?: S
  /** An identifying name for this component. */
  name?: S
}

export const XProgressTableCellType = ({ model: m, progress }: { model: ProgressTableCellType, progress: F }) => (
  <div data-test={m.name} className={css.container}>
    <ProgressArc thickness={2} color={cssVar(m.color as any, 'red')} value={progress} />
    <Fluent.Stack horizontalAlign='center' verticalAlign='center' className={css.percentContainer}>
      <div className={css.percent}>{`${Math.round(progress * 100)}%`}</div>
    </Fluent.Stack>
  </div>
)