import { B, Dict, S } from './qd'

/**
 * Create a reference to an external Javascript file to be included on a page.
 */
export interface Script {
  /** The URI of an external script. */
  path: S
  /** Whether to fetch and load this script in parallel to parsing and evaluated as soon as it is available. */
  asynchronous?: B
  /** The CORS setting for this script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin */
  cross_origin?: S
  /** Indicates which referrer to send when fetching the script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script */
  referrer_policy?: S
  /** The cryptographic hash to verify the script's integrity. See https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity */
  integrity?: S
}

const
  installedScripts: Dict<B> = {}

export const
  installScripts = (scripts: Script[]) => {
    scripts.forEach(({ path, asynchronous, cross_origin, referrer_policy, integrity}) => {
      if (installedScripts[path]) return // load exactly once
      const e = document.createElement('script')
      e.type = 'text/javascript'
      e.src = path
      if (asynchronous) e.async = true
      if (cross_origin) e.crossOrigin = cross_origin
      if (referrer_policy) e.referrerPolicy = referrer_policy
      if (integrity) e.integrity = integrity
      document.body.appendChild(e)
      e.addEventListener('load', () => {
        installedScripts[path] = true
      })
    })
  }
