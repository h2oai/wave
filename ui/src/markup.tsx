import React from 'react';
import { stylesheet } from 'typestyle';
import { cards } from './layout';
import { bond, Card, S } from './telesync';
import { getTheme } from './theme';

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
interface State {
  /** The title for this card.*/
  title: S
  /** The HTML content. */
  content: S
}

export const
  Markup = ({ content }: { content: S }) => {
    const html = { __html: content }
    return <div dangerouslySetInnerHTML={html} />
  },
  MarkupCard = ({ title, content }: { title: S, content: S }) => (
    title
      ? (
        <div className={css.titledCard}>
          <div className={css.title}>{title}</div>
          <Markup content={content} />
        </div>
      )
      : (
        <div className={css.untitledCard}>
          <Markup content={content} />
        </div>
      )
  )

const
  View = bond(({ state, changed }: Card<State>) => {
    const render = () => <MarkupCard title={state.title} content={state.content} />
    return { render, changed }
  })

cards.register('markup', View)


