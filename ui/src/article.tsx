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
import { Markdown } from './markdown'
import { clas, cssVar, margin, px } from './theme'
import { bond } from './ui'

const css = stylesheet({
  card: {
    padding: 24,
    $nest: {
      '.wave-markdown': {
        marginTop: 12,
        $nest: {
          '&:first-child': {
            marginTop: 0
          },
          '& h1,&  h2, & h3, & h4, & h5, & h6': {
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
    }
  },
  title: {
    color: cssVar('$neutralPrimary')
  },
  miniBtns: {
    marginLeft: -4 //HACK: Align icons with title.
  }
})

/** Create an article card for longer texts. */
interface State {
  /** The card’s title, displayed at the top. */
  title: S
  /** Markdown text. */
  content?: S
  /** Collection of small buttons rendered under the title. */
  items?: Component[]
  /** An identifying name for this component */
  name?: S
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => {
    const { title, content, items } = state
    return (
      <section data-test={name} className={css.card}>
        <div className={clas('wave-s20 wave-w6', css.title)}>{title}</div>
        {items && <div className={css.miniBtns}><XComponents items={items} /></div>}
        {content && <Markdown source={content} />}
      </section>
    )
  }

  return { render, changed }
})

cards.register('article', View)