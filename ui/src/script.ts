import { B, Dict, S } from './core'

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

/**
 * Create a block of inline Javascript to be executed immediately on a page.
 */
export interface InlineScript {
  /** The Javascript source code to be executed. */
  content: S
  /** The names of modules required on the page's `window` global before running this script. */
  requires?: S[]
  /** The HTML elements required to be present on the page before running this script. Each 'target' can either be the ID of the element (`foo`) or a CSS selector (`#foo`, `.foo`, `table > td.foo`, etc.). */
  targets?: S[]
}

let executableScriptElement: HTMLScriptElement | null = null

const
  installedScripts: Dict<B> = {},
  installScript = (content: S) => {
    if (executableScriptElement) {
      executableScriptElement.remove()
    }
    const e = executableScriptElement = document.createElement('script')
    e.type = 'text/javascript'
    // HTML5 specifies that a <script> tag inserted with innerHTML should not execute.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations
    // See https://www.w3.org/TR/2008/WD-html5-20080610/dom.html#innerhtml0
    e.appendChild(document.createTextNode(content))
    document.body.appendChild(e)
  },
  hasModule = (p: S) => {
    let d = window as any
    for (const k of p.split('.')) {
      d = d[k]
      if (!d) return false
    }
    return true
  },
  hasModules = (paths: S[]) => !paths.some(p => !hasModule(p)),
  hasTarget = (selector: S) => document.getElementById(selector) || document.querySelector(selector),
  hasTargets = (selectors: S[]) => !selectors.some(id => !hasTarget(id))

export const
  installScripts = (scripts: Script[]) => {
    scripts.forEach(({ path, asynchronous, cross_origin, referrer_policy, integrity }) => {
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
  },
  executeScript = ({ content, requires, targets }: InlineScript) => {
    const
      resolved = () => {
        if (requires && requires.length) {
          if (!hasModules(requires)) return false
        }
        if (targets && targets.length) {
          if (!hasTargets(targets)) return false
        }
        return true
      }

    if (resolved()) {
      installScript(content)
      return
    }

    let tries = 0
    const
      t = setInterval(() => {
        if (resolved()) {
          clearInterval(t)
          installScript(content)
        } else {
          tries++
          if (tries > 100) {
            clearInterval(t)
            console.error('Failed to execute inline script: one or more of the requirements were not found.')
          }
        }
      }, 10)
  }
