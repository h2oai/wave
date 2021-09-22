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

import { FontIcon, Panel, PanelType, SearchBox } from '@fluentui/react'
import { B, Box, box, Model, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { NavGroup, XNav } from './nav'
import { bond, wave } from './ui'
import { clas, cssVar, padding } from './theme'
import { Component } from './form'
import * as Fluent from '@fluentui/react'
import { Persona, XPersona } from './persona'
import { XIconNotification } from './icon_notification'
import { XStandAloneButton } from './button'
import { XFrame } from './frame'

const
  iconSize = 24,
  css = stylesheet({
    card: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: padding(8, 15),
      overflow: 'hidden',
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
      marginRight: iconSize*2
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
      top: -3, // nudge up slightly to account for padding
      color: cssVar('$neutralSecondary')
    },
    persona: {
      paddingBottom: 36
    },
    searchbox: {
      width: '80%',
      height: '42px',
      background: 'transparent',
      borderRadius: 6,
      borderColor: cssVar('$neutralDark'),
      $nest: {
        '&:hover': {
          borderColor: cssVar('$neutralSecondary'),
        }
      },
    },
    column: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center',
    },
    columnLeft: {
      justifyContent: 'flex-start'
    },
    columnMiddle: {
      justifyContent: 'center'
    },
    columnRight: {
      justifyContent: 'flex-end'
    },
    breakpointHide: {
      display: '',
      "@media (max-width: 992px)": {
        display: 'none',
      }
    },
    breakpointShow: {
      display: 'none',
      "@media (max-width: 992px)": {
          display: 'inline'
      }
    },
  })


/**
 * Render a page header displaying a title, subtitle and an optional navigation menu, searchbar or custom items.
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
  /** An identifying name of the search. */
  search_name?: S
  /** List of components aligned to the right of the header. */
  items?: Component[]
}

const
  Navigation = bond(({ items, isOpenB, persona }: { items: NavGroup[], isOpenB: Box<B>, persona?: Persona }) => {
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
          {persona && <div key={'header_persona'} className={clas(css.breakpointShow, css.persona)}><XComponent model={persona as Component} /></div>}
          <XNav items={items} hideNav={hideNav} />
        </Panel>
      )
    return { render, isOpenB }
  })



export const
  View = bond(({ name, state, changed }: Model<State>) => {
    const
      navB = box(false),
      showNav = () => navB(true),
      render = () => {
        const
          { title, subtitle, items, search_name, icon, icon_color, nav } = state,
          burger = nav
            && (
              <div className={clas(css.lhs, css.burger)} onClick={showNav}>
                <FontIcon className={css.icon} iconName='GlobalNavButton' />
              </div>
            ),
          onChange = (_event?: React.ChangeEvent<HTMLInputElement> | undefined, v?: S) => {
            if (search_name) {
              wave.args[search_name] = v ?? ''
              wave.push()
            }
          },
          persona = items?.filter((item) => {return item.persona})?.[0] as Persona,
          searchIconStyle: React.CSSProperties = {transform: 'scaleX(-1)', color: cssVar('$neutralSecondary')}

        return (
          <div id="card" data-test={name} className={css.card}>
            <div className={clas(css.column, css.columnLeft)}>
              {burger}
              <div className={css.lhs}>
                <FontIcon className={css.icon} iconName={icon ?? 'WebComponents'} style={{ color: cssVar(icon_color) }} />
              </div>
              <div className={css.rhs}>
                <div className="wave-s24 wave-w6">{title}</div>
                <div className={clas(css.subtitle, 'wave-s16')}>{subtitle}</div>
              </div>
            </div>
            <div className={clas(css.column, css.columnMiddle, css.breakpointHide)}>
              {search_name && 
              <SearchBox
                className={css.searchbox}
                placeholder="Search anything here..."
                iconProps={{iconName: 'Search', style: searchIconStyle}}
                onChange={onChange}
              />
              }
            </div>
            <div className={clas(css.column, css.columnRight, css.breakpointHide)}>
              {items && items?.map((item, i) => {return <div key={i}><XComponent model={item} /></div>})}
              {nav && <Navigation items={nav} isOpenB={navB} persona={persona} />}
            </div>
          </div>
        )
      }
    return { render, changed }
  })

const
  XComponent = ({ model: m }: { model: Component }) => {
    if (m.persona) return <XPersona model={m.persona} />
    if (m.icon_notification) return <XIconNotification model={m.icon_notification} />
    if (m.button) return <XStandAloneButton model={m.button} />
    if (m.frame) return <XFrame model={m.frame} />
    return <Fluent.MessageBar messageBarType={Fluent.MessageBarType.severeWarning}>This component could not be rendered.</Fluent.MessageBar>
  }

cards.register('header', View, {effect: CardEffect.Flat})


