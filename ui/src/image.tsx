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
    img: {
      flexGrow: 1,
      objectFit: 'contain',
      maxHeight: 'calc(100% - 20px)'
    }
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
  View = bond(({ name, state: s, changed }: Card<State>) => {
    const render = () => (
      <div data-test={name} className={css.card}>
        <div className={css.title}>
          <Format data={s.data} format={s.title} />
        </div>
        <img className={css.img} alt={s.title} src={`data:image/${s.type};base64,${s.image}`} />
      </div>
    )

    return { render, changed }
  })

cards.register('image', View)

