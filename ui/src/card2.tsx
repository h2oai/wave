import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Format, grid } from './grid';
import { bond, Card, decode, F, Rec, S, TupleSet } from './telesync';
import { getTheme } from './theme';
import { MicroBars } from './parts/microbars';
import { MicroArea } from './parts/microline';

const
  theme = getTheme(),
  plotWidth = grid.unitWidth - grid.gap,
  plotHeight = grid.unitInnerHeight,
  css = stylesheet({
    card: {
      display: 'flex',
    },
    left: {
      width: plotWidth,
      height: grid.unitInnerHeight,
      marginRight: grid.gap,
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
      flexGrow: 1,
      ...theme.font.s13,
      color: theme.colors.text7,
      marginLeft: 5,
      marginBottom: 3,
    }
  })

interface State {
  title: S
  value: S
  aux_value: S
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
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
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
            <div className={css.left}>{plot}</div>
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

cards.register('card2', View)
