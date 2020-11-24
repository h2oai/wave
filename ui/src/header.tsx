import { FontIcon, Panel, PanelType } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { bond, Box, box, Card, S } from './qd'
import { clas, getTheme } from './theme'
import { NavGroup, XNav } from './nav'

const
  theme = getTheme(),
  iconSize = 24,
  css = stylesheet({
    card: {
      position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
      display: 'flex',
      alignItems: 'center',
    },
    lhs: {
      width: iconSize + 15,
      height: iconSize + 15,
      display: 'flex',
      alignItems: 'center',
      cursor: 'default',
    },
    burger: {
      $nest: {
        '&:hover': {
          color: theme.colors.page, // TODO improve
          cursor: 'pointer',
        },
      },
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
      ...theme.font.w3,
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
  /** The navigation menu to display when the header's icon is clicked. */
  nav?: NavGroup[]
}

const
  Navigation = bond(({ items, isOpenB }: { items: NavGroup[], isOpenB: Box<boolean> }) => {
    const
      hideNav = () => isOpenB(false),
      render = () => (
        <Panel
          isLightDismiss
          type={PanelType.smallFixedNear}
          isOpen={isOpenB()}
          onDismiss={hideNav}
          hasCloseButton={false}
        >
          <XNav items={items} />
        </Panel>
      )
    return { render, isOpenB }
  })

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      navB = box(false),
      showNav = () => navB(true),
      render = () => {
        const
          { title, subtitle, icon, icon_color, nav } = state,
          burger = nav
            ? (
              <div className={clas(css.lhs, css.burger)} onClick={showNav}>
                <FontIcon className={css.icon} iconName='GlobalNavButton' />
              </div>
            ) : (
              <div className={css.lhs}>
                <FontIcon className={css.icon} iconName={icon ?? 'WebComponents'} style={{ color: theme.color(icon_color) }} />
              </div>
            )

        return (
          <div data-test={name} className={css.card}>
            {burger}
            <div className={css.rhs}>
              <div className={css.title}>{title}</div>
              <div className={css.subtitle}>{subtitle}</div>
            </div>
            {nav && <Navigation items={nav} isOpenB={navB} />}
          </div>
        )
      }
    return { render, changed }
  })

cards.register('header', View, CardEffect.Raised)


