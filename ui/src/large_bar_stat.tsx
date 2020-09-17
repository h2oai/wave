import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format } from './grid_layout'
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
      justifyContent: 'space-between',
      ...theme.font.s18,
      ...theme.font.w3,
    },
    value: {
    },
    aux_value: {
      color: theme.colors.text7,
    },
    caption: {
      ...theme.font.s13,
      color: theme.colors.text5,
    },
    captions: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      ...theme.font.s12,
      color: theme.colors.text7,
    },
    value_caption: {
    },
    aux_value_caption: {
    },
  })

/** Create a large captioned card displaying a primary value, an auxiliary value and a progress bar, with captions for each value. */
interface State {
  /** The card's title. */
  title: S
  /** The card's caption. */
  caption: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value, typically a target value. */
  aux_value: S
  /** The caption displayed below the primary value. */
  value_caption: S
  /** The caption displayed below the auxiliary value. */
  aux_value_caption: S
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
        const
          data = unpack(s.data)

        return (
          <div data-test='large_bar_stat' className={css.card}>
            <div className={css.title}>
              <Format data={data} format={s.title} />
            </div>
            <div className={css.caption}>
              <Format data={data} format={s.caption} />
            </div>
            <div>
              <div className={css.values}>
                <div className={css.value}>
                  <Format data={data} format={s.value} />
                </div>
                <div className={css.aux_value}>
                  <Format data={data} format={s.aux_value} />
                </div>
              </div>
              <ProgressBar thickness={2} color={theme.color(s.plot_color)} value={s.progress} />
              <div className={css.captions}>
                <div className={css.value_caption}>
                  <Format data={data} format={s.value_caption} />
                </div>
                <div className={css.aux_value_caption}>
                  <Format data={data} format={s.aux_value_caption} />
                </div>
              </div>
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('large_bar_stat', View)

