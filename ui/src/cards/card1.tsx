import React from 'react';
import { stylesheet } from 'typestyle';
import bond from '../bond';
import { Card, decode, Rec, S } from '../delta';
import { cards, Format } from '../grid';
import { getTheme } from '../theme';

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    }
  })

interface State {
  title: S
  value: S
  data?: Rec
}

const defaults: Partial<State> = {
  title: 'Untitled',
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          data = decode(s.data)
        return (
          <div className={css.card}>
            <div className={css.title}>
              <Format data={data} format={s.title} />
            </div>
            <div className={css.value}>
              <Format data={data} format={s.value} />
            </div>
          </div>)
      }
    return { render, changed }
  })


cards.register('card1', View)
