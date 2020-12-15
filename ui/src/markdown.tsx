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
import { cards, substitute } from './layout'
import { bond, Card, Rec, S, unpack } from './qd'
import { MarkupCard } from './markup'

export const
  markdown = markdownit({ html: true, linkify: true, typographer: true, }),
  markdownSafe = markdownit({ typographer: true, linkify: true }),
  Markdown = ({ source }: { source: S }) => (<div dangerouslySetInnerHTML={{ __html: markdown.render(source) }} />),
  MarkdownSafe = ({ source }: { source: S }) => (<div dangerouslySetInnerHTML={{ __html: markdownSafe.render(source) }} />)

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
        const data = unpack(state.data)
        return (
          <MarkupCard
            name={name}
            title={substitute(state.title, data)}
            content={markdown.render(substitute(state.content, data))}
          />
        )
      }
    return { render, changed }
  })

cards.register('markdown', View)