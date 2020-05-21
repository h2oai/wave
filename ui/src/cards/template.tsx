
import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, Rec, decode } from '../delta';
import { cards, Format } from '../grid';
import { getTheme } from '../theme';
import Handlebars from 'handlebars'
import bond from '../bond';

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

interface State {
  title: string
  template: string
  data: Rec
}

const defaults: Partial<State> = {
  title: ''
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      template = Handlebars.compile(state.template),
      render = () => {
        const
          s = theme.merge(defaults, state),
          data = decode(s.data),
          html = { __html: template(data) }
        return s.title
          ? (
            <div className={css.titledCard}>
              <div className={css.title}><Format data={data} format={s.title} /></div>
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
