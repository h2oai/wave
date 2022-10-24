
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
import * as Fluent from '@fluentui/react'
import { Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component } from './form'
// import { Image } from './image'
import { cards } from './layout'
import { lightboxB } from './parts/lightbox'
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

interface ImageGrid {
  images: Component[]
  width?: S,
  height?: S,
}
export interface State {
  /** Images */
  // images: Image[]
  images: Component[],
  width?: S
  height?: S
}

export const
  XImageGrid = ({ model: m }: { model: ImageGrid }) => {
    const
      { width, height, images } = m,
      onRenderCell = React.useCallback((image, index: number | undefined) => {
        return (
          <div key={index} style={{ height: height }}>
            <img
              width={width}
              height={height}
              style={{ flex: `0 0 ${width}px`, objectFit: 'contain', cursor: 'pointer' }}
              src={image.path}
              onClick={image.path ? () => lightboxB({ images: images, defaultImageIdx: index }) : undefined}
            />
          </div>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    console.log('images:', images)

    return (
      <Fluent.FocusZone>
        <Fluent.List
          // className={classNames.listGridExample}
          // style={{ display: 'inline-block' }}
          items={images.length ? images : undefined}
          // getItemCountForPage={getItemCountForPage}
          // getPageHeight={getPageHeight}
          // renderedWindowsAhead={4}
          onRenderCell={onRenderCell}
        />
      </Fluent.FocusZone>
    )

  },
  View = bond(({ name, state: { width, height, images }, changed }: Model<State>) => {
    // const rowHeight = 90 // random number, docs says 76 but usually it's more than that
    // const rows = state.box.substring(6)
    // const viewportHeight = rowHeight * rows
    // const shouldRenderImage = () => true

    const render = () => <XImageGrid model={{ width, height, images: images.flatMap(({ image }) => image) }} />

    return { render, changed }
  })

cards.register('image_grid', View)