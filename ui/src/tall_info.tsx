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
import { Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { centerMixin, clas, cssVar } from './theme'
import { bond, wave } from './ui'

const
  iconStyles: Fluent.IIconStyles = { root: { fontSize: 32 } },
  css = stylesheet({
    card: {
      padding: 24
    },
    imgContainer: {
      ...centerMixin(),
      marginBottom: 16
    },
    textContainer: {
      textAlign: 'center'
    },
    clickable: {
      cursor: 'pointer'
    },
    header: {
      marginTop: 16,
      marginBottom: 8
    },
    title: {
      color: cssVar('$neutralPrimary'),
    },
    category: {
      color: cssVar('$themeDark'),
    },
    iconWrapper: {
      background: cssVar('$neutralLighter'),
      height: 64,
      width: 64,
      boxSizing: 'border-box',
      borderRadius: 4,
      color: cssVar('$neutralTertiary'),
      ...centerMixin()
    },
    img: {
      flexGrow: 1,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  })

/** Create a tall information card displaying a title, caption and either an icon or image. */
interface State {
  /** The card's title. */
  title: S
  /** The card's caption, displayed below the title. */
  caption: S
  /** The card's icon. */
  icon?: S
  /** The card’s image. */
  image?: S
  /** The card’s image height in px. Defaults to '150px'. */
  image_height?: S
  /** The card's category, displayed below the title. */
  category?: S
  /** An identifying name for this card. Makes the card clickable, similar to a button. */
  name?: S
  /** The card's background color. */
  color?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const
    { title, caption, icon, image, category, name: stateName, color, image_height = '150px' } = state,
    onClick = () => {
      if (!stateName) return
      if (stateName.startsWith('#')) {
        window.location.hash = stateName.substr(1)
        return
      }
      wave.args[stateName] = stateName
      wave.push()
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
            image
              ? <div className={css.img} style={{ backgroundImage: `url('${image}')`, height: image_height }}></div>
              : <div className={css.iconWrapper}><Fluent.Icon iconName={icon || 'MiniExpand'} styles={iconStyles} /></div>
          }
        </div>
        <div className={css.textContainer}>
          <div className={css.header}>
            <div className={clas('wave-s20 wave-w6 wave-t9', css.title)}>{title}</div>
            {category && <div className={clas('wave-s14 wave-w4 wave-t5', css.category)}>{category}</div>}
          </div>
          {caption && <div className='wave-s14 wave-w4 wave-t7'>{caption}</div>}
        </div>
      </div >
    )

  return { render, changed }
})

cards.register('tall_info', View)
