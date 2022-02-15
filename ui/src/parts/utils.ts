import { S } from "h2o-wave"

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