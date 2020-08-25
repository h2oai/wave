import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format } from './layout'
import { bond, Card, unpack, Rec, S } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    item: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    left: {
      flexDirection: 'column',
    },
    right: {
      flexDirection: 'column',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    caption: {
      ...theme.font.s13,
      color: theme.colors.text5,
    },
    value: {
      ...theme.font.s12,
    },
    aux_value: {
      ...theme.font.s13,
      color: theme.colors.text5,
    },
  })

/** EXPERIMENTAL. DO NOT USE. */
interface State {
  /** EXPERIMENTAL. DO NOT USE. */
  title: S
  /** EXPERIMENTAL. DO NOT USE. */
  caption: S
  /** EXPERIMENTAL. DO NOT USE. */
  value: S
  /** EXPERIMENTAL. DO NOT USE. */
  aux_value: S
  /** EXPERIMENTAL. DO NOT USE. */
  data: Rec
}

const defaults: Partial<State> = {
  title: 'Untitled',
}

export const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          data = unpack(s.data)

        return (
          <div data-test='list_item_1' className={css.item}>
            <div className={css.left}>
              <div className={css.title}>
                <Format data={data} format={s.title} />
              </div>
              <div className={css.caption}>
                <Format data={data} format={s.caption} />
              </div>
            </div>
            <div className={css.right}>
              <div className={css.value}>
                <Format data={data} format={s.value} />
              </div>
              <div className={css.aux_value}>
                <Format data={data} format={s.aux_value} />
              </div>
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('list_item1', View)


