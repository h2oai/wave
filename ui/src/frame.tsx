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

import { B, Model, S, xid } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid } from './layout'
import { formItemWidth, clas } from './theme'
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
      position: 'relative',
      $nest: {
        'iframe': {
          // WORKAROUND: Iframe "height:100%" implementation differs from Chrome/FF despite container being
          // correctly expanded via "flex-grow:1". Need to position it absolutely instead.
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0
        }
      }
    },
  })

/**
 * Create a new inline frame (an `iframe`).
 */
export interface Frame {
  /** The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html` */
  path?: S
  /** The HTML content of the page. A string containing `<html>...</html>`. */
  content?: S
  /** The width of the frame, e.g. `200px`, `50%`, etc. Defaults to '100%'. */
  width?: S
  /** The height of the frame, e.g. `200px`, `50%`, etc. Defaults to '150px'. */
  height?: S
  /** An identifying name for this component. */
  name?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
}

/**
 * Render a card containing a HTML page inside an inline frame (an `iframe`).
 *
 * Either a path or content can be provided as arguments.
 * :icon "PageAdd"
 */
interface State {
  /**
   * The title for this card.
   * :t "textbox"
   * :value "Untitled Frame"
   **/
  title: S
  /**
   * The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`.
   * :t "textbox"
   * :value ""
   **/
  path?: S
  /**
   * The HTML content of the page. A string containing `<html>...</html>`.
   * :t "textarea"
   * :value ""
   */
  content?: S
  /**
   * True if title and padding should be removed. Defaults to False.
   */
  compact?: B
  /**
   * An optional identifying name for this component.
   */
  name?: S
}

const
  // replace ' src="/' -> ' src="http://foo.bar.baz:8080/'
  fixrefs = (s: S): S => s.replace(/(\s+src\s*=\s*["'])\//g, `$1${window.location.protocol}//${window.location.host}/`),
  inline = (s: S): S => URL.createObjectURL(new Blob([fixrefs(s)], { type: 'text/html' })),
  InlineFrame = ({ path, content }: { path?: S, content?: S }) => {
    const src = React.useMemo(() => path ? path : content ? inline(content) : inline('Nothing to render.'), [path, content])
    return <iframe title={xid()} src={src} frameBorder="0" width="100%" height="100%" />
  }

// HACK: Applying width/height styles directly on iframe don't work in Chrome/FF; so wrap in div instead.
export const XFrame = ({ model: { name, path, content, width = '100%', height = '150px' } }: { model: Frame }) => (
  <div data-test={name} style={{ width: formItemWidth(width), height }}>
    <InlineFrame path={path} content={content} />
  </div>
)


export const View = bond(({ name, state, changed }: Model<State>) => {
  const render = () => (
    <div data-test={name} className={clas(css.card, state.compact ? '' : css.cardPadding)}>
      {!state.compact && <div className='wave-s12 wave-w6'>{state.title}</div>}
      <div className={css.body}>
        <InlineFrame path={state.path} content={state.content} />
      </div>
    </div>
  )
  return { render, changed }
})

cards.register('frame', View)