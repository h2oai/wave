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
import { Model, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { Markdown } from './markdown'
import { centerMixin, clas, cssVar, pc } from './theme'
import { bond, wave } from './ui'

const
  iconStyles: Fluent.IIconStyles = { root: { fontSize: 48, color: cssVar('$neutralPrimary'), fontWeight: 600 } },
  css = stylesheet({
    card: {
      display: 'flex',
      padding: 24
    },
    right: {
      flexDirection: 'row-reverse',
    },
    rhs: {
      display: 'flex',
      flexDirection: 'column'
    },
    lhs: {
      textAlign: 'center',
      display: 'flex',
      marginRight: 16
    },
    imgSpecified: {
      width: pc(50),
      minWidth: pc(50),
    },
    clickable: {
      cursor: 'pointer'
    },
    title: {
      color: cssVar('$neutralPrimary')
    },
    subtitle: {
      marginTop: 1
    },
    category: {
      color: cssVar('$themeDark'),
      marginBottom: -1,
    },
    header: {
      marginTop: -5, // HACK: Nudge up slightly.
      marginBottom: 13,
    },
    iconWrapper: {
      ...centerMixin(),
      background: cssVar('$text1'),
      height: 80,
      width: 80,
      padding: 8,
      boxSizing: 'border-box',
      borderRadius: pc(50)
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
export interface State {
  /** An identifying name for this card. Makes the card clickable, similar to a button. */
  name: S
  /** The card's title. */
  title: S
  /** The card's caption, displayed below the subtitle. Supports markdown. */
  caption: S
  /** Label of a button rendered at the bottom of the card. If specified, whole card is not clickable anymore.. */
  label?: S
  /** The card's subtitle, displayed below the title. */
  subtitle?: S
  /** The card's alignment, determines the position of an image / icon. Defaults to 'left'. */
  align?: 'left' | 'right'
  /** The card's icon. */
  icon?: S
  /** The card’s image. */
  image?: S
  /** The card's category, displayed above the title. */
  category?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const
    { title, caption, icon, image, category, name: stateName, subtitle, label, align = 'left' } = state,
    onClick = () => {
      if (stateName.startsWith('#')) {
        window.location.hash = stateName.substring(1)
        return
      }
      wave.args[stateName] = stateName
      wave.push()
    },
    render = () => (
      <div
        data-test={name}
        onClick={stateName && !label ? onClick : undefined}
        className={clas(css.card, stateName && !label ? css.clickable : '', align === 'right' ? css.right : '')}
      >
        <div className={clas(css.lhs, !icon && image ? css.imgSpecified : '')}>
          {
            image
              ? <div className={css.img} style={{ backgroundImage: `url('${image}')` }}></div>
              : <Fluent.Icon iconName={icon || 'MiniExpand'} className={css.iconWrapper} styles={iconStyles} />
          }
        </div>
        <div className={css.rhs}>
          <div className={css.header}>
            {category && <div className={clas('wave-s14 wave-w5 wave-t7', css.category)}>{category}</div>}
            <div className={clas('wave-s20 wave-w6', css.title)}>{title}</div>
            {subtitle && <div className={clas('wave-s14 wave-w5 wave-t7', css.subtitle)}>{subtitle}</div>}
          </div>
          {caption && <div className='wave-s14 wave-w4 wave-t7' style={{ marginBottom: label ? 16 : undefined }}><Markdown source={caption} /></div>}
          {label && <Fluent.PrimaryButton onClick={onClick} text={label} styles={{ root: { marginTop: 'auto', alignSelf: 'flex-start' } }} />}
        </div>
      </div>
    )

  return { render, changed }
})

cards.register('wide_info', View)