import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Format, grid } from './layout';
import { bond, Card, unpack, F, Rec, S, Data } from './telesync';
import { getTheme } from './theme';
import { MicroBars } from './parts/microbars';
import { MicroArea } from './parts/microline';

const
  theme = getTheme(),
  plotHeight = grid.unitHeight,
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
    },
    aux_value: {
      ...theme.font.s12,
      color: theme.colors.text7,
    },
    plot: {
      position: 'absolute',
      left: -grid.gap,
      bottom: -grid.gap,
      height: plotHeight,
    }
  })

/** Create a tall stat card displaying a primary value, an auxiliary value and a series plot. */
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

const
  View = bond(({ state: s, changed, size }: Card<State>) => {
    const
      render = () => {
        const
          plotWidth = size ? size.width : grid.unitWidth,
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
          <div className={css.card}>
            <div className={css.title}>
              <Format data={data} format={s.title || 'Untitled'} />
            </div>
            <div className={css.value}>
              <Format data={data} format={s.value} />
            </div>
            <div className={css.aux_value}>
              <Format data={data} format={s.aux_value} />
            </div>
            <div className={css.plot}>{plot}</div>
          </div>)
      }
    return { render, changed }
  })

cards.register('tall_series_stat', View)


