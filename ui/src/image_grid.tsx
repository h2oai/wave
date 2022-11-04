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
  gridContainer: {
    // display: 'grid', // inline-grid
    // gridAutoRows: '300px',
    // gridAutoRows: 'minmax(min-content, max-content)',
    // gridAutoRows: 'min-content',
    // gridGap: '6px',
    // gridTemplateColumns: 'repeat(auto-fill, minmax(30%, 1fr))',
    // columnCount: 3,
    // display: 'grid',
    // gap: '10px',
    // gridTemplate: 'repeat(auto-fit, minmax(0,1fr)) / repeat(6, 1fr)',
    // gridTemplateColumns: 'repeat(6, 1fr)',
    // gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
    // gridAutoFlow: 'dense' /* or 'row', 'row dense', 'column dense' */
    position: 'relative'
  },
  gridItem: {
    // height: image.height,
    // display: 'inline-block',
    // breakInside: 'avoid',

    // width: '100%',
    // height: 'auto',

    // display: 'inline-block',
    // overflow: 'hidden',
    // gridRow: 'span 1'
    // gridColumn: 1
    position: 'absolute',
    width: '25%',
    float: 'left',
    boxSizing: 'border-box',
    // $nest: {
    //   '&:nth-child(4n+1)': {
    //     // clear: 'left'
    //     left: '75%'
    //   },
    //   '&:nth-child(3n+1)': {
    //     // clear: 'left'
    //     left: '50%'
    //   },
    //   '&:nth-child(2n+1)': {
    //     // clear: 'left'
    //     left: '25%'
    //   },
    //   '&::nth-child(n+1)': {
    //     // clear: 'left'
    //     left: '0%'
    //   }
    // }
  },
  image: {
    // flex: `0 0 ${width}px`,
    width: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
  }
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

// TODO: handle unconventional aspect ratios (like 1:10)
// make it responsive

export const
  XImageGrid = ({ model: m }: { model: ImageGrid }) => {
    const
      { width, height, images } = m,
      [imagesMetadata, setImagesMetadata] = React.useState(Array(...Array(images.length))),
      // TODO: import from lightbox
      lazyImageObserver = new window.IntersectionObserver(entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement
            lazyImage.src = lazyImage.dataset.src!
            lazyImage.classList.remove("lazy")
            lazyImageObserver.unobserve(lazyImage)
          }
        })
      )

    React.useLayoutEffect(() => {
      // Initialize intersection observer for lazy images.
      // document.querySelectorAll(".lazy").forEach((lazyImage, idx) => { if (idx < 4) lazyImageObserver.observe(lazyImage) }) // TODO: 4 - columnCount
      if (document.querySelectorAll(".lazy")?.[0]) lazyImageObserver.observe(document.querySelectorAll(".lazy")[0])
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log('images:', images)

    return (
      <div
        className={css.gridContainer}
        style={{ boxSizing: 'inherit' }}
      >
        {images.length && images.map((image, idx) => {
          const columnCount = 4 // TODO
          const row = Math.floor(idx / columnCount)
          const column = idx - (row * columnCount)
          return (
            <span
              key={idx}
              className={css.gridItem}
              style={{
                left: `${column * (100 / columnCount)}%`,
                height: '160px',
                top: row * 150
              }}

            // style={{ gridColumn: column }}
            // style={idx === 3 ? { order: -1 } : undefined}
            >
              <img
                // width={'250px' || image.width}
                // height={image.height}
                id={`img-${idx}`}
                onLoad={(ev) => {
                  setImagesMetadata(metaData => {
                    metaData[idx] = {
                      column: column,
                      height: ev.target.height,
                      width: ev.target.width,
                      naturalHeight: ev.target.naturalHeight,
                      naturalWidth: ev.target.naturalWidth,
                      weightH: ev.target.naturalHeight / ev.target.naturalWidth,
                      weightW: ev.target.naturalWidth / ev.target.naturalHeight
                    }
                    ev.target.parentElement.style.height = 'auto'
                    const top = imagesMetadata.filter((meta, id) => meta && id !== idx && meta.column === column).reduce((a, b) => a + b.height, 0)
                    ev.target.parentElement.style.top = top + 'px'
                    return metaData
                  })
                  if (document.getElementById(`img-${idx + 1}`)) {
                    lazyImageObserver.observe(document.getElementById(`img-${idx + 1}`))
                  }
                }}
                onError={() => {
                  // TODO: 
                }}
                className={clas(css.image, 'lazy')}
                alt={image.title}
                data-src={image.path}
                // src={image.path}
                onClick={image.path ? () => lightboxB({ images: images, defaultImageIdx: idx }) : undefined}
              />
            </span>
          )
        })}
      </div>
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