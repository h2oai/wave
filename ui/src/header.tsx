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

import * as Fluent from '@fluentui/react'
import { B, Box, box, Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XInline } from './form'
import { CardEffect, cards, getEffectClass } from './layout'
import { NavGroup, XNav } from './nav'
import { centerMixin, clas, cssVar, important, padding, px } from './theme'
import { Command } from './toolbar'
import { bond } from './ui'

const css = stylesheet({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: padding(10, 15),
    $nest: {
      '.ms-layer': {
        display: 'none', // HACK: Opening Fluent side panel adds a span element to header (for some reason), disrupting the layout.
      },
    }
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'default',
  },
  burger: {
    cursor: 'pointer',
    fontSize: important(px(24)),
    width: 25,
    height: 40,
    ...centerMixin()
  },
  logo: {
    width: 56,
    height: 56,
    marginRight: 15,
    borderRadius: 2,
    cursor: 'pointer'
  },
  icon: {
    fontSize: 36,
    marginRight: 15,
  },
  title: {
    color: cssVar('$themePrimary')
  },
  subtitle: {
    marginTop: -5, // Nudge up slightly to account for padding.
  },
})

/**
 * Render a page header displaying a title, subtitle and an optional navigation menu.
 * Header cards are typically used for top-level navigation.
 */
interface State {
  /** The title. **/
  title: S
  /** The subtitle, displayed below the title. **/
  subtitle: S
  /** The icon, displayed to the left. **/
  icon?: S
  /** The icon's color. **/
  icon_color?: S
  /** The logo displayed to the left. Mutually exclusive with icon. **/
  image?: S
  /** The navigation menu to display when the header's icon is clicked. Recommended for mobile screens only. **/
  nav?: NavGroup[]
  /** Items that should be displayed on the right side of the header. */
  items?: Component[]
  /** Items that should be displayed in the center of the header. */
  secondary_items?: Component[]
  /** Header background color. Defaults to 'primary'. */
  color?: 'card' | 'transparent' | 'primary'
}

const
  Navigation = bond(({ items, isOpenB }: { items: NavGroup[], isOpenB: Box<B> }) => {
    const
      hideNav = () => isOpenB(false),
      render = () => (
        <Fluent.Panel
          isLightDismiss
          type={Fluent.PanelType.smallFixedNear}
          isOpen={isOpenB()}
          onDismiss={hideNav}
          hasCloseButton={false}
        >
          <XNav items={items} hideNav={hideNav} />
        </Fluent.Panel>
      )
    return { render, isOpenB }
  }),
  toCardEffect = (color?: 'card' | 'transparent' | 'primary') => {
    switch (color) {
      case 'card': return CardEffect.Normal
      case 'transparent': return CardEffect.Transparent
      case 'primary': return CardEffect.Raised
      default: return CardEffect.Raised
    }
  }


export const View = bond(({ name, state, changed }: Model<State & { commands: Command[] }>) => {
  const
    navB = box(false),
    showNav = () => navB(true),
    onLogoClick = () => window.location.hash = '',
    render = () => {
      const { title, subtitle, icon, icon_color, nav, items, image, secondary_items, color = 'primary' } = state
      return (
        <div data-test={name} className={clas(css.card, getEffectClass(toCardEffect(color)))}>
          <div className={css.inline}>
            {nav && <Fluent.FontIcon onClick={showNav} className={clas(css.icon, css.burger)} iconName='GlobalNavButton' style={{ color: color === 'primary' ? cssVar('$card') : undefined }} />}
            {image && <Fluent.Image src={image} className={css.logo} imageFit={Fluent.ImageFit.centerCover} onClick={onLogoClick} />}
            {icon && !image && <Fluent.FontIcon className={css.icon} iconName={icon} style={{ color: cssVar(icon_color) }} />}
            <div>
              <div className={clas(color !== 'primary' ? css.title : '', 'wave-s24 wave-w5')}>{title}</div>
              {subtitle && <div className={clas(css.subtitle, 'wave-s12')}>{subtitle}</div>}
            </div>
          </div>
          {secondary_items && <XInline model={{ items: secondary_items }} />}
          {items && <XInline model={{ items }} />}
          {nav && <Navigation items={nav} isOpenB={navB} />}
        </div>
      )
    }
  return { render, changed }
})

cards.register('header', View, { effect: CardEffect.Transparent, marginless: true })