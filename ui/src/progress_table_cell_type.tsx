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
import { F, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { ProgressArc } from './parts/progress_arc'
import { ProgressBar } from './parts/progress_bar'
import { clas, cssVar } from './theme'

const
  css = stylesheet({
    barContainer: {
      position: 'relative',
      display: 'inline-flex',
      width: 100,
    },

    spinnerContainer: {
      position: 'relative',
      display: 'inline-flex',
      width: 100,
      height: 50
    },
    
    bar: {
      position: 'absolute',
      top: '50%', left: 0,
      width: 50,
    },

    spinner: {
      position: 'absolute',
      top: 0, left: 0, bottom: 0, right: 0,
      width: 50,
      height: 50
    },
   
    barPercent: {
      position: 'absolute',
      top: 0, left: 0, bottom: 0, right: 0,
    },

    percent: {
      color: cssVar('$text6')
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
  /**  The type of progress cell to be displayed. One of 'bar', 'spinner'. Defaults to 'spinner'. */
  type?: 'bar' | 'spinner'
}

export const XProgressTableCellType = ({ model: m, progress }: { model: ProgressTableCellType, progress: F }) => (
  <div data-test={m.name}>
    {m.type === 'bar' ? (
      <div className={css.barContainer}>
        <div className={css.bar}>
          <ProgressBar thickness={2} color={cssVar(m.color || '$red')} value={progress} />
        </div>
        <Fluent.Stack horizontalAlign='end' verticalAlign='center' className={clas(css.barPercent, 'wave-s12')}>
          <div className={css.percent}>{`${Math.round(progress * 100)}%`}</div>
        </Fluent.Stack> 
      </div>
    ) : (
      <div className={css.spinnerContainer}>
        <div className={css.spinner}> 
          <ProgressArc thickness={2} color={cssVar(m.color || '$red')} value={progress} />
        </div>
        <Fluent.Stack horizontalAlign='center' verticalAlign='center' className={clas(css.spinner, 'wave-s12')}>
          <div className={css.percent}>{`${Math.round(progress * 100)}%`}</div>
        </Fluent.Stack>
      </div>
    )}
  </div>
)
