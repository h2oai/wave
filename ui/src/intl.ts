import Handlebars from 'handlebars';
import { createIntl, createIntlCache } from 'react-intl';
import { B, S } from './delta';

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

const intlCache = createIntlCache() // prevents memory leaks per docs
export const intl = createIntl({
  locale: navigator.language,
  messages: {},
  // the intl lib throws console.errors for each missing id. 
  // since we generate format messages on the fly, ignore all errors.
  onError: () => { },
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



export type Fmt = (datum: any, value?: any) => S

export const
  isFormatExpr = (f: any): B => typeof f === 'string' && f.length > 1 && f.charAt(0) === '=' && f.charAt(1) !== '=',
  parseFormat = (s: S): [S, HandlebarsTemplateDelegate<any> | undefined] | null => {
    if (!isFormatExpr(s)) return null

    // "=foo"
    s = s.substr(1) // lop off leading '='

    // "foo"
    if (isBareExpr(s)) return [s, undefined]

    // "{{func foo..."
    const invocation = s.match(/\{\{\s*(\w+)\s+(\w+)/)
    if (invocation) return [invocation[2], compile(s)]

    // "{{foo..."
    const bare = s.match(/\{\{\s*(\w+)/)
    if (bare) return [bare[1], undefined]

    return null
  },
  compile = (s: S) => Handlebars.compile(s),
  format = (s: S, data: any): S => {
    if (isBareExpr(s)) s = '{{' + s + '}}'
    const t = compile(s)
    return t ? t(data) : s
  }