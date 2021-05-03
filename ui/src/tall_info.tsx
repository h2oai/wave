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

import * as Fluent from '@fluentui/react'
import { Model, S, wave } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { clas, cssVar, centerMixin, margin } from './theme'
import { bond } from './ui'

const
  iconStyles: Fluent.IIconStyles = { root: { fontSize: 80 } },
  css = stylesheet({
    card: {
      padding: grid.gap
    },
    imgContainer: {
      ...centerMixin()
    },
    textContainer: {
      textAlign: 'center'
    },
    clickable: {
      cursor: 'pointer'
    },
    header: {
      margin: margin(17, 0),
    },
    img: {
      flexGrow: 1,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  })
/** Create a tall information card displaying a title, caption, and either an icon or image. */
interface State {
  /** The card's title. */
  title: S
  /** The card's caption, displayed below the title. */
  caption: S
  /** The card's icon. */
  icon?: S
  /** The card’s image. */
  image?: S
  /** The card’s image height in px. Defaults to 300px. */
  image_height?: S
  /** The card's category, displayed above the title. */
  category?: S
  /** An identifying name for this card. Makes the card clickable, similar to a button. */
  name?: S
  /** The card's background color. */
  color?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const
    { title, caption, icon, image, category, name: stateName, color, image_height = '300px' } = state,
    onClick = () => {
      if (!stateName) return
      if (stateName.startsWith('#')) {
        window.location.hash = stateName.substr(1)
        return
      }
      wave.args[stateName] = stateName
      wave.sync()
    },
    render = () => (
      <div
        data-test={name}
        onClick={onClick}
        style={{ background: color ? cssVar(color) : 'inherit' }}
        className={clas(css.card, stateName ? css.clickable : '')}
      >
        <div className={css.imgContainer}>
          {
            icon
              ? <Fluent.Icon iconName={icon} styles={iconStyles} />
              : image
                ? <div className={css.img} style={{ backgroundImage: `url('${image}')`, height: image_height }}></div>
                : <Fluent.Icon iconName='MiniExpand' styles={iconStyles} />
          }
        </div>
        <div className={css.textContainer}>
          <div className={css.header}>
            <div className='wave-s20 wave-w5 wave-t9'>{title}</div>
            {category && <div className='wave-s12 wave-w5 wave-t5'>{category}</div>}
          </div>
          {caption && <div className='wave-s14 wave-w4 wave-t8'>{caption}</div>}
        </div>
      </div >
    )

  return { render, changed }
})

cards.register('tall_info', View)
