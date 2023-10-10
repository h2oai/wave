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
import { clas, cssVar } from './theme'
import { bond, wave } from './ui'
import * as Fluent from '@fluentui/react'

const css = stylesheet({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  clickable: {
    cursor: 'pointer'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  content: {
    padding: 24,
    paddingBottom: 0,
    color: cssVar('$text'),
  },
  items: {
    $nest: {
      // Target mini button's icons and labels
      '& .ms-Icon, & .ms-Button-label': {
        color: cssVar('$text'),
      }
    }
  }
})


/** Create a preview card displaying an image with shadow overlay, title, social icons, caption, and button. */
export interface State {
  /** An identifying name for this card. Makes the card clickable if label is not provided, similar to a button. */
  name: S
  /** The card’s image. */
  image: S
  /** The card's title */
  title?: S
  /** Mini buttons displayed at the top-right corner */
  items?: Component[]
  /** The card's caption, displayed below the title. */
  caption?: S
  /** Label of a button rendered at the bottom of the card. If specified, the whole card is not clickable anymore. */
  label?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => {
    const { image, title, name: stateName, label, caption, items } = state,
      onClick = () => {
        if (stateName.startsWith('#')) {
          window.location.hash = stateName.substring(1)
          return
        }
        wave.args[stateName] = stateName
        wave.push()
      }

    return (
      <div
        data-test={name}
        onClick={stateName && !label ? onClick : undefined}
        className={clas(css.card, stateName && !label ? css.clickable : '')}
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className={css.content} style={{ background: cssVar('$card7'), boxShadow: `0px 6px 30px 30px ${cssVar('$card7')}` }}>
          <div className={css.header}>
            {title && <div className='wave-s20 wave-w6'>{title}</div>}
            {items && <div className={css.items}><XComponents items={items} /></div>}
          </div>
          {caption && <div className='wave-s14 wave-t8'>{caption}</div>}
        </div>
        {label && <Fluent.PrimaryButton onClick={onClick} text={label} styles={{ root: { margin: '0 24px 24px 0', alignSelf: 'flex-end' } }} />}
      </div>
    )
  }

  return { render, changed }
})

cards.register('preview', View)