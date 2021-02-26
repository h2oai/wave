// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { FontIcon, Panel, PanelType } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { NavGroup, XNav } from './nav'
import { bond, Box, box, Card, S, B } from './qd'
import { clas, cssVar, padding } from './theme'

const
  iconSize = 24,
  css = stylesheet({
    card: {
      display: 'flex',
      alignItems: 'center',
      padding: padding(8, 15),
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
          color: cssVar('page'),
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
    subtitle: {
      position: 'relative',
      top: -5, // nudge up slightly to account for padding
    },
  })


/**
 * Render a page header displaying a title, subtitle and an optional navigation menu.
 * Header cards are typically used for top-level navigation.
 * :icon "Header"
 */
interface State {
  /**
   * The title.
   * :t "textbox"
   * :value "Untitled Page"
   **/
  title: S
  /**
   * The subtitle, displayed below the title.
   * :t "textbox"
   * :value "Powered by H2O Wave."
   **/
  subtitle: S
  /**
   * The icon, displayed to the left.
   * :t "textbox"
   * :value "AppIconDefault"
   **/
  icon?: S
  /**
   * The icon's color.
   * :t "textbox"
   * :value "yellow"
   **/
  icon_color?: S
  /**
   * The navigation menu to display when the header's icon is clicked.
   **/
  nav?: NavGroup[]
}

const
  Navigation = bond(({ items, isOpenB }: { items: NavGroup[], isOpenB: Box<B> }) => {
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
                <FontIcon className={css.icon} iconName={icon ?? 'WebComponents'} style={{ color: cssVar(icon_color) }} />
              </div>
            )

        return (
          <div data-test={name} className={css.card}>
            {burger}
            <div className={css.rhs}>
              <div className='wave-s24 wave-w3'>{title}</div>
              <div className={clas(css.subtitle, 'wave-s12')}>{subtitle}</div>
            </div>
            {nav && <Navigation items={nav} isOpenB={navB} />}
          </div>
        )
      }
    return { render, changed }
  })

cards.register('header', View, CardEffect.Raised)


