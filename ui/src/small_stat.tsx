import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format } from './layout'
import { bond, Card, Rec, S, unpack } from './qd'
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
    }
  })

/** Create a stat card displaying a single value. */
interface State {
  /** The card's title. */
  title: S
  /** The primary value displayed. */
  value: S
  /** Data for this card. */
  data?: Rec
}

export const
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => {
      const data = unpack(s.data)
      return (
        <Fluent.Stack data-test={name}>
          <Format data={data} format={s.title} className={css.title} />
          <Format data={data} format={s.value} className={css.value} />
        </Fluent.Stack>
      )
    }
    return { render, changed }
  })

cards.register('small_stat', View)