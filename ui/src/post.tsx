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
import { XPersona } from './persona'
import { clas, cssVar, px } from './theme'
import { Command } from './toolbar'
import { bond } from './ui'

const css = stylesheet({
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 24,
    paddingBottom: 16,
    marginTop: -4,
    $nest: {
      '.ms-Persona-primaryText': {
        fontSize: 16,
        lineHeight: px(22),
        fontWeight: 500,
      },
      '.ms-Persona-secondaryText': {
        fontSize: 14,
        lineHeight: px(20),
        color: cssVar('$text7')
      },
      '.ms-Persona-image': {
        height: '40px !important',
        width: '40px !important',
      },
      '.ms-Persona-imageArea': {
        height: '40px !important',
        width: '40px !important',
      }
    }
  },
  aux_value: {
    marginBottom: 5
  },
  content: {
    padding: 24,
    paddingTop: 16
  },
  img: {
    flexGrow: 1,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  items: {
    marginTop: 12
  }
})

/** Create a postcard displaying a persona, image, caption and optional buttons. */
interface State {
  /** The card's user avatar, 'size' prop is restricted to 'xs'. */
  persona: Component
  /** The card’s image. */
  image: S
  /** The card's aux_value, displayed on the right hand side of the image. */
  aux_value?: S
  /** The card's caption, displayed below the image. */
  caption?: S
  /** The card's buttons, displayed at the bottom. */
  items?: Component[]
  /** An optional name for this card. */
  name?: S
}

export const View = bond(({ name, state, changed }: Model<State & { commands: Command[] }>) => {
  const render = () => {
    const { persona, image, aux_value, caption, items } = state
    if (persona.persona) persona.persona.size = 'xs'
    return (
      <div data-test={name} className={css.card}>
        <div className={css.header}>
          {persona.persona && <XPersona model={persona.persona} />}
          {aux_value && <div className={clas('wave-s12 wave-t7', css.aux_value)}>{aux_value}</div>}
        </div>
        <div className={css.img} style={{ backgroundImage: `url('${image}')` }}></div>
        {(caption || items) && (
          <div className={css.content}>
            {caption && <div className='wave-s14 wave-w4 wave-t7'>{caption}</div>}
            {items && <div className={css.items}><XComponents items={items} /></div>}
          </div>
        )}
      </div>
    )
  }

  return { render, changed }
})

cards.register('post', View)