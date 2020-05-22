import React from 'react';
import { stylesheet } from 'typestyle';
import bond from '../bond';
import { Card, decode, F, Rec, S, TupleSet } from '../delta';
import { cards, Format, grid } from '../grid';
import { getTheme } from '../theme';
import { MicroBars } from './microbars';
import { MicroArea } from './microline';

const
  theme = getTheme(),
  plotHeight = grid.unitInnerHeight - 10,
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    titleBar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    value: {
      ...theme.font.s12,
    },
    plot: {
      position: 'absolute',
      left: -grid.gap,
      bottom: -grid.gap,
      height: plotHeight,
    },
  })

interface State {
  title: S
  value: S
  data: Rec
  plot_type: 'area' | 'interval'
  plot_data: TupleSet
  plot_color: S
  plot_category: S
  plot_value: S
  plot_zero_value: F
  plot_curve: S
}



const defaults: Partial<State> = {
  title: 'Untitled',
  plot_type: 'area',
  plot_color: theme.colors.gray,
  plot_curve: 'linear',
}

const
  View = bond(({ state, changed, size }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          plotWidth = size ? size.width : grid.unitWidth,
          data = decode(s.data),
          plot = s.plot_type === 'area'
            ? (
              <MicroArea
                width={plotWidth}
                height={plotHeight}
                data={decode(s.plot_data)}
                value={s.plot_value}
                color={s.plot_color}
                zeroValue={s.plot_zero_value}
                curve={s.plot_curve}
              />
            ) : (
              <MicroBars
                width={plotWidth}
                height={plotHeight}
                data={decode(s.plot_data)}
                category={s.plot_category}
                value={s.plot_value}
                color={s.plot_color}
                zeroValue={s.plot_zero_value}
              />
            )
        return (
          <div className={css.card}>
            <div className={css.titleBar}>
              <div className={css.title}>
                <Format data={data} format={s.title} />
              </div>
              <div className={css.value}>
                <Format data={data} format={s.value} />
              </div>
            </div>
            <div className={css.plot}>{plot}</div>
          </div>)
      }
    return { render, changed }
  })

cards.register('card7', View)
