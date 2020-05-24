import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Format } from '../grid';
import { bond, Card, decode, F, Rec, S } from '../telesync';
import { getTheme } from '../theme';
import { ProgressBar } from './parts/progress_bar';

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    value: {
      ...theme.font.s18,
      ...theme.font.w3,
    },
    aux_value: {
      ...theme.font.s13,
      color: theme.colors.text7,
      flexGrow: 1,
      marginLeft: 5,
    }
  })

interface State {
  title: S
  value: S
  aux_value: S
  progress: F
  plot_color: S
  data: Rec
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
            <div className={css.values}>
              <div className={css.value}>
                <Format data={data} format={s.value} />
              </div>
              <div className={css.aux_value}>
                <Format data={data} format={s.aux_value} />
              </div>
            </div>
            <ProgressBar thickness={2} color={s.plot_color} value={s.progress} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('card8', View)
