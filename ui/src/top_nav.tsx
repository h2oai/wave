import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Header } from './header'
import { bond, S, box, Card } from './qd'
import { border, getTheme, pc, mobileBreakpoint, padding, topNavHeight } from './theme'
import { View as Toolbar, Command } from "./toolbar"
import { cards } from './grid_layout'

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
        ...mobileBreakpoint({
          justifyContent: 'center'
        }),
        '~ nav': {
          top: topNavHeight
        }
      }
    },
    toolbar: {
      $nest: {
        ...mobileBreakpoint({
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 1,
          padding: padding(15, 0, 10, 0),
          width: pc(100),
          background: colors.card,
          borderTop: border(1, colors.page),
          $nest: {
            '.ms-CommandBar-primaryCommand': {
              justifyContent: 'space-evenly'
            },
            '.ms-CommandBar': {
              padding: 0,
            },
            '.ms-Button-flexContainer': {
              flexDirection: 'column'
            },
            '.ms-Button-textContainer': {
              paddingTop: 10
            },
            '.ms-Button-icon': {
              fontSize: 20
            },
            '.ms-OverflowSet-item': {
              padding: padding(0, 10)
            }
          }
        })
      }
    }
  })

/**
 * Render a header inside top part of the side navigation.
 */
interface TopNavHeader {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. */
  subtitle: S
  /** The icon type, displayed to the left. */
  icon?: S
  /** The icon's color. */
  icon_color?: S
}

/**
 * Navigation component that is fixed at the top.
 */
export interface State {
  /** The header displayed in the top left corner. */
  header: TopNavHeader
  /** Navigation tabs links to be displayed in top nav. */
  items: Command[]
}

export const View = bond(({ state, changed, name }: Card<State>) => {
  const
    render = () => (
      <Fluent.Stack className={css.topNav} horizontal horizontalAlign='space-between' verticalAlign='center'>
        <Header {...{ ...state.header, name }} />
        {
          !!state.items.length && (
            <div className={css.toolbar}>
              <Toolbar name='Toolbar' state={{ items: state.items }} changed={box(false)} />
            </div>
          )
        }
      </Fluent.Stack>
    )
  return { render, changed }
})

cards.register('top_nav', View)