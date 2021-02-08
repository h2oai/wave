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

import React from 'react'
import { cards } from './layout'
import { showNotification } from './notification'
import { bond, box, Card, Id, qd, S, U } from './qd'
import { Dialog } from './dialog'
import { changeTheme } from './theme'
import { setupTracker, Tracker } from './tracking'

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
 * Represents page-global state.
 *
 * This card is invisible.
 * It is used to control attributes of the active page.
*/
interface State {
  /** The title of the page. */
  title?: S
  /** Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use). */
  refresh?: U
  /** Display a desktop notification. */
  notification?: S
  /** Redirect the page to a new URL. */
  redirect?: S
  /** 
   * Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers). 
   * Not supported in Safari.
  */
  icon?: S
  /** The layouts supported by this page. */
  layouts?: Layout[]
  /** Display a dialog on the page. */
  dialog?: Dialog
  /** Specify the name of the theme (color scheme) to use on this page. One of 'light' or 'neon'. */
  theme?: S
  /** Configure a tracker for the page (for web analytics). */
  tracker?: Tracker
}

export const
  layoutsB = box<Layout[]>([]),
  preload = ({ state }: Card<State>) => {
    const { title, icon, refresh, notification, redirect, layouts, dialog, theme, tracker } = state

    if (title) {
      delete state.title
      window.document.title = title
    }

    if (icon) {
      delete state.icon
      const
        iconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement,
        touchIconLink = document.querySelector("link[rel*='apple-touch-icon']") as HTMLLinkElement
      if (iconLink) iconLink.href = icon
      // Not working as of Feb 2021 since Safari does not support dynamic favicon changes.
      if (touchIconLink) touchIconLink.href = icon
    }

    if (typeof refresh === 'number') {
      delete state.refresh
      qd.refreshRateB(refresh)
    }

    // Force new obj reference to rerender Dialog component with most recent changes.
    qd.dialogB(dialog ? { ...dialog } : null)

    if (theme) changeTheme(theme)
    if (notification) {
      delete state.notification
      showNotification(notification)
    }

    if (redirect) {
      delete state.redirect
      try {
        const url = new URL(redirect)
        if (redirect === url.hash) {
          window.location.hash = redirect
        } else {
          window.location.replace(redirect)
        }
      } catch (e) {
        console.error(`Could not redirect: ${redirect} is an invalid URL`)
      }
    }

    if (layouts) {
      delete state.layouts
      layoutsB(layouts)
    }

    if (tracker) {
      delete state.tracker
      setupTracker(tracker)
    }
  }

export const View = bond(() => ({ render: () => <></> }))

cards.register('meta', View)
