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
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { bond, Card, qd, S } from './qd'
import { clas, cssVar, getContrast, pc } from './theme'

const
  iconStyles: Fluent.IIconStyles = { root: { fontSize: 80 } },
  css = stylesheet({
    card: {
      display: 'flex',
      padding: grid.gap
    },
    lhs: {
      paddingRight: 20,
      textAlign: 'center',
      display: 'flex'
    },
    imgSpecified: {
      $nest: {
        '& > div': {
          width: pc(50)
        }
      }
    },
    clickable: {
      cursor: 'pointer'
    },
    title: {
      paddingBottom: 17,
      color: cssVar('$text9')
    },
    category: {
      color: cssVar('$text5')
    },
    caption: {
      color: cssVar('$text8')
    },
    img: {
      flexGrow: 1,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  })
/** Create a clickable card to provide more info content to your app. */
interface State {
  /** The card's title. */
  title: S
  /** The card's caption, displayed below the title. */
  caption: S
  /** The card's icon. */
  icon?: S
  /** The card’s image, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`) or a path to an image hosted on the Wave daemon (starting with `/`). */
  image?: S
  /** The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. This property has to be set when base64 encoded image is specified. */
  image_type?: S
  /** The card's category, displayed above the title. */
  category?: S
  /** An identifying name for this card. Makes the card clickable, similat to a button. */
  name?: S
  /** The card's background color. Use HEX or $ prefixed wave colors. */
  color?: S
}

export const View = bond(({ name, state, changed }: Card<State>) => {
  const
    { title, caption, icon, image, image_type, category, name: stateName, color } = state,
    onClick = () => {
      if (!stateName) return
      if (stateName.startsWith('#')) {
        window.location.hash = stateName.substr(1)
        return
      }
      qd.args[stateName] = stateName
      qd.sync()
    },
    getImageURL = () => image_type ? `data:image/${image_type};base64,${image}` : image,
    render = () => (
      <div
        data-test={name}
        onClick={onClick}
        style={{ background: color ? cssVar(color) : 'inherit' }}
        className={clas(css.card, stateName ? css.clickable : '', !icon && image ? css.imgSpecified : '')}
      >
        <div className={css.lhs}>
          {
            icon
              ? <Fluent.Icon iconName={icon} styles={iconStyles} />
              : image
                ? <div className={css.img} style={{ backgroundImage: `url('${getImageURL()}')` }}></div>
                : <Fluent.Icon iconName='MiniExpand' styles={iconStyles} />
          }
        </div>
        <div style={{ color: color ? getContrast(color) : 'inherit' }}>
          {category && <div className={clas('wave-s12 wave-w5', css.category)}>{category}</div>}
          <div className={clas('wave-s20 wave-w5', css.title)}>{title}</div>
          {caption && <div className={clas('wave-s14 wave-w4', css.caption)}>{caption}</div>}
        </div>
      </div>
    )

  return { render, changed }
})

cards.register('wide_info', View)