import { FontIcon } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './grid_layout'
import { bond, Card, S } from './qd'
import { getTheme } from './theme'

const
  theme = getTheme(),
  iconSize = 36,
  css = stylesheet({
    card: {
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
export interface State {
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
  Header = (s: State) => (
    <header data-test={name} className={css.card}>
      <div className={css.lhs}>
        <FontIcon className={css.icon} style={{ color: theme.color(s.icon_color) }} iconName={s.icon || 'WebComponents'} />
      </div>
      <div className={css.rhs}>
        <div className={css.title}>{s.title}</div>
        <div className={css.subtitle}>{s.subtitle}</div>
      </div>
    </header>
  ),
  View = bond(({ state, changed }: Card<State>) => {
    const render = () => <Header {...state} />
    return { render, changed }
  })

cards.register('header', View)

