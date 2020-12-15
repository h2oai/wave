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

import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { bond, Card, S, B } from './qd'
import { getTheme, displayMixin } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    titledCard: {},
    untitledCard: {
      display: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
  })

/** Render HTML content. */
export interface Markup {
  /** The HTML content. */
  content: S
  /** An identifying name for this component. */
  name?: S
  /** True if the component should be visible. Defaults to true. */
  visible?: B
}

/** Render HTML content. */
interface State {
  /** The title for this card.*/
  title: S
  /** The HTML content. */
  content: S
}

export const
  XMarkup = ({ model: { content, visible, name } }: { model: Markup }) => (
    <div data-test={name} dangerouslySetInnerHTML={{ __html: content }} style={displayMixin(visible)} />
  ),
  MarkupCard = ({ name, title, content }: { name: S, title: S, content: S }) => (
    <div data-test={name} className={title ? css.titledCard : css.untitledCard}>
      {title && <div className={css.title}>{title}</div>}
      <XMarkup model={{ content }} />
    </div>
  ),
  View = bond(({ name, state, changed }: Card<State>) => {
    const render = () => <MarkupCard name={name} title={state.title} content={state.content} />
    return { render, changed }
  })

cards.register('markup', View)