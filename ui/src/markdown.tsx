import markdownit from 'markdown-it';
import React from 'react';
import { cards, substitute } from './layout';
import { bond, Card, Rec, S, unpack } from './qd';
import { MarkupCard } from './markup'

export const
  markdown = markdownit({ html: true, linkify: true, typographer: true, }),
  markdownSafe = markdownit({ typographer: true, linkify: true }),
  Markdown = ({ source }: { source: S }) => (<div dangerouslySetInnerHTML={{ __html: markdown.render(source) }} />),
  MarkdownSafe = ({ source }: { source: S }) => (<div dangerouslySetInnerHTML={{ __html: markdownSafe.render(source) }} />),
  MarkdownInline = ({ source }: { source: S }) => (<span dangerouslySetInnerHTML={{ __html: markdownSafe.renderInline(source) }} />)

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

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const data = unpack(state.data)
        return (
          <MarkupCard
            title={substitute(state.title, data)}
            content={markdown.render(substitute(state.content, data))}
          />
        )
      }
    return { render, changed }
  })

cards.register('markdown', View)