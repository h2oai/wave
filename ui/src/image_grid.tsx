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

import { Id, Model, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { Image } from './image'
import { bond } from './ui'

const
  css = stylesheet({
    imageGridDiv: {
      position: 'relative',
      boxSizing: 'border-box'
    },
    imageGridSpan: {
      // TODO: add styling
    },
    imageGridImage: {
      // TODO: add styling
    }
  })

/** Create a card that displays a grid of base64-encoded images. */
interface State {
  /** An identifying name for this component. */
  name: Id
  /** Number of columns in the grid. */
  cols: U
  /** List of images to be displayed. */
  images: Image[]
  /** Width of the grid. */
  width?: S
  /** Height of the grid. */
  height?: S
}

export const
  XImageGrid = ({ model: m }: { model: State }) => {
    const { name, width, height, cols, images } = m
    const rows = Math.ceil(images.length / cols)
    let cardWidth = Math.floor(100 / cols)
    let cardHeight = Math.floor(100 / rows)
    if (typeof width != 'undefined') {
      cardWidth = Math.floor(parseInt(width) / cols)
    }
    if (typeof height != 'undefined') {
      cardHeight = Math.floor(parseInt(height) / rows)
    }
    return <div 
      className={css.imageGridDiv}
      id={`%image_grid_${name}%`}>
      {
        images.map ((image : Image, i : U) => {
            const currentRow = Math.floor(i / cols)
            const currentCol = i % cols
            return <span 
              key={i}
              className={css.imageGridSpan}
              style={{
                top: currentRow * cardHeight,
                left: currentCol * cardWidth,
                width: cardWidth,
                height: cardHeight,
              }}>
              <img
                className={css.imageGridImage}
                alt={image.title}
                src={image.path}
              />
            </span>
          }
        )
      }
    </div>
  },

  View = bond(({ name, state: { width, height, cols, images }, changed }: Model<State>) => {
    const render = () => <XImageGrid model={{ name, width, height, cols, images }} />
    return { render, changed }
  })

cards.register('image_grid', View)