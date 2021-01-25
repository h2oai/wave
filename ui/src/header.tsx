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
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { NavGroup, XNav } from './nav'
import { B, bond, Box, box, Card, S, qd } from './qd'
import { clas, getTheme, padding, palette } from './theme'

const
  theme = getTheme(),
  iconSize = 24,
  css = stylesheet({
    card: {
      display: 'flex',
      alignItems: 'center',
      padding: padding(8, 15),
    },
    rhs: {
      flexGrow: 1
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
          color: theme.colors.page, // TODO improve
          cursor: 'pointer',
        },
      },
    },
    icon: {
      fontSize: iconSize,
      height: iconSize,
      width: iconSize,
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
    toolbar: {
      color: theme.colors.card,
      $nest: {
        '&:hover,.is-expanded': {
          backgroundColor: theme.colors.card,
          color: theme.colors.text,
        }
      }
    },
    toolbarMenu: {
      backgroundColor: palette.themePrimary,
      $nest: {
        '.ms-ContextualMenu-item:hover': {
          color: palette.themePrimary,
          background: theme.colors.card
        },
        '.ms-ContextualMenu-itemText': {
          color: theme.colors.card,
          $nest: {
            '&:hover': {
              color: palette.themePrimary
            }
          }
        },
        '.ms-ContextualMenu-link:hover,.ms-ContextualMenu-link.is-expanded': {
          backgroundColor: theme.colors.card,
          $nest: {
            '.ms-ContextualMenu-itemText,.ms-ContextualMenu-submenuIcon': {
              color: `${palette.themePrimary} !important`
            }
          }
        },
        '.ms-ContextualMenu-submenuIcon': {
          color: theme.colors.card,
        }
      }
    },
    calloutContainer: {
      boxShadow: `0px 3px 7px ${theme.colors.card}`,
    }
  })

interface HeaderItem {
  /** An identifying name for this component. */
  name: S
  /** The text to be displayed. If blank, the `path` is used as the label. */
  label: S
  /** The path or URL to link to. */
  path?: S
  /** Where to display the link. Setting this to `'_blank'` opens the link in a new tab or window. */
  target?: S
  /** Nested header items for sub menus. */
  items?: HeaderItem[]
}
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
  /** Items that should be displayed on the right side of the header. */
  items?: HeaderItem[]
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
          <XNav items={items} />
        </Fluent.Panel>
      )
    return { render, isOpenB }
  }),
  Toolbar = bond(({ items }: { items: HeaderItem[] }) => {
    const
      onClick = (name: S) => () => {
        if (name.startsWith('#')) {
          window.location.hash = name.substr(1)
          return
        }
        qd.args[name] = true
        qd.sync()
      },
      mapToMenu = (items?: HeaderItem[]): Fluent.IContextualMenuItem[] | undefined => {
        return items?.length
          ? items.map(({ name, label, path, items, target }): Fluent.IContextualMenuItem => ({
            key: name,
            text: label,
            href: path,
            target,
            className: css.toolbarMenu,
            onClick: onClick(name),
            subMenuProps: items ? { items: mapToMenu(items)! } : undefined
          }))
          : undefined
      },
      toolbar = () => items.map(({ name, label, path, items }) => {
        const
          menuItems = mapToMenu(items),
          menuProps: Fluent.IContextualMenuProps | undefined = menuItems
            ? { items: menuItems, calloutProps: { className: css.calloutContainer } }
            : undefined
        return (
          <Fluent.CommandButton
            data-test={name}
            key={name}
            href={path}
            onClick={onClick(name)}
            className={css.toolbar}
            text={label}
            menuProps={menuProps}
          />
        )
      }),
      render = () => <>{toolbar()}</>

    return { render }
  })


export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      navB = box(false),
      showNav = () => navB(true),
      render = () => {
        const
          { title, subtitle, icon, icon_color, nav, items } = state,
          burger = nav
            ? (
              <div className={clas(css.burger, css.lhs)} onClick={showNav}>
                <Fluent.FontIcon className={css.icon} iconName='GlobalNavButton' />
              </div>
            ) : (
              <div className={css.lhs}>
                <Fluent.FontIcon className={css.icon} iconName={icon ?? 'WebComponents'} style={{ color: theme.color(icon_color) }} />
              </div>
            )

        return (
          <div data-test={name} className={css.card} >
            {burger}
            <div className={css.rhs}>
              <div className={css.title}>{title}</div>
              <div className={css.subtitle}>{subtitle}</div>
            </div>
            {nav && <Navigation items={nav} isOpenB={navB} />}
            {items && <Toolbar items={items} />}
          </div>
        )
      }
    return { render, changed }
  })

cards.register('header', View, CardEffect.Raised)