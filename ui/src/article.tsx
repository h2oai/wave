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
import { Markdown } from './markdown'
import { clas, cssVar, margin, px } from './theme'
import { Command, toCommands } from './toolbar'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      padding: 24,
      $nest: {
        '.wave-markdown': {
          marginTop: 16,
          $nest: {
            h1: {
              margin: margin(24, 0),
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
        '+div': {
          display: 'none' // HACK: Hide page-wide command menu.
        }
      }
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      marginBottom: 2,
      color: cssVar('$neutralPrimary')
    },
    caption: {
      color: cssVar('$themePrimary')
    }
  }),
  commandBarPrimarySetStyles: Fluent.IStyle = {
    '.ms-Button:not(:hover)': { background: `${cssVar('$card')} !important` },
  }

/** Create an article card for longer texts. */
interface State {
  /** The card’s title, displayed at the top. */
  title: S
  /** The card's subtitle, displayed under the title. */
  subtitle?: S
  /** The card's caption, displayed under the subtitle. */
  caption?: S
  /** Markdown text. */
  content?: S
}

export const View = bond(({ name, state, changed }: Model<State & { commands: Command[] }>) => {
  const render = () => {
    const { title, caption, subtitle, commands, content } = state
    return (
      <section data-test={name} className={css.card}>
        <header className={css.header}>
          <div>
            <div className={clas('wave-s20 wave-w6', css.title)}>{title}</div>
            <div className='wave-s14 wave-t6'>{subtitle}</div>
            <div className={clas('wave-s14', css.caption)}>{caption}</div>
          </div>
          {commands && <Fluent.CommandBar items={toCommands(commands)} styles={{ root: { padding: 0 }, primarySet: commandBarPrimarySetStyles }} />}
        </header>
        {content && <Markdown source={content} />}
      </section>
    )
  }

  return { render, changed }
})

cards.register('article', View)