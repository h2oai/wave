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
import { B, Dict, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { ContextMenu } from './card_menu'
import { Markdown } from './markdown'
import { margin } from './theme'
import { Command } from './toolbar'

/** Create text content. */
export interface Text {
  /** The text content. */
  content: S
  /** The font size of the text content. */
  size?: 'xl' | 'l' | 'm' | 's' | 'xs'
  /** The width of the text , e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** The alignment of the text content. Defaults to 'start'. */
  align?: 'start' | 'end' | 'center' | 'justify'
  /** Tooltip message. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

/** Create extra-large sized text content. */
export interface TextXl {
  /** The text content. */
  content: S
  /** The width of the text , e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** The alignment of the text content. Defaults to 'start'. */
  align?: 'start' | 'end' | 'center' | 'justify'  
  /** Tooltip message. */
  tooltip?: S
  /** Contextual menu commands for this component. */
  commands?: Command[]
  /** An identifying name for this component. */
  name?: S
}

/** Create large sized text content. */
export interface TextL {
  /** The text content. */
  content: S
  /** The width of the text , e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** The alignment of the text content. Defaults to 'start'. */
  align?: 'start' | 'end' | 'center' | 'justify'
  /** Tooltip message. */
  tooltip?: S
  /** Contextual menu commands for this component. */
  commands?: Command[]
  /** An identifying name for this component. */
  name?: S
}

/** Create medium sized text content. */
export interface TextM {
  /** The text content. */
  content: S
  /** The width of the text , e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** The alignment of the text content. Defaults to 'start'. */
  align?: 'start' | 'end' | 'center' | 'justify'
  /** Tooltip message. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

/** Create small sized text content. */
export interface TextS {
  /** The text content. */
  content: S
  /** The width of the text , e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** The alignment of the text content. Defaults to 'start'. */
  align?: 'start' | 'end' | 'center' | 'justify'
  /** Tooltip message. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

/** Create extra-small sized text content. */
export interface TextXs {
  /** The text content. */
  content: S
  /** The width of the text , e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** The alignment of the text content. Defaults to 'start'. */
  align?: 'start' | 'end' | 'center' | 'justify'
  /** Tooltip message. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

const
  css = stylesheet({
    text: {
      position: 'relative',
      $nest: {
        p: {
          // Override default 1em margin inside markdown paragraphs.
          margin: margin(0, 0, 10, 0),
        }
      },
    },
  }),
  textVariants: Dict<keyof Fluent.IFontStyles> = {
    xl: 'xLarge',
    l: 'large',
    m: 'medium',
    s: 'small',
    xs: 'xSmall',
  },
  toTextVariant = (s: S) => textVariants[s] || 'mediumPlus'

export const XText = ({ content, name, size, align, commands }: { content: S, name?: S, size?: S, align?: Text['align'], commands?: Command[] }) => (
  
  <div className={css.text}>
    {/* `w-text` is a marker class. */}
    <Fluent.Text data-test={name} variant={toTextVariant(size || 'm')} style={{ textAlign: align || 'start'}} block className='w-text'>
      <Markdown source={content} />
    </Fluent.Text>
    {!!commands?.length && <ContextMenu name={name ? `${name}-menu` : name} commands={commands} />}
  </div>
)
