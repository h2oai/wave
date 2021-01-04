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

import markdownit from 'markdown-it'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, substitute } from './layout'
import { bond, Card, Rec, S, unpack } from './qd'
import { border, getTheme, padding, palette, pc } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    markdown: {
      $nest: {
        a: {
          color: palette.themePrimary,
          $nest: {
            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
        table: {
          width: pc(100),
          borderCollapse: 'collapse',
        },
        tr: {
          borderBottom: border(1, theme.colors.text5),
        },
        th: {
          padding: padding(11, 6),
          textAlign: 'left',
        },
        td: {
          padding: padding(11, 6),
        },
        img: {
          maxWidth: '100%',
          maxHeight: '100%',
        },
      },
    },
  })

export const
  markdown = markdownit({ html: true, linkify: true, typographer: true, }),
  markdownSafe = markdownit({ typographer: true, linkify: true }),
  Markdown = ({ source }: { source: S }) => (<div className={css.markdown} dangerouslySetInnerHTML={{ __html: markdown.render(source) }} />),
  MarkdownSafe = ({ source }: { source: S }) => (<div className={css.markdown} dangerouslySetInnerHTML={{ __html: markdownSafe.render(source) }} />)


/**
 * Create a card that renders Markdown content.
 *
 * Github-flavored markdown is supported.
 * HTML markup is allowed in markdown content.
 * URLs, if found, are displayed as hyperlinks.
 * Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.
 */
interface State {
  /** The title for this card.*/
  title: S
  /** The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/ */
  content: S
  /** Additional data for the card. */
  data?: Rec
}

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          data = unpack(state.data),
          title = substitute(state.title, data)
        return (
          <div data-test={name}>
            {title && <div className={css.title}>{title}</div>}
            <Markdown source={substitute(state.content, data)} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('markdown', View)