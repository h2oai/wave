import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './grid_layout'
import { Header, State as HeaderState } from "./header"
import { NavGroup, View as Nav } from "./nav"
import { bond, box, Card, S } from './qd'
import { clas, getTheme, mobileBreakpoint, pc, sideNavWidth, collapsedSideNavWidth, topNavHeight } from './theme'

const
  { colors } = getTheme(),
  css = stylesheet({
    sideNav: {
      position: 'fixed',
      height: pc(100),
      zIndex: 1,
      background: colors.card,
      transition: 'transform .5s',
      width: sideNavWidth,
      $nest: {
        '> div': {
          paddingRight: collapsedSideNavWidth
        },
        ...mobileBreakpoint({
          top: topNavHeight,
          $nest: {
            '~ main': {
              marginLeft: 0,
              top: topNavHeight
            }
          }
        })
      }
    },
    collapsed: {
      transform: `translateX(-${sideNavWidth - collapsedSideNavWidth}px)`,
      $nest: {
        '~ main': {
          marginLeft: collapsedSideNavWidth
        },
        ...mobileBreakpoint({
          transform: `translateX(-${sideNavWidth}px)`,
          $nest: {
            '~ main': {
              marginLeft: 0
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
      margin: collapsedSideNavWidth,
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

/**
 * Render a header inside top part of the side navigation.
 */
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