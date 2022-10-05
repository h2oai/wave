
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { XImage } from './image'
import { cards } from './layout'
import { bond } from './ui'

const css = stylesheet({
  container: {
    display: 'flex',
    gap: 20,
    padding: 20,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
})

export interface State {
  /** Images */
  images: GridImage[]
  width?: S
  height?: S
}

export interface GridImage {
  title: S
  path: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const rowHeight = 90 // random number, docs says 76 but usually it's more than that
  const rows = state.box.substring(6)
  const viewportHeight = rowHeight * rows

  const shouldRenderImage = () => true


  const render = () => {
      return (
        <div data-test={name} className={css.container}>
          {state.images?.length && state.images.map((i, idx) =>
            (
              <div key={idx} style={{ height: state.height }}>
                <img width={state.width} height={state.height} style={{ flex: `0 0 ${state.width}px`, objectFit: 'contain' }}  src={i.path} /> 
              </div>
            )
          )}
        </div >
      )
    }
    return { render, changed }
})

cards.register('image_grid', View)