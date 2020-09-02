import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Format, grid } from './layout';
import { bond, Card, unpack, F, Rec, S, Data } from './qd';
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

/** Create a wide stat card displaying a primary value, an auxiliary value and a series plot. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** The auxiliary value displayed below the primary value. */
  aux_value: S
  /** The plot's data. */
  plot_data: Data
  /** The data field to use for y-axis values. */
  plot_value: S
  /** The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used. */
  plot_zero_value?: F
  /** The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'. */
  plot_category?: S
  /** The type of plot. Defaults to `area`. */
  plot_type?: 'area' | 'interval'
  /** The plot's curve style. Defaults to `linear`. */
  plot_curve?: 'linear' | 'smooth' | 'step' | 'step-after' | 'step-before'
  /** The plot's color. */
  plot_color?: S
  /** Data for this card. */
  data?: Rec
}

export const
  View = bond(({ state: s, changed }: Card<State>) => {
    const
      render = () => {
        const
          data = unpack(s.data),
          plot = s.plot_type === 'interval'
            ? (
              <MicroBars
                width={plotWidth}
                height={plotHeight}
                data={unpack(s.plot_data)}
                category={s.plot_category}
                value={s.plot_value}
                color={theme.color(s.plot_color)}
                zeroValue={s.plot_zero_value}
              />
            ) : (
              <MicroArea
                width={plotWidth}
                height={plotHeight}
                data={unpack(s.plot_data)}
                value={s.plot_value}
                color={theme.color(s.plot_color)}
                zeroValue={s.plot_zero_value}
                curve={s.plot_curve || 'linear'}
              />
            )

        return (
          <div data-test='wide_series_stat' className={css.card}>
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

cards.register('wide_series_stat', View)
