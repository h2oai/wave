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
import { B, Id, Model, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component } from './form'
// import { Image } from './image'
import { cards } from './layout'
import { lightboxB } from './parts/lightbox'
import { clas } from './theme'
import { bond } from './ui'

const css = stylesheet({
  // container: {
  //   display: 'grid', // inline-grid
  //   gridAutoRows: '300px',
  //   gridGap: '10px',
  //   gridTemplateColumns: 'repeat(auto-fill, minmax(30%, 1fr))'
  // }
})

/** Create an image grid. */
interface ImageGrid {
  /** The card's title. */
  title: S
  /** An identifying name for this component. */
  name: Id
  /** A list of images to be displayed in the image grid. */
  images: Component[] // TODO: Image[]
  /** A width of the image grid component. */
  width?: S
  /** A height of the image grid component. */
  height?: S
  /** Specifies the image placement. With the `best-fit` option gaps between images are minimized, but they can be placed in different order. */
  image_placement?: 'default' | 'best-fit'
  /** Number of images in one row. This setting ignores specified image `width` attribute. */
  images_per_row?: U
  /** Limit the number of rows displayed in the image grid. */
  rows?: U
}
export interface State {
  // images: Image[]
  images: Component[] // TODO: Image[]
  width?: S
  height?: S
}

export const
  XImageGrid = ({ model: m }: { model: ImageGrid }) => {
    const
      { width, height, images } = m,
      onRenderCell = React.useCallback((image, index: number | undefined) => {
        console.log('w, h', image.width, image.height)
        return (
          <div key={index} style={{
            // height: image.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3em',
            fontWeight: 'bold',
            color: 'white',
            gridRow: 'span 1'
          }}>
            <img
              width={'250px' || image.width}
              // height={image.height}
              style={{
                flex: `0 0 ${width}px`,
                objectFit: 'contain',
                cursor: 'pointer',
              }}
              src={image.path}
              onClick={image.path ? () => lightboxB({ images: images, defaultImageIdx: index }) : undefined}
            />
          </div>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    // console.log('images:', images)

    return (
      <Fluent.FocusZone>
        <Fluent.List
          // onRenderSurface={(props: Fluent.IListOnRenderSurfaceProps<Component> | undefined) => {
          //   // console.log(props)
          //   // eslint-disable-next-line react/prop-types
          //   return <div
          //     {...props?.divProps}
          //     className={clas(css.container)}>
          //     {props?.pageElements}
          //   </div>
          // }}
          getPageStyle={page => {
            console.log(page)
            // return css.container
            return {
              display: 'grid', // inline-grid
              gridAutoRows: '300px',
              gridGap: '10px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(30%, 1fr))'
            }
          }}
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
    // console.log(name)

    const render = () => <XImageGrid model={{ width, height, images: images.flatMap(({ image }) => image) }} />

    return { render, changed }
  })

cards.register('image_grid', View)