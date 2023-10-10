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

import { B, S } from './core'
import Handlebars from 'handlebars'
import { createIntl, createIntlCache } from 'react-intl'

const intlCache = createIntlCache() // prevents memory leaks per docs
export const intl = createIntl({
  locale: navigator.language,
  messages: {},
  // Since we generate format messages on the fly, ignore all errors.
  // The intl lib requires messages to be initialized in advance,
  // Otherwise, it throws console.errors for each missing id, each time format() is called.
  // As of this implementation, there's no formal way to disable that behavior.
  onError: () => { /* noop */ },
}, intlCache)

const
  snakeToCamel = (s: S): S => s.replace(/(_\w)/g, m => m[1].toUpperCase()),
  kvToOpts = (a: any): any => {
    const b: any = {}
    for (const k in a) {
      const v = a[k]
      b[snakeToCamel(k)] =
        (v === 'true')
          ? true
          : v === 'false'
            ? false
            : /^\d+$/.test(v)
              ? parseInt(v, 10)
              : v
    }
    return b
  },
  isBareExpr = (s: S): B => /^\w+$/.test(s)

Handlebars.registerHelper('intl', (v: any, { hash: opts }: any) => {
  opts = kvToOpts(opts)
  const t = opts.type
  return t === 'date'
    ? intl.formatDate(v, opts)
    : t === 'time'
      ? intl.formatTime(v, opts)
      : t === 'number' || typeof v === 'number'
        ? intl.formatNumber(v, opts)
        : v
})

export type Fmt = (datum: any, value?: any) => S

export const
  isFormatExpr = (f: any): B => typeof f === 'string' && f.length > 1 && f.charAt(0) === '=' && f.charAt(1) !== '=',
  parseFormat = (s: S): [S, HandlebarsTemplateDelegate<any> | undefined] | null => {
    if (!isFormatExpr(s)) return null

    // "=foo"
    s = s.substring(1) // lop off leading '='

    // "foo"
    if (isBareExpr(s)) return [s, undefined]

    // "{{func foo-bar ..."
    const invocation = s.match(/\{\{\s*(\w+)\s+(\w+)(.+)\}\}/)
    if (invocation) return [invocation[2], compile(s)]

    // "{{foo-bar ..."
    const bare = s.match(/\{\{\s*(\S+)/)
    if (bare) return [bare[1], undefined]

    return null
  },
  compile = (s: S): any => Handlebars.compile(s),
  format = (s: S, data: any): S => {
    if (isBareExpr(s)) s = '{{' + s + '}}'
    const t = compile(s)
    return t ? t(data) : s
  }