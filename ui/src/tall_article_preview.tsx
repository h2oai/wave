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
import { Markdown } from './markdown'
import { clas, cssVar, margin, padding, px } from './theme'
import { bond, wave } from './ui'

const css = stylesheet({
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  clickable: {
    cursor: 'pointer'
  },
  header: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: padding(16, 24),
    color: cssVar('$neutralPrimary')
  },
  content: {
    marginBottom: 16,
    $nest: {
      '&:first-child': {
        marginTop: 0
      },
      'h1, h2, h3, h4, h5, h6': {
        '&:first-child': {
          marginTop: '0 !important'
        },
        marginBlock: 0,
        color: cssVar('$neutralPrimary')
      },
      h1: {
        margin: margin(18, 0),
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: '-0.017em',
        lineHeight: px(28),
      },
      h2: {
        margin: margin(12, 0),
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: '-0.014em',
        lineHeight: px(25.2),
      },
      h3: {
        margin: margin(8, 0),
        fontSize: 16,
        fontWeight: 400,
        letterSpacing: '-0.011em',
        lineHeight: px(22.4),
      },
      p: {
        fontSize: 14,
        letterSpacing: '-0.006em',
        lineHeight: px(20),
        color: cssVar('$text7'),
        marginBlock: 0,
      },
    }
  },
  body: {
    margin: margin(16, 24, 24, 24),
  },
  title: {
    color: cssVar('$neutralPrimary')
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent linear-gradient(180deg, #080808D8 0%, #080808B1 16%, #08080800 46%, #080808DB 100%) 0% 0% no-repeat padding-box'
  },
  img: {
    position: 'relative',
    flexGrow: 1,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }
})

/** Create a tall article preview card. */
interface State {
  /** The card's title. */
  title: S
  /** 
   * The card’s background image URL, either a base64-encoded image, a path to an image hosted
   * externally (starting with `https://` or `http://`) or a path to an
   * image hosted on the Wave daemon (starting with `/`)
   */
  image: S
  /** The card's subtitle, displayed below the title. */
  subtitle?: S
  /** Markdown text. */
  content?: S
  /** An identifying name for this card. Makes the card clickable, similar to a button. */
  name?: S
  /** Components displayed in the body of the card. */
  items?: Component[]
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const
    { title, subtitle, image, name: stateName, items, content } = state,
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
        className={clas(css.card, stateName ? css.clickable : '')}
      >
        <div className={css.img} style={{ backgroundImage: `url('${image}')` }}>
          <div className={css.overlay}></div>
          <div className={css.header}>
            <div className={clas('wave-s20 wave-w6', css.title)}>{title}</div>
            {subtitle && <div className={clas('wave-s14 wave-w4 wave-t8', css.title)}>{subtitle}</div>}
          </div>
        </div>
        {
          (content || items) && <div className={css.body}>
            {content && <div className={css.content}><Markdown source={content} /></div>}
            {items && <XComponents items={items} />}
          </div>
        }
      </div>
    )

  return { render, changed }
})

cards.register('tall_article_preview', View)