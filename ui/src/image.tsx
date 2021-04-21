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

import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format, grid } from './layout'
import { bond, Card, Rec, S } from './qd'

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
      maxHeight: 'calc(100% - 20px)'
    }
  })

/** Create a card that displays a base64-encoded image. */
interface State {
  /** The card's title. */
  title: S
  /** The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. */
  type: S
  /** Image data, base64-encoded. */
  image: S
  /** Data for this card. */
  data?: Rec
}

export const
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => (
      <div data-test={name} className={css.card}>
        <Format data={s.data} format={s.title} className='wave-s12 wave-w6' />
        <img className={css.img} alt={s.title} src={`data:image/${s.type};base64,${s.image}`} />
      </div >
    )
    return { render, changed }
  })

cards.register('image', View)