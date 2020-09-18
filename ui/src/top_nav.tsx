import React from 'react'
import { bond, S } from './qd'
import { Tab } from './tabs'
import { Header } from './header'
import * as Fluent from '@fluentui/react'
import { TabComponent } from './tab'
import { stylesheet } from 'typestyle'
import { getTheme, pc, border, topNavBreakpoint } from './theme'

const
  { colors } = getTheme(),
  css = stylesheet({
    topNav: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1,
      padding: 15,
      width: pc(100),
      background: colors.card,
      borderBottom: border(1, colors.page),
      $nest: {
        ...topNavBreakpoint({
          justifyContent: 'center'
        })
      }
    },
    tabs: {
      $nest: {
        ...topNavBreakpoint({
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 1,
          padding: '15px 5px',
          width: pc(100),
          background: colors.card,
          borderTop: border(1, colors.page),
          $nest: {
            '.ms-Pivot': {
              display: 'flex',
              justifyContent: 'space-evenly'
            },
            '.ms-Pivot-icon, .ms-Pivot-text': {
              display: 'block',
              lineHeight: 'initial'
            },
            'button': {
              display: 'block'
            }
          }
        })
      }
    }
  })

/**
 * Navigation component that is fixed at the top.
 */
export interface TopNav {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. */
  subtitle: S
  /** Navigation tabs links to be displayed in top nav. */
  items: Tab[]
  /** The icon type, displayed to the left. */
  icon?: S
  /** The icon's color. */
  icon_color?: S
}

export const TopNav = bond(({ title, subtitle, icon, icon_color, items }: TopNav) => {
  const
    render = () => (
      <Fluent.Stack className={css.topNav} horizontal horizontalAlign='space-between'>
        <Header title={title} subtitle={subtitle} icon={icon} icon_color={icon_color} />
        <div className={css.tabs}>
          <TabComponent items={items} link={true} />
        </div>
      </Fluent.Stack>
    )
  return { render }
})