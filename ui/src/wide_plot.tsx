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

import { Model, Rec, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { Plot, XVisualization } from './plot'
import { clas, cssVar, pc } from './theme'
import { bond } from './ui'

const css = stylesheet({
  card: {
    display: 'flex',
    padding: 24
  },
  lhs: {
    marginTop: -5,
    marginRight: 16,
    width: pc(35)
  },
  rhs: {
    width: pc(65),
    flexGrow: 1,
    display: 'flex',
  },
  title: {
    color: cssVar('$neutralPrimary'),
    marginBottom: 13
  },
})

/** Create a wide plot card displaying a title, caption and a plot. */
interface State {
  /** The card's title. */
  title: S
  /** The card's caption, displayed below the title. */
  caption: S
  /** The card's plot. */
  plot: Plot
  /** The card's plot data. */
  data: Rec
  /** An optional name for this component. */
  name?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => {
    const { title, caption, data, plot } = state
    return (
      <div data-test={name} className={css.card}>
        <div className={css.lhs}>
          <div className={clas('wave-s20 wave-w5 wave-t9', css.title)}>{title}</div>
          {caption && <div className='wave-s14 wave-w4 wave-t7'>{caption}</div>}
        </div>
        <div className={css.rhs}><XVisualization model={{ data, plot }} /></div>
      </div>
    )
  }

  return { render, changed }
})

cards.register('wide_plot', View)