import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Format } from './layout';
import { bond, Card, Rec, S } from './qd';
import { getTheme } from './theme';

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
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    value: {
      ...theme.font.s40,
      ...theme.font.w2,
    },
    aux_value: {
      marginLeft: 5,
      color: theme.colors.text6,
    },
    caption: {
      ...theme.font.s13,
      color: theme.colors.text5,
    }
  })

/** Create a stat card displaying a primary value, an auxiliary value and a caption. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value displayed next to the primary value. */
  aux_value: S
  /** The caption displayed below the primary value. */
  caption: S
  /** Data for this card. */
  data?: Rec
}

const
  View = bond(({ state: s, changed }: Card<State>) => {
    const
      render = () => {
        return (
          <div className={css.card}>
            <div className={css.title}>
              <Format data={s.data} format={s.title} />
            </div>
            <div className={css.values}>
              <div className={css.value}>
                <Format data={s.data} defaultValue={s.value} format={s.value} />
              </div>
              <div className={css.aux_value}>
                <Format data={s.data} format={s.aux_value} />
              </div>
            </div>
            <div className={css.caption}>
              <Format data={s.data} format={s.caption} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('large_stat', View)
