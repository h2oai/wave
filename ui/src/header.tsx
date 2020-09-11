import { FontIcon } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './layout'
import { bond, Card, S } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  iconSize = 36,
  css = stylesheet({
    card: {
      position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
      display: 'flex',
      alignItems: 'center',
    },
    lhs: {
      width: iconSize + 10,
      height: iconSize,
    },
    icon: {
      fontSize: iconSize,
      height: iconSize,
      width: iconSize,
    },
    rhs: {
      flexGrow: 1
    },
    title: {
      ...theme.font.s24,
      ...theme.font.w6,
    },
    subtitle: {
      position: 'relative',
      top: -5, // nudge up slightly to account for padding
      ...theme.font.s12,
    },
  })


/**
 * Render a card containing a HTML page inside an inline frame (iframe).
 *
 * Either a path or content can be provided as arguments.
 */
interface State {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. */
  subtitle: S
  /** The icon type, displayed to the left. */
  icon?: S
  /** The icon's color. */
  icon_color?: S
}

export const
  View = bond(({ state, changed }: Card<State>) => {
    const render = () => (
      <div data-test='header' className={css.card}>
        <div className={css.lhs}>
          <FontIcon className={css.icon} style={{ color: theme.color(state.icon_color) }} iconName={state.icon || 'WebComponents'} />
        </div>
        <div className={css.rhs}>
          <div className={css.title}>{state.title}</div>
          <div className={css.subtitle}>{state.subtitle}</div>
        </div>
      </div>
    )
    return { render, changed }
  })

cards.register('header', View)

