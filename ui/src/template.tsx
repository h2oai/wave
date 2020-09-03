import Handlebars from 'handlebars';
import React from 'react';
import { cards, substitute } from './layout';
import { MarkupCard } from './markup';
import { bond, Card, Rec, S, unpack } from './qd';

/** Render dynamic content using a HTML template.*/
interface State {
  /** The title for this card.*/
  title: S
  /** The Handlebars template. https://handlebarsjs.com/guide/ */
  content: S
  /** Data for the Handlebars template */
  data?: Rec
}

export const
  View = bond(({ state, changed }: Card<State>) => {
    const
      template = Handlebars.compile(state.content || ''),
      render = () => {
        const data = unpack(state.data)
        return (
          <div data-test='template'>
            <MarkupCard title={substitute(state.title, data)} content={template(data || {})} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('template', View)
