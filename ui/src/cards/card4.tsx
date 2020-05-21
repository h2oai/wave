import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, decode, F, Rec, S } from '../delta';
import { cards, Format, grid } from '../grid';
import { ProgressArc } from './progress_arc';
import { getTheme } from '../theme';
import bond from '../bond';

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

interface State {
  title: S
  value: S
  aux_value: S
  progress: F
  plot_color: S
  data: S | Rec
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
            <div className={css.left}>
              <ProgressArc size={grid.unitInnerHeight} thickness={2} color={s.plot_color} value={s.progress} />
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

cards.register('card4', View)
