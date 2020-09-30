import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Header } from './header'
import { bond, S, box, Card } from './qd'
import { border, getTheme, pc, topNavBreakpoint, padding } from './theme'
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
        ...topNavBreakpoint({
          justifyContent: 'center'
        })
      }
    },
    toolbar: {
      $nest: {
        ...topNavBreakpoint({
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
            }
          }
        })
      }
    }
  })

/**
 * Navigation component that is fixed at the top.
 */
interface State {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. */
  subtitle: S
  /** Navigation tabs links to be displayed in top nav. */
  items: Command[]
  /** The icon type, displayed to the left. */
  icon?: S
  /** The icon's color. */
  icon_color?: S
}

export const View = bond(({ state, changed }: Card<State>) => {
  const
    render = () => (
      <Fluent.Stack className={css.topNav} horizontal horizontalAlign='space-between' verticalAlign='center'>
        <Header title={state.title} subtitle={state.subtitle} icon={state.icon} icon_color={state.icon_color} />
        <div className={css.toolbar}>
          <Toolbar name='Toolbar' state={{ items: state.items }} changed={box(false)} />
        </div>
      </Fluent.Stack>
    )
  return { render, changed }
})

cards.register('top_nav', View)