import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format, grid } from './layout'
import { MicroBars } from './parts/microbars'
import { MicroArea } from './parts/microarea'
import { bond, Card, Data, F, Rec, S, unpack } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    },
    aux_value: {
      ...theme.font.s13,
      color: theme.colors.text7,
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
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => {
      const
        data = unpack(s.data),
        plot = s.plot_type === 'interval'
          ? (
            <MicroBars
              data={unpack(s.plot_data)}
              category={s.plot_category}
              value={s.plot_value}
              color={theme.color(s.plot_color)}
              zeroValue={s.plot_zero_value}
            />
          ) : (
            <MicroArea
              data={unpack(s.plot_data)}
              value={s.plot_value}
              color={theme.color(s.plot_color)}
              zeroValue={s.plot_zero_value}
              curve={s.plot_curve || 'linear'}
            />
          )

      return (
        <Fluent.Stack data-test={name} horizontal styles={{ root: { height: '100%' } }} style={{ position: 'static' }} >
          <Fluent.StackItem grow={1} tokens={{ padding: 15 }}>{plot}</Fluent.StackItem>
          <Fluent.StackItem styles={{ root: { padding: grid.gap, minWidth: 120 } }}>
            <Format data={data} format={s.title} className={css.title} />
            <Fluent.Stack horizontal verticalAlign='baseline' tokens={{ childrenGap: 5 }}>
              <Format data={data} format={s.value} className={css.value} />
              <Format data={data} format={s.aux_value} className={css.aux_value} />
            </Fluent.Stack>
          </Fluent.StackItem>
        </Fluent.Stack>
      )
    }
    return { render, changed }
  })

cards.register('wide_series_stat', View)