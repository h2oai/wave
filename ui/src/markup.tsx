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

import { B, Model, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { clas } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    cardPadding: {
      padding: grid.gap,
    },
    body: {
      flexGrow: 1,
    },
  })

/** Render HTML content. */
export interface Markup {
  /** The HTML content. */
  content: S
  /** An identifying name for this component. */
  name?: S
  /** The width of the markup, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
}/**
 * Render HTML content.
 * :icon "FileHTML"
 **/
interface State {
    /**
     * The title for this card.
     * :t "textbox"
     * :value "Untitled Content"
     **/
    title: S;
    /**
     * The HTML content.
     * :t "textarea"
     * :value "<div/>"
     **/
    content: S;
    /**
     * True if outer spacing should be removed. Defaults to False.
     **/
    compact?: B;
    /**
     * An optional name for this card.
     */
    name?: S;
}

export const
  XMarkup = ({ model: { content, name } }: { model: Markup }) => (
    <div data-test={name} dangerouslySetInnerHTML={{ __html: content }} />
  ),
  MarkupCard = ({ name, title, content, compact }: { name: S, title: S, content: S, compact?: B }) => (
    <div data-test={name} className={clas(css.card, compact ? '' : css.cardPadding)}>
      {title && <div className='wave-s12 wave-w6'>{title}</div>}
      <div className={css.body}>
        <XMarkup model={{ content }} />
      </div>
    </div>
  ),
  View = bond(({ name, state, changed }: Model<State>) => {
    const render = () => <MarkupCard name={name} title={state.title} content={state.content} compact={state.compact} />
    return { render, changed }
  })

cards.register('markup', View)