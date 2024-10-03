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

import { F, S, U } from '../core'
import React from 'react'
import { stylesheet } from 'typestyle'

const css = stylesheet({
  body: {
    position: 'relative',
  },
  rail: {
    position: 'absolute',
    width: '100%',
    opacity: 0.15,
  },
  bar: {
    position: 'absolute',
  }
})

interface Props {
  thickness: U
  color: S
  value: F
  name?: S
}

export const ProgressBar = ({ thickness, color, value }: Props) => {
  return (
    <div className={css.body} style={{ height: thickness }}>
      <div className={css.rail} style={{ height: thickness, backgroundColor: color }} />
      <div className={css.bar} style={{ width: `${Math.round(value * 100)}%`, height: thickness, backgroundColor: color }} />
    </div>
  )
}
