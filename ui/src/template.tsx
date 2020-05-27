
import Handlebars from 'handlebars';
import React from 'react';
import { stylesheet } from 'typestyle';
import { bond, Card, unpack, Rec, S } from './telesync';
import { cards, Format } from './grid';
import { getTheme } from './theme';

const
  theme = getTheme(),
  css = stylesheet({
    titledCard: {

    },
    untitledCard: {
      display: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
  })

/** Render dynamic content using a HTML template.*/
interface State {
  /** The title for this card.*/
  title: S
  /** The Handlebars template. https://handlebarsjs.com/guide/ */
  html: S
  /** Data for the Handlebars template */
  data?: Rec
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      template = Handlebars.compile(state.html),
      render = () => {
        const
          data = unpack(state.data || {}),
          html = { __html: template(data) }
        return state.title
          ? (
            <div className={css.titledCard}>
              <div className={css.title}><Format data={data} format={state.title} /></div>
              <div dangerouslySetInnerHTML={html}></div>
            </div>
          )
          : (
            <div className={css.untitledCard} dangerouslySetInnerHTML={html} />
          )

      }
    return { render, changed }
  })

cards.register('template', View)
