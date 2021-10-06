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
import { MiniButtons } from './button'
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
          h1: {
            margin: margin(18, 0),
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.017em',
            lineHeight: px(28),
          },
          p: {
            fontSize: 14,
            letterSpacing: '-0.006em',
            lineHeight: px(20),
            color: cssVar('$text7')
          },
        }
      },
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    $nest: {
      '>div:nth-child(2)': {
        marginTop: 4
      }
    }
  },
  title: {
    marginBottom: 2,
    color: cssVar('$neutralPrimary')
  },
})

/** Create an article card for longer texts. */
interface State {
  /** The card’s title, displayed at the top. */
  title: S
  /** Markdown text. */
  content?: S
  /** Collection of small buttons rendered on the other side of card's title. */
  mini_buttons?: MiniButtons
}

export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => {
    const { title, content, mini_buttons } = state
    return (
      <section data-test={name} className={css.card}>
        <header className={css.header}>
          <div className={clas('wave-s20 wave-w6', css.title)}>{title}</div>
          {mini_buttons && <MiniButtons {...mini_buttons} />}
        </header>
        {content && <Markdown source={content} />}
      </section>
    )
  }

  return { render, changed }
})

cards.register('article', View)