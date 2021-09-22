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
import { cards, grid } from './layout'
import { Markdown } from './markdown'
import { clas, cssVar, pc } from './theme'
import { bond, wave } from './ui'

const
  iconStyles: Fluent.IIconStyles = { root: { fontSize: 24, color: cssVar('$neutralTertiary'), fontWeight: 600 } },
  css = stylesheet({
    card: {
      display: 'flex',
      padding: grid.gap
    },
    lhs: {
      paddingRight: 16,
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
      color: cssVar('$neutralPrimary')
    },
    category: {
      color: cssVar('$themeDark'),
    },
    caption: {
      $nest: {
        'p:first-child': {
          marginTop: 0 //TODO: Fix on global markdown level.
        }
      }
    },
    header: {
      marginTop: -3, // HACK: Nudge up slightly.
      marginBottom: 13,
    },
    iconWrapper: {
      background: cssVar('$neutralLighter'),
      height: 40,
      width: 40,
      padding: 8,
      boxSizing: 'border-box',
      borderRadius: 4
    },
    img: {
      flexGrow: 1,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      borderRadius: 4
    }
  })
/** Create a wide information card displaying a title, caption, and either an icon or image. */
interface State {
  /** The card's title. */
  title: S
  /** The card's caption, displayed below the subtitle, supports markdown. */
  caption: S
  /** The card's subtitle, displayed below the title. */
  subtitle?: S
  /** The card's icon. */
  icon?: S
  /** The card’s image. */
  image?: S
  /** The card's category, displayed above the title. */
  category?: S
  /** An identifying name for this card. Makes the card clickable, similar to a button. */
  name?: S
  /** The card's background color. */
  color?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const
    { title, caption, icon, image, category, name: stateName, color, subtitle } = state,
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
        className={clas(css.card, stateName ? css.clickable : '', !icon && image ? css.imgSpecified : '')}
      >
        <div className={css.lhs}>
          {
            image
              ? <div className={css.img} style={{ backgroundImage: `url('${image}')` }}></div>
              : <Fluent.Icon iconName={icon || 'MiniExpand'} className={css.iconWrapper} styles={iconStyles} />
          }
        </div>
        <div>
          <div className={css.header}>
            {category && <div className={clas('wave-s14 wave-w5 wave-t7', css.category)}>{category}</div>}
            <div className={clas('wave-s20 wave-w6', css.title)}>{title}</div>
            {subtitle && <div className='wave-s14 wave-w5 wave-t7'>{subtitle}</div>}
          </div>
          {caption && <div className={clas('wave-s14 wave-w4 wave-t7', css.caption)}>
            <Markdown source={caption} />
          </div>}
        </div>
      </div>
    )

  return { render, changed }
})

cards.register('wide_info', View)