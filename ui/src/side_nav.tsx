import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './grid_layout'
import { Header, State as HeaderState } from "./header"
import { NavGroup, View as Nav } from "./nav"
import { bond, box, Card, S } from './qd'
import { clas, getTheme, mobileBreakpoint, pc } from './theme'

const
  { colors } = getTheme(),
  css = stylesheet({
    sideNav: {
      position: 'fixed',
      height: pc(100),
      zIndex: 1,
      background: colors.card,
      transition: 'transform .5s',
      width: 300,
      $nest: {
        '> div': {
          paddingRight: 40
        },
        ...mobileBreakpoint({
          $nest: {
            '~ main': {
              marginLeft: 0,
              top: 80
            },
            '&': {
              top: 80
            }
          }
        })
      }
    },
    collapsed: {
      transform: 'translateX(-260px)',
      $nest: {
        '~ main': {
          marginLeft: 40
        },
        ...mobileBreakpoint({
          transform: 'translateX(-300px)',
          $nest: {
            '~ main': {
              marginLeft: 0,
            }
          }
        })
      }
    },
    mobileCollapseBtn: {
      display: 'none',
      $nest: {
        ...mobileBreakpoint({
          display: 'block',
          zIndex: 2,
          position: 'fixed',
          top: 25,
          left: 25
        })
      }
    },
    desktopCollapseBtn: {
      position: 'absolute',
      top: '45%',
      right: 5,
      $nest: {
        ...mobileBreakpoint({
          display: 'none',
        })
      }
    },
    sideNavHeader: {
      textAlign: 'center',
      margin: 40,
      $nest: {
        ...mobileBreakpoint({
          display: 'none'
        }),
        '> header': {
          flexDirection: 'column'
        }
      }
    },
  })

interface SideNavHeader {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. */
  subtitle: S
  /** The icon type, displayed to the left. */
  icon?: S
  /** The icon's color. */
  icon_color?: S
}
/*
  * Collapsible navigation drawer that is fixed at the left.
  */
export interface State {
  /** The navigation groups contained in this pane. */
  items: NavGroup[]
  /** Render a branding header as part of the side navigation. */
  header?: SideNavHeader
}

const
  SideNavHeader = (s: HeaderState) => {
    return (
      <div className={css.sideNavHeader}>
        <Header {...s} />
      </div>
    )
  }

export const View = bond((card: Card<State>) => {
  const
    isCollapsedB = box(window.innerWidth <= 600),
    toggleCollapse = () => {
      isCollapsedB(!isCollapsedB())
      // Trigger resize event in order to inform plots they should resize themselves to fit the new parent container.
      // The timeout is specified due to animation and has to be synced with it.
      setTimeout(() => {
        const event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, false)
        document.dispatchEvent(event)
      }, 501)
    },
    render = () => (
      <>
        <nav className={clas(css.sideNav, isCollapsedB() ? css.collapsed : '')}>
          {card.state.header && <SideNavHeader {...card.state.header} />}
          <Nav {...card} />
          <Fluent.IconButton
            className={css.desktopCollapseBtn}
            styles={{ icon: { fontSize: 25, transform: isCollapsedB() ? 'rotate(180deg)' : undefined, transition: 'transform 1s' } }}
            iconProps={{ iconName: 'SkypeCircleArrow' }}
            onClick={toggleCollapse} />
        </nav>
        <Fluent.IconButton
          className={css.mobileCollapseBtn}
          styles={{ icon: { fontSize: 25 } }}
          iconProps={{ iconName: 'CollapseMenu' }}
          onClick={toggleCollapse} />
      </>
    )
  return { render, isCollapsedB }
})

cards.register('side-nav', View)