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
import { CardEffect, cards } from './layout'
import { Markdown } from './markdown'
import { clas } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: 24,
    },
    center: {
      margin: '0 auto',
      $nest: {
        '.wave-markdown': {
          textAlign: 'center'
        }
      }
    },
    caption: {
      $nest: {
        '.wave-markdown>*:first-child': {
          marginTop: 0
        },
      }
    }
  })

/**
 * Render a page footer displaying a caption.
 * Footer cards are typically displayed at the bottom of a page.
 */
interface State {
  /** The caption. Supports markdown. **/
  caption: S
  /** The components displayed to the right of the caption. */
  items?: Component[]
}

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        const { caption, items } = state
        return (
          <div data-test={name} className={css.card}>
            <div className={clas('wave-s13', css.caption, items ? '' : css.center)}><Markdown source={caption} /></div>
            {items && <XComponents items={items} />}
          </div>)
      }

    return { render, changed }
  })

cards.register('footer', View, { effect: CardEffect.Transparent, marginless: true, animate: false })