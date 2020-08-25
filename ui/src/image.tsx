import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, Format } from './layout'
import { bond, Card, Rec, S } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
  })

/** Create a card that displays a base64-encoded image. */
interface State {
  /** The card's title. */
  title: S
  /** The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. */
  type: S
  /** Image data, base64-encoded. */
  image: S
  /** Data for this card. */
  data?: Rec
}

export const
  View = bond(({ state: s, changed }: Card<State>) => {
    const
      render = () => {
        const src = `data:image/${s.type};base64,${s.image}`
        return (
          <div data-test='image' className={css.card}>
            <div className={css.title}>
              <Format data={s.data} format={s.title} />
            </div>
            <div>
              <img alt='generated' src={src} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('image', View)

