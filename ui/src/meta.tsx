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

import { B, box, disconnect, Id, Model, on, S, U } from './core'
import React from 'react'
import { NotificationBar, notificationBarB } from './notification_bar'
import { Dialog, dialogB } from './dialog'
import { cards } from './layout'
import { showNotification } from './notification'
import { executeScript, InlineScript, installScripts, Script } from './script'
import { SidePanel, sidePanelB } from './side_panel'
import { themeB, themesB } from './theme'
import { setupTracker, Tracker } from './tracking'
import { bond } from './ui'


export type FlexBox = Partial<{ zone: S, order: U, size: S, width: S, height: S }>


/**
 * Create an inline CSS to be injected into a page.
 */
interface InlineStylesheet {
  /** The CSS to be applied to this page. */
  content: S
  /** A valid media query to set conditions for when the style should be applied. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style#attr-media. */
  media?: S
  /** An identifying name for this component. */
  name?: S
}

/**
 * Create a reference to an external CSS file to be included on a page.
 */
interface Stylesheet {
  /** The URI of an external stylesheet. */
  path: S
  /** A valid media query to set conditions for when the stylesheet should be loaded. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-media. */
  media?: S
  /** The CORS setting. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-crossorigin */
  cross_origin?: S
  /** An identifying name for this component. */
  name?: S
}
/**
 * Represents the layout structure for a page.
 */
export interface Layout {
  /**
   * The minimum viewport width at which to use this layout.
   * Values must be pixel widths (e.g. '0px', '576px', '768px') or a named preset.
   * The named presets are:
   * 'xs': '0px' for extra small devices (portrait phones),
   * 's': '576px' for small devices (landscape phones),
   * 'm': '768px' for medium devices (tablets),
   * 'l': '992px' for large devices (desktops),
   * 'xl': '1200px' for extra large devices (large desktops).
   *
   * A breakpoint value of 'xs' (or '0') matches all viewport widths, unless other breakpoints are set.
  */
  breakpoint: S
  /** The zones in this layout. Each zones can in turn contain sub-zones. */
  zones: Zone[]
  /** The width of the layout. Defaults to `100%`. */
  width?: S
  /** The minimum width of the layout. */
  min_width?: S
  /** The maximum width of the layout. */
  max_width?: S
  /** The height of the layout. Defaults to `auto`. */
  height?: S
  /** The minimum height of the layout. */
  min_height?: S
  /** The maximum height of the layout. */
  max_height?: S
  /** An identifying name for this zone. */
  name?: Id
}

/**
 * Represents an zone within a page layout.
 */
export interface Zone {
  /** An identifying name for this zone. */
  name: Id
  /** The size of this zone. */
  size?: S
  /** Layout direction. */
  direction?: 'row' | 'column'
  /** Layout strategy for main axis. */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around'
  /** Layout strategy for cross axis. */
  align?: 'start' | 'end' | 'center' | 'stretch'
  /** Wrapping strategy. */
  wrap?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
  /** The sub-zones contained inside this zone. */
  zones?: Zone[]
}

/** 
 * Theme (color scheme) to apply colors to the app.
*/
export interface Theme {
  /** An identifying name for this theme. */
  name: Id
  /** Base color of the textual components. */
  text: S
  /** Card background color. */
  card: S
  /** Page background color. */
  page: S
  /** Primary color used to accent components. */
  primary: S
}/**
 * Represents page-global state.
 *
 * This card is invisible.
 * It is used to control attributes of the active page.
*/
interface State {
    /** The title of the page. */
    title?: S;
    /** Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use). */
    refresh?: U;
    /** Display a desktop notification. */
    notification?: S;
    /** Display an in-app notification bar. */
    notification_bar?: NotificationBar;
    /** Redirect the page to a new URL. */
    redirect?: S;
    /**
     * Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers).
     * Not supported in Safari.
    */
    icon?: S;
    /** The layouts supported by this page. */
    layouts?: Layout[];
    /** Display a dialog on the page. */
    dialog?: Dialog;
    /** Display a side panel on the page. */
    side_panel?: SidePanel;
    /** Specify the name of the theme (color scheme) to use on this page. One of 'light', 'neon' or 'h2o-dark'. */
    theme?: S;
    /** * Themes (color schemes) that define color used in the app. */
    themes?: Theme[];
    /** Configure a tracker for the page (for web analytics). */
    tracker?: Tracker;
    /** External Javascript files to load into the page. */
    scripts?: Script[];
    /** Javascript code to execute on this page. */
    script?: InlineScript;
    /** CSS stylesheet to be applied to this page. */
    stylesheet?: InlineStylesheet;
    /** External CSS files to load into the page. */
    stylesheets?: Stylesheet[];
    /** EXPERIMENTAL: True to turn on the card animations. Defaults to False. */
    animate?: B;
    /**
     * An optional name for this card.
     */
    name?: S;
}

const
  windowTitleB = box(''),
  windowIconB = box('')

on(windowTitleB, t => window.document.title = t)
on(windowIconB, icon => {
  const
    iconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement,
    touchIconLink = document.querySelector("link[rel*='apple-touch-icon']") as HTMLLinkElement
  if (iconLink) iconLink.href = icon
  // Not working as of Feb 2021 since Safari does not support dynamic favicon changes.
  if (touchIconLink) touchIconLink.href = icon
})

export const
  layoutsB = box<Layout[]>([]),
  preload = ({ state }: Model<State>) => {
    const {
      title,
      icon,
      refresh,
      notification,
      notification_bar,
      redirect,
      layouts,
      dialog,
      side_panel,
      theme,
      themes,
      tracker,
      scripts,
      script,
      stylesheet,
      stylesheets,
      animate
    } = state

    if (redirect) {
      try {
        const
          { location } = window,
          url = new URL(`${location.origin}${location.pathname}${redirect}`)
        if (redirect === url.hash) {
          location.hash = redirect
        } else {
          location.replace(redirect)
        }
      } catch (e) {
        console.error(`Could not redirect: ${redirect} is an invalid URL`, e)
      }
      delete state.redirect
    }

    dialogB(dialog ? { ...dialog } : null)
    sidePanelB(side_panel ? { ...side_panel } : null)
    // HACK: Since meta cards are processed within render, wait for React to finish the original render before proceeding.
    setTimeout(() => notificationBarB(notification_bar ? { ...notification_bar } : null), 0)

    if (animate) document.body.style.setProperty('--wave-animation-duration', '0.5s')
    if (title) windowTitleB(title)
    if (icon) windowIconB(icon)
    if (typeof refresh === 'number' && refresh === 0) disconnect()
    if (theme) themeB(theme)
    if (themes) themesB(themes)
    if (notification) showNotification(notification)
    if (tracker) setupTracker(tracker)
    if (layouts) layoutsB(layouts)
    if (scripts) installScripts(scripts)
    if (script) {
      delete state.script
      executeScript(script)
    }
    if (stylesheet) {
      const styleEl = document.createElement('style')
      const { content, media } = stylesheet
      styleEl.innerText = content
      if (media) styleEl.media = media
      document.head.appendChild(styleEl)
      delete state.stylesheet
    }
    if (stylesheets) {
      stylesheets.forEach(({ path, media, cross_origin }) => {
        const linkEl = document.createElement('link')
        linkEl.rel = 'stylesheet'
        linkEl.href = path
        linkEl.as = 'style'
        if (media) linkEl.media = media
        if (cross_origin) linkEl.crossOrigin = cross_origin
        document.head.appendChild(linkEl)
      })
      delete state.stylesheets
    }
  }

export const View = bond(() => ({ render: () => <></> }))

cards.register('meta', View)