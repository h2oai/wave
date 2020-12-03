import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format } from './layout'
import { ProgressArc } from './parts/progress_arc'
import { bond, Card, F, Rec, S, unpack } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    percentContainer: {
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0,
    },
    percent: {
      ...theme.font.s12,
      opacity: 0.5,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
      overflow: 'visible'
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
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => {
      const data = unpack(s.data)
      return (
        <Fluent.Stack horizontal data-test={name} style={{ position: 'static', padding: 15, height: '100%' }}>
          <Fluent.StackItem grow={1} styles={{ root: { position: 'relative' } }}>
            <ProgressArc thickness={2} color={theme.color(s.plot_color)} value={s.progress} />
            <Fluent.Stack horizontalAlign='center' verticalAlign='center' className={css.percentContainer}>
              <div className={css.percent}>{`${Math.round(s.progress * 100)}%`}</div>
            </Fluent.Stack>
          </Fluent.StackItem>
          <Fluent.Stack styles={{ root: { minWidth: 150 } }}>
            <Format data={data} format={s.title} className={css.title} />
            <Fluent.Stack verticalAlign='baseline' horizontal tokens={{ childrenGap: 5 }}>
              <Format data={data} format={s.value} className={css.value} />
              <Format data={data} format={s.aux_value} className={css.aux_value} />
            </Fluent.Stack>
          </Fluent.Stack>
        </Fluent.Stack>
      )
    }
    return { render, changed }
  })

cards.register('wide_gauge_stat', View)