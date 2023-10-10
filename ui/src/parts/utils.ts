import { IContextualMenuStyles } from "@fluentui/react"
import { S } from "../core"
import { border, cssVar } from "../theme"

// https://github.com/bevacqua/fuzzysearch/blob/master/index.js
export function fuzzysearch(haystack: S, needle: S) {
  haystack = haystack.toLowerCase()
  needle = needle.toLowerCase()
  const
    hlen = haystack.length,
    nlen = needle.length

  if (nlen > hlen) return false
  if (nlen === hlen) return needle === haystack

  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needle.charCodeAt(i)
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer
      }
    }
    return false
  }
  return true
}

// https://github.com/h2oai/wave/issues/1395.
export const fixMenuOverflowStyles: Partial<IContextualMenuStyles> = {
  list: {
    border: border(1, cssVar('$neutralQuaternaryAlt')),
    '.ms-ContextualMenu-link': { lineHeight: 'unset' },
    '.ms-ContextualMenu-submenuIcon': { lineHeight: 'unset', display: 'flex', alignItems: 'center' },
  }
}