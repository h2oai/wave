import React from 'react'
import { cards } from './layout'
import { showNotification } from './notification'
import { bond, box, Card, qd, S, U } from './qd'

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
  name: S,
  /** The size of this zone. */
  size?: S,
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
  /** Display a desktop notification to the user. */
  notification?: S
  /** Redirect the page to a new URL. */
  redirect?: S
  /** Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers). */
  icon?: S
  /** The layouts supported by this page. */
  layouts?: Layout[]
}

export const
  layoutsB = box<Layout[]>([]),
  preload = ({ state }: Card<State>) => {
    const { title, icon, refresh, notification, redirect, layouts } = state

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
      if (touchIconLink) touchIconLink.href = icon
    }

    if (typeof refresh === 'number') {
      delete state.refresh
      qd.refreshRateB(refresh)
    }

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
  }

export const View = bond(() => ({ render: () => <></> }))

cards.register('meta', View)
