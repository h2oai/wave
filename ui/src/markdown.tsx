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

import { Model, Rec, S, unpack, xid } from 'h2o-wave'
import hljs from 'highlight.js/lib/core'
import MarkdownIt from 'markdown-it'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, grid, substitute } from './layout'
import { border, clas, cssVar, padding, pc } from './theme'
import { bond } from './ui'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
    },
    body: {
      flexGrow: 1,
    },
    markdown: {
      $nest: {
        '&>*:first-child': {
          marginTop: 0
        },
        '&>*:last-child': {
          marginBottom: 0
        },
        a: {
          color: cssVar('$themePrimary'),
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
          borderBottom: border(1, cssVar('$text5')),
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
const highlightSyntax = async (str: S, language: S, codeBlockId: S) => {
  const codeBlock = document.getElementById(codeBlockId)
  if (!codeBlock) return
  if (language) {
    try {
      const [languageModule] = await Promise.all([
        // https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars.
        import(`../node_modules/highlight.js/es/languages/${language}.js`),
        import('highlight.js/styles/androidstudio.css')
      ])
      hljs.registerLanguage(language, languageModule.default)

      // Replace the code block with highlighted code.
      codeBlock.outerHTML = `<code class="hljs">${hljs.highlight(str, { language, ignoreIllegals: true }).value}</code>`
    } catch (e) {
      console.error(e)
    }
  }
}

export const
  markdown = MarkdownIt({
    html: true, linkify: true, typographer: true, highlight: (str, language) => {
      const codeBlockId = xid()
      // HACK: MarkdownIt does not support async rules. Render the code block with hidden visibility and highlight it later.
      // https://github.com/markdown-it/markdown-it/blob/master/docs/development.md#i-need-async-rule-how-to-do-it
      setTimeout(() => highlightSyntax(str, language, codeBlockId), 0)
      return `<code id='${codeBlockId}' style="visibility: hidden" class="hljs">${str}</code>`
    }
  }),
  Markdown = ({ source }: { source: S }) => {
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const hrefAttr = (e.target as HTMLAnchorElement).getAttribute('href')
      if (e.target instanceof HTMLAnchorElement && hrefAttr?.startsWith('?')) {
        // Handled in app.tsx. 
        window.dispatchEvent(new CustomEvent('md-link-click', { detail: hrefAttr.substring(1) }))
        e.preventDefault()
        e.stopPropagation()
        // Prevent navigation behavior.
        return false
      }
    }
    return <div onClick={onClick} className={clas(css.markdown, 'wave-markdown')} dangerouslySetInnerHTML={{ __html: markdown.render(source) }} />
  }

/**
 * Create a card that renders Markdown content.
 *
 * Github-flavored markdown is supported.
 * HTML markup is allowed in markdown content.
 * URLs, if found, are displayed as hyperlinks.
 * Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.
 * :icon "InsertTextBox"
 */
interface State {
  /**
   * The title for this card.
   * :t "textbox"
   * :value "Untitled Content"
   **/
  title: S
  /**
   * The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/
   * :t "textarea"
   * :value "Hello, World!"
   **/
  content: S
  /**
   * Additional data for the card.
   **/
  data?: Rec
}

export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      render = () => {
        const
          data = unpack<Rec>(state.data),
          title = substitute(state.title, data)
        return (
          <div data-test={name} className={css.card}>
            {title && <div className='wave-s12 wave-w6'>{title}</div>}
            <div className={css.body}>
              <Markdown source={substitute(state.content, data)} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('markdown', View)