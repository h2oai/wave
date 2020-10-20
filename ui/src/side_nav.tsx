import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards } from './grid_layout'
import { Header, State as HeaderState } from "./header"
import { NavGroup, View as Nav } from "./nav"
import { bond, box, Card, S } from './qd'
import { clas, collapsedSideNavWidth, getTheme, mobileBreakpoint, pc, sideNavWidth, topNavHeight } from './theme'
import { NestedCSSSelectors } from 'typestyle/lib/types'

const
  { colors } = getTheme(),
  expandedStyles: NestedCSSSelectors = {
    '.is-expanded + ul': {
      display: 'inherit',
    },
    '.ms-Nav-chevronButton': {
      display: 'inherit',
    },
    'div[class*=sideNavHeader]': {
      opacity: 1,
      height: 'auto',
    },
    'div[class*=sideNavHeader] div[class*=subtitle]': {
      whiteSpace: 'inherit',
    }
  },
  css = stylesheet({
    sideNav: {
      position: 'fixed',
      height: pc(100),
      zIndex: 2,
      background: colors.card,
      transition: 'width .5s',
      width: collapsedSideNavWidth,
      $nest: {
        '&:hover': {
          width: sideNavWidth,
          ...expandedStyles
        },
        '.is-expanded + ul': {
          display: 'none'
        },
        '.ms-Nav': {
          overflow: 'hidden'
        },
        '.ms-Nav .ms-Icon': {
          marginLeft: 8
        },
        '.ms-Nav-chevronButton': {
          display: 'none',
          left: 'initial',
          right: 10
        },
        'div[class*=sideNavHeader]': {
          transition: 'opacity .5s .5s',
          whiteSpace: 'nowrap',
          opacity: 0,
          height: 0,
          overflow: 'hidden',
          margin: 0
        },
        'div[class*=sideNavHeader] div[class*=subtitle]': {
          whiteSpace: 'nowrap',
        },
        '~ main': {
          marginLeft: collapsedSideNavWidth
        },
        ...mobileBreakpoint({
          top: topNavHeight,
          width: sideNavWidth,
          $nest: {
            ...expandedStyles,
            '~ main': {
              top: topNavHeight,
              marginLeft: 0
            }
          }
        })
      }
    },
    collapsed: {
      $nest: {
        ...mobileBreakpoint({
          width: 0,
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
  SideNavHeader = (s: HeaderState & { name: S }) => {
    return (
      <div className={css.sideNavHeader}>
        <Header {...{ ...s, name: `${s.name}-top-nav-header` }} />
      </div>
    )
  }

export const View = bond((card: Card<State>) => {
  const
    isCollapsedB = box(window.innerWidth <= 600),
    toggleCollapse = () => isCollapsedB(!isCollapsedB()),
    render = () => (
      <>
        <nav className={clas(css.sideNav, isCollapsedB() ? css.collapsed : '')}>
          {card.state.header && <SideNavHeader {...{ ...card.state.header, name: card.name }} />}
          <Nav {...card} />
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