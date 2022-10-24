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

import { B, Model, Rec, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format, grid } from './layout'
import { formItemWidth } from './theme'
import { bond } from './ui'
import { lightboxB, LightboxProps } from './parts/lightbox'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
    },
    img: {
      flexGrow: 1,
      objectFit: 'contain',
      maxHeight: 'calc(100% - 20px)',
      cursor: 'pointer'
    }
  })

/** Create a card that displays a base64-encoded image. */
interface State {
  /** The card's title. */
  title: S
  /** The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. */
  type?: S
  /** Image data, base64-encoded. */
  image?: S
  /** Data for this card. */
  data?: Rec
  /** The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`. */
  path?: S
}


/** Create an image. */
export interface Image {
  /** The image title, typically displayed as a tooltip. */
  title: S
  /** The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. Required only if `image` is set. */
  type?: S
  /** Image data, base64-encoded. */
  image?: S
  /** The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`. */
  path?: S
  /** The width of the image, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
}

export const getImageSrc = ({ type, image, path }: Image) => path
  ? path
  : (image && type)
    ? `data:image/${type};base64,${image}`
    : ''

export const
  XImage = ({ model: m }: { model: Image }) => {
    const
      { title, type, image, path, width } = m,
      src = getImageSrc(m),
      lightboxProps: LightboxProps = { images: [{ title, type, image, path }] }

    return <img className={css.img} alt={title} src={src} width={formItemWidth(width)} onClick={src ? () => lightboxB(lightboxProps) : undefined} />

  },
  View = bond(({ name, state, changed }: Model<State>) => {
    const render = () => {
      const { title, type, image, data, path } = state
      return (
        <div data-test={name} className={css.card}>
          <Format data={data} format={title} className='wave-s12 wave-w6' />
          <XImage model={{ title, type, image, path }} />
        </div >
      )
    }
    return { render, changed }
  })

cards.register('image', View)