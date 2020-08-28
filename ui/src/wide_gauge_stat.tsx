import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Format, grid } from './layout';
import { bond, Card, unpack, F, Rec, S } from './qd';
import { getTheme } from './theme';
import { ProgressArc } from './parts/progress_arc';

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
    },
    left: {
      width: grid.unitInnerHeight,
      height: grid.unitInnerHeight,
      marginRight: grid.gap,
    },
    percentContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'absolute',
      left: 0,
      top: 0,
      width: grid.unitInnerHeight,
      height: grid.unitInnerHeight,
    },
    percent: {
      ...theme.font.s12,
      opacity: 0.5,
    },
    right: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'space-between',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
      overflow: 'visible'
    },
    values: {
      display: 'flex',
      alignItems: 'baseline',
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    },
    aux_value: {
      ...theme.font.s13,
      color: theme.colors.text7,
      flexGrow: 1,
      marginLeft: 5,
    }
  })

/** Create a wide stat card displaying a primary value, an auxiliary value and a progress gauge. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value displayed next to the primary value. */
  aux_value: S
  /** The value of the progress gauge, between 0 and 1. */
  progress: F
  /** The color of the progress gauge. */
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
          <div data-test='wide-gauge-stat' className={css.card}>
            <div className={css.left}>
              <ProgressArc size={grid.unitInnerHeight} thickness={2} color={theme.color(s.plot_color)} value={s.progress} />
              <div className={css.percentContainer}>
                <div className={css.percent}>{`${Math.round(s.progress * 100)}%`}</div>
              </div>
            </div>
            <div className={css.right}>
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
            </div>
          </div>)
      }
    return { render, changed }
  })

cards.register('wide_gauge_stat', View)
