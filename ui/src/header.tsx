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
import { bond, Box, box, Card, S } from './qd'
import { clas, getTheme, padding, cssVar } from './theme'
import { NavGroup, XNav } from './nav'

const
  theme = getTheme(),
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
 * Render a page header displaying a title, subtitle and an optional navigation menu.
 * Header cards are typically used for top-level navigation.
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
                <FontIcon className={css.icon} iconName={icon ?? 'WebComponents'} style={{ color: cssVar(icon_color as any) }} />
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


