import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format } from './layout'
import { bond, Card, unpack, F, Rec, S } from './qd'
import { getTheme } from './theme'
import { ProgressBar } from './parts/progress_bar'

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

/** Create a wide stat card displaying a primary value, an auxiliary value and a progress bar. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value displayed next to the primary value. */
  aux_value: S
  /** The value of the progress bar, between 0 and 1. */
  progress: F
  /** The color of the progress bar. */
  plot_color?: S
  /** Data for this card. */
  data?: Rec
}

export const
  View = bond(({ state: s, changed }: Card<State>) => {
    const
      render = () => {
        const data = unpack(s.data)

        return (
          <div data-test='wide_bar_stat' className={css.card}>
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
            <ProgressBar thickness={2} color={theme.color(s.plot_color)} value={s.progress} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('wide_bar_stat', View)
