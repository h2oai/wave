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
    // width: '25%',
    // float: 'left',
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
    // width: '100%',
    // objectFit: 'contain',
    objectFit: 'none',
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

// TODO: handle resize
// TODO: check intersection with images in previous row (include in comparison only prev. row images with matching width against the width of image to be placed)
// TODO: align top (in iterations comparing previous rows one after another) and left

// TODO: check if unconventional aspect ratios are properly working (like 1:10)

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
      ),
      isImageOverlap = (i1x1, i1y1, i1x2, i1y2, i2x1, i2y1, i2x2, i2y2) => {
        const widthIsPositive = Math.min(i1x2, i2x2) > Math.max(i1x1, i2x1)
        const heightIsPositive = Math.min(i1y2, i2y2) > Math.max(i1y1, i2y1)
        return (widthIsPositive && heightIsPositive)
      }

    React.useLayoutEffect(() => {
      // Initialize intersection observer for lazy images.
      // document.querySelectorAll(".lazy").forEach((lazyImage, idx) => { if (idx < 4) lazyImageObserver.observe(lazyImage) }) // TODO: 4 - columnCount
      if (document.querySelectorAll(".lazy")?.[0]) lazyImageObserver.observe(document.querySelectorAll(".lazy")[0])
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div
        className={css.gridContainer}
        style={{ boxSizing: 'inherit' }}
      >
        {images.length && images.map((image, idx) => {
          const columnCount = 4 // TODO
          const placeholder_row = Math.floor(idx / columnCount)
          const placeholder_column = idx - (placeholder_row * columnCount)
          return (
            <span
              key={idx}
              className={css.gridItem}
              style={{
                left: `${placeholder_column * (100 / columnCount)}%`,
                height: '160px',
                top: placeholder_row * 150
              }}

            // style={{ gridColumn: column }}
            // style={idx === 3 ? { order: -1 } : undefined}
            >
              <img
                // width={'250px' || image.width}
                // height={image.height}
                id={`img-${idx}`}
                // style={idx > 17 ? { visibility: 'hidden' } : undefined}
                onLoad={(ev) => {
                  setImagesMetadata(metaData => {
                    const containerWidth = ev.target.parentElement.parentElement.clientWidth
                    const height = ev.target.height
                    const width = ev.target.width
                    const left = (idx !== 0 && (imagesMetadata[idx - 1].left + imagesMetadata[idx - 1].width + width) < containerWidth) ? (imagesMetadata[idx - 1].left + imagesMetadata[idx - 1].width) : 0
                    // TODO: handle case when the first row image is wider than containerWidth

                    // const top = imagesMetadata.filter((meta, id) => meta && id !== idx && meta.column === column).reduce((a, b) => a + b.height, 0) // with column count specified // TODO:

                    const row = idx === 0
                      ? 0
                      : left === 0
                        ? imagesMetadata[idx - 1].row + 1
                        : imagesMetadata[idx - 1].row

                    const prevRowBottom = imagesMetadata
                      .filter((meta, id) => meta && id !== idx && meta.row === row - 1)
                    const prevRowBottomAscending = prevRowBottom.sort((a, b) => (a.top + a.height) - (b.top + b.height))


                    const connectingImage = prevRowBottomAscending.find(prImage => { // TODO: 
                      return prevRowBottom.find(i => {
                        return isImageOverlap(
                          left,
                          prImage.top + prImage.height,
                          left + width,
                          prImage.top + prImage.height + height,
                          i.left,
                          i.top,
                          i.left + i.width,
                          i.top + i.height
                        )
                      }) === undefined
                    })


                    const top = row === 0
                      ? 0
                      : connectingImage
                        ? connectingImage.top + connectingImage.height
                        : 0

                    ev.target.parentElement.style.height = 'auto'
                    ev.target.parentElement.style.left = left + 'px'
                    ev.target.parentElement.style.top = top + 'px'

                    metaData[idx] = {
                      // column: column,
                      // row: row,
                      row: row,
                      height: height,
                      width: width,
                      left: left,
                      top: top,
                      naturalHeight: ev.target.naturalHeight,
                      naturalWidth: ev.target.naturalWidth,
                      weightH: ev.target.naturalHeight / ev.target.naturalWidth,
                      weightW: ev.target.naturalWidth / ev.target.naturalHeight
                    }

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