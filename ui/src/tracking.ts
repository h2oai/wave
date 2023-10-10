import { on, Rec, S } from './core'
import { argsB } from './ui'

/**
 * Configure user interaction tracking (analytics) for a page.
 */
export interface Tracker {
  /** The tracking provider. Supported providers are `ga` (Google Analytics) and `gtag` (Google Global Site Tags or gtag.js) */
  type: 'ga' | 'gtag'
  /** The tracking ID or measurement ID. */
  id: S
}

let
  tracker: Tracker | null = null

const
  sanitize = (args: Rec): Rec => {
    const r: Rec = {}

    for (const k in args) {
      const v = args[k]
      // Don't send actual values; only that certain elements were possibly interacted with.
      if (v) r[k] = k === '#' ? v : true
    }

    return r
  },
  sendEvent = (args: Rec) => {
    if (!tracker) return
    switch (tracker.type) {
      case 'ga':
      case 'gtag':
        {
          const w = window as any
          if (w.gtag) w.gtag('event', 'sync', sanitize(args))
        }
    }
  }

export const
  setupTracker = (t: Tracker) => {
    if (tracker) return  // Setup only once for the lifetime of the page

    switch (t.type) {
      case 'ga':
      case 'gtag':
        {
          const s = document.createElement('script')
          s.type = 'text/javascript'
          s.async = true
          s.src = `https://www.googletagmanager.com/gtag/js?id=${t.id}`
          document.body.appendChild(s)
          s.addEventListener('load', () => {
            const w = window as any
            w.dataLayer = w.dataLayer || []
            // eslint-disable-next-line prefer-rest-params
            function gtag() { w.dataLayer.push(arguments) }
            w.gtag = gtag
            w.gtag('js', new Date())
            w.gtag('config', t.id)
          })
        }
        tracker = t
    }
  }

on(argsB, (args) => window.setTimeout((() => sendEvent(args)), 0))
