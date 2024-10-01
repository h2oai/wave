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
import { B, Box, box, Model, S } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component, XComponents } from './form'
import { CardEffect, cards, getEffectClass, toCardEffect } from './layout'
import { NavGroup, XNav } from './nav'
import { Z_INDEX } from './parts/styleConstants'
import { centerMixin, clas, cssVar, important, padding, px } from './theme'
import { Command } from './toolbar'
import { bond } from './ui'

const css = stylesheet({
  card: {
    position: 'relative',
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
    zIndex: Z_INDEX.HEADER,
  },
  center: {
    ...centerMixin(),
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
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
    display: 'flex'
  },
  title: {
    color: cssVar('$themePrimary')
  },
  nudgeUp: {
    marginTop: -5, // Nudge up slightly to account for padding.
  },
})/**
 * Render a page header displaying a title, subtitle and an optional navigation menu.
 * Header cards are typically used for top-level navigation.
 */
interface State {
    /** The title. **/
    title: S;
    /** The subtitle, displayed below the title. **/
    subtitle: S;
    /** The icon, displayed to the left. **/
    icon?: S;
    /** The icon's color. **/
    icon_color?: S;
    /** The URL of an image (usually logo) displayed to the left. Mutually exclusive with icon. **/
    image?: S;
    /** The navigation menu to display when the header's icon is clicked. Recommended for mobile screens only. **/
    nav?: NavGroup[];
    /** Items that should be displayed on the right side of the header. */
    items?: Component[];
    /** Items that should be displayed in the center of the header. */
    secondary_items?: Component[];
    /** Header background color. Defaults to 'primary'. */
    color?: 'card' | 'transparent' | 'primary';
    /**
     * An optional name for this card.
     */
    name?: S;
}

const
  Navigation = bond(({ items, isOpenB }: { items: NavGroup[], isOpenB: Box<B> }) => {
    const
      hideNav = () => isOpenB(false),
      valueB = box<S | undefined>(),
      render = () => (
        <Fluent.Panel
          isLightDismiss
          type={Fluent.PanelType.smallFixedNear}
          isOpen={isOpenB()}
          onDismiss={hideNav}
          hasCloseButton={false}
        >
          <XNav items={items} hideNav={hideNav} valueB={valueB} />
        </Fluent.Panel>
      )
    return { render, isOpenB, valueB }
  })


export const View = bond(({ name, state, changed }: Model<State & { commands: Command[] }>) => {
  const
    navB = box(false),
    showNav = () => navB(true),
    onLogoClick = () => window.location.hash = '',
    render = () => {
      const { title, subtitle, icon, color = 'primary', icon_color = color === 'primary' ? '$card' : '$text', nav, items, image, secondary_items } = state
      return (
        <div data-test={name} className={clas(css.card, getEffectClass(toCardEffect(color)))} style={{ background: color === 'transparent' ? 'transparent' : cssVar(`$${color}`) }}>
          <div className={css.inline}>
            {nav && <Fluent.Icon onClick={showNav} className={clas(css.icon, css.burger)} iconName='GlobalNavButton' style={{ color: cssVar(icon_color) }} />}
            {image && <Fluent.Image src={image} className={css.logo} imageFit={Fluent.ImageFit.centerCover} onClick={onLogoClick} />}
            {icon && !image && <Fluent.Icon className={css.icon} iconName={icon} style={{ color: cssVar(icon_color) }} />}
            <div className={css.nudgeUp}>
              <div className={clas(color !== 'primary' ? css.title : '', 'wave-s24 wave-w5')}>{title}</div>
              {subtitle && <div className={clas(css.nudgeUp, 'wave-s12')}>{subtitle}</div>}
            </div>
          </div>
          {secondary_items && <div className={css.center}><XComponents items={secondary_items} justify='start' align='center' direction='row' /></div>}
          {items && (
            <div style={{ zIndex: Z_INDEX.HEADER, marginRight: state.commands ? 30 : undefined }}>
              <XComponents items={items} justify='start' align='center' direction='row' />
            </div>
          )}
          {nav && <Navigation items={nav} isOpenB={navB} />}
        </div>
      )
    }
  return { render, changed }
})

cards.register('header', View, { effect: CardEffect.Transparent, marginless: true, animate: false })