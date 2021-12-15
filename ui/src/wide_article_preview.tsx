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

import { Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { cards } from './layout'
import { clas, cssVar, px } from './theme'
import { bond, wave } from './ui'
import { XPersona } from './persona'

const css = stylesheet({
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
  },
  clickable: {
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
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
  content: {
    flex: 1,
    display: 'flex',
  },
  img: {
    marginRight: 24,
    flex: 1,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  rhs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  items: {
    $nest: {
      // Target mini button's icons and labels
      '& .ms-Icon, & .ms-Button-label': {
        color: cssVar('$text'),
      }
    }
  },
})

/** Create a wide article preview card displaying a persona, image, title, caption, and optional buttons. */
export interface State {
  /** The card's user avatar, 'size' prop is restricted to 'xs'. */
  persona: Component
  /** The card’s image displayed on the left-hand side. */
  image: S
  /** The card's title on the righ-hand side */
  title: S
  /** An identifying name for this card. Makes the card clickable, similar to a button. */
  name?: S
  /** The card's auxiliary text, displayed on the right-hand side of the header. */
  aux_value?: S
  /** The card's caption, displayed bellow the title on the right-hand side. */
  caption?: S
  /** The card's buttons, displayed at the bottom-right corner. */
  items?: Component[]
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => {
    const { persona, aux_value, name: stateName, image, title, caption, items } = state,
    onClick = () => {
      if (!stateName) return
      if (stateName.startsWith('#')) {
        window.location.hash = stateName.substr(1)
        return
      }
      wave.args[stateName] = stateName
      wave.push()
    }
    if (persona.persona) persona.persona.size = 'xs'
    return (
      <div
        data-test={name}
        onClick={onClick}
        className={clas(css.card, stateName ? css.clickable : '')}
      >
        <div className={css.header}>
          {persona.persona && <XPersona model={persona.persona} />}
          {aux_value && <div className='wave-s12 wave-t7'>{aux_value}</div>}
        </div>
        <div className={css.content}>
          <div className={css.img} style={{ backgroundImage: `url('${image}')` }}></div>
          <div className={css.rhs}>
            <div>
              {title && <div className='wave-s16 wave-w6'>{title}</div>}
              {caption && <div className='wave-s14 wave-w4 wave-t7'>{caption}</div>}
            </div>
            {items && <div className={css.items}><XComponents items={items} /></div>}
          </div>
        </div>
      </div>
    )
  }

  return { render, changed }
})

cards.register('wide_article_preview', View)