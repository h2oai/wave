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

import { Model, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { cards } from './layout'
import { Persona, XPersona } from './persona'
import { border, cardPadding, cssVar } from './theme'
import { bond } from './ui'

const
  imageBorder = 2,
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      padding: cardPadding
    },
    img: {
      flexGrow: 1,
      minHeight: 150,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    },
    persona: {
      marginBottom: 16,
      $nest: {
        '.ms-Persona': {
          flexDirection: 'column',
          height: 'auto',
        },
        '.ms-Persona-image': {
          border: border(imageBorder, cssVar('$neutralTertiary'))
        },
        '.ms-Persona-details': {
          alignItems: 'center',
          padding: 0
        },
        '.ms-Persona-primaryText': {
          fontWeight: 500,
          marginTop: 12,
          color: cssVar('$neutralPrimary')
        }
      },

    },
    items: {
      marginTop: 16
    }
  })

/** Create a profile card to display information about a user. */
interface State {
  /** The persona represented by this card. */
  persona: Component
  /** 
   * The card’s image, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`)
   * or a path to an image hosted on the Wave daemon (starting with `/`).
. */
  image: S
  /** Components in this card displayed below the image. */
  items?: Component[]
  /** The height of the bottom content (items), e.g. '400px'. Use sparingly, e.g. in grid views. */
  height?: S
  /** The name of the card. */
  name?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const
    getTopOffset = ({ size = 'm' }: Persona) => {
      const ret = -cardPadding - imageBorder
      // Halve the persona px sizes to achieve pixel perfect centering for any supported size.
      switch (size) {
        case 'xs': return ret - 24
        case 's': return ret - 28
        case 'm': return ret - 36
        case 'l': return ret - 50
        case 'xl': return ret - 60
      }
    },
    render = () => {
      const { image, persona, items, height } = state
      return (
        <div data-test={name} className={css.card}>
          <div className={css.img} style={{ backgroundImage: `url('${image}')` }}></div>
          <div className={css.content} style={{ height }}>
            {persona.persona && <div className={css.persona} style={{ marginTop: getTopOffset(persona.persona) }}><XPersona model={persona.persona} /></div>}
            {items && <div className={css.items}><XComponents items={items} /></div>}
          </div>
        </div>
      )
    }

  return { render, changed }
})

cards.register('profile', View)