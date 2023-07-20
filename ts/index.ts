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

/* eslint-disable @typescript-eslint/ban-types */

//
// Dataflow
// Mostly a port of H2O Flow's dataflow.coffee
//

/** Action. */
export type Act = () => void
/** Action, 1 argument. */
export type Eff<T> = (t: T) => void
/** Action, 2 arguments. */
export type Eff2<A, B> = (a: A, b: B) => void
/** Action, 3 arguments. */
export type Eff3<A, B, C> = (a: A, b: B, c: C) => void
/** Action, 4 arguments. */
export type Eff4<A, B, C, D> = (a: A, b: B, c: C, d: D) => void
/** Function, 1 argument. */
export type Func<A, B> = (a: A) => B
/** Function, 2 arguments. */
export type Func2<A, B, C> = (a: A, b: B) => C
/** Function, 3 arguments. */
export type Func3<A, B, C, D> = (a: A, b: B, c: C) => D
/** Anything that needs disposing. */
export interface Disposable { dispose(): void }

interface Arrow<T> extends Disposable { f: Eff<T> }

/** A container that holds some value, and can be observed. */
export interface Box<T> extends Disposable {
  (): T
  (value: T): T
}

interface Boxed<T> extends Box<T> {
  __boxed__: boolean // marker
  on(f: Eff<T>, o?: any): Arrow<T>
  touch(): void
}

type Equal<T> = (a: T, b: T) => boolean
function different<T>(_a: T, _b: T) { return false }
/** Create a Box with a pre-defined value comparator. */
export function box<T>(value?: T, equal?: Equal<T>): Box<T>;
/** Create a Box. */
export function box<T>(...args: any[]): Box<T> {
  let
    x: T = (args.length > 0 ? args[0] : undefined) as T
  const
    equal = args.length > 0 ? (args.length > 1 ? args[1] : null) : different,
    arrows: Arrow<T>[] = [],
    on = (f: Eff<T>): Arrow<T> => {
      const a: Arrow<T> = { f, dispose: () => remove(arrows, a) }
      arrows.push(a)
      return a
    },
    dispose = (): void => { arrows.length = 0 },
    broadcast = (t: T): void => { for (const a of arrows) a.f(t) },
    touch = (): void => broadcast(x),
    f = (...ys: T[]): T => {
      if (ys.length) { // f(x) invoked
        const y = ys[0]
        if (!(equal ? equal(x, y) : (x === y))) broadcast(x = y) // store and broadcast new value if changed
      } // else f() invoked
      return x
    }

  f.on = on
  f.touch = touch
  f.dispose = dispose
  f.__boxed__ = true

  return f as Box<T>
}
/** Is this a Box? */
export function boxed<T>(x: any): x is Box<T> { return x && x.__boxed__ === true }
/** Get the value from a Box, if a Box, else return the argument as-is. */
export function unbox<T>(x: T | Box<T>): T { return boxed<T>(x) ? x() : x }
/** Send a Box's value to f() and broadcast its value. */
export function rebox<T>(b: Box<T>, f: Eff<T>) { const x = b(); f(x); (b as Boxed<T>).touch() }
/** Subscribe to changes in a Box. */
export function on<A>(a: Box<A>, f: Eff<A>): Disposable;
/** Subscribe to changes in 2 Boxes. */
export function on<A, B>(a: Box<A>, b: Box<B>, f: Eff2<A, B>): Disposable;
/** Subscribe to changes in 3 Boxes. */
export function on<A, B, C>(a: Box<A>, b: Box<B>, c: Box<C>, f: Eff3<A, B, C>): Disposable;
/** Subscribe to changes in 4 Boxes. */
export function on<A, B, C, D>(a: Box<A>, b: Box<B>, c: Box<C>, d: Box<D>, f: Eff4<A, B, C, D>): Disposable;
/** Subscribe to changes in N Boxes. */
export function on(...args: any[]): Disposable { return react(false, args.slice(0, args.length - 1), args[args.length - 1]) }
/** Subscribe to changes in a box, and broadcast immediately. */
export function to<A>(a: Box<A>, f: Eff<A>): Disposable;
/** Subscribe to changes in 2 Boxes, and broadcast immediately. */
export function to<A, B>(a: Box<A>, b: Box<B>, f: Eff2<A, B>): Disposable;
/** Subscribe to changes in 3 Boxes, and broadcast immediately. */
export function to<A, B, C>(a: Box<A>, b: Box<B>, c: Box<C>, f: Eff3<A, B, C>): Disposable;
/** Subscribe to changes in 4 Boxes, and broadcast immediately. */
export function to<A, B, C, D>(a: Box<A>, b: Box<B>, c: Box<C>, d: Box<D>, f: Eff4<A, B, C, D>): Disposable;
/** Subscribe to changes in N Boxes, and broadcast immediately. */
export function to(...args: any[]): Disposable { return react(true, args.slice(0, args.length - 1), args[args.length - 1]) }

// eslint-disable-next-line @typescript-eslint/ban-types
function react(immediate: boolean, boxen: Box<any>[], f: Function): Disposable {
  const
    xs = boxen as Boxed<any>[],
    emit = () => f(...xs.map(x => x())),
    arrows = xs.map(x => x.on(emit)),
    dispose = () => arrows.forEach(a => a.dispose())

  if (immediate) emit()
  return { dispose }
}

/** Create a Box computed from another Box. */
export function by<A, B>(a: Box<A>, map: Func<A, B>): Box<B>
/** Create a Box computed from 2 other Boxes. */
export function by<A, B, C>(a: Box<A>, b: Box<B>, zip: Func2<A, B, C>): Box<B>
/** Create a Box computed from 3 other Boxes. */
export function by<A, B, C, D>(a: Box<A>, b: Box<B>, c: Box<C>, zip: Func3<A, B, C, D>): Box<B>
/** Create a Box computed from N other Boxes. */
export function by(...args: any[]): any {
  if (args.length < 2) throw new Error(`invalid number of args: want 2 or more, got ${args.length}`)
  const
    m = args.length - 1,
    xs = args.slice(0, m) as Boxed<any>[],
    // eslint-disable-next-line @typescript-eslint/ban-types
    f = args[m] as Function,
    yB = box(f(...xs.map(x => x())))

  xs.forEach(x => x.on(_ => yB(f(...xs.map(x => x())))))
  return yB
}
/** Watch a Box for changes and print changes to the console. */
export function watch<T>(x: Box<T>, label?: string): Disposable {
  // eslint-disable-next-line no-console
  return on(x, label ? ((x: T) => console.log(label, x)) : ((x: T) => console.log(x)))
}

function remove<T>(xs: T[], x: T): void { const i = xs.indexOf(x); if (i > -1) xs.splice(i, 1) }

/** Synonym for boolean. */
export type B = boolean
/** Synonym for unsigned int. */
export type U = number
/** Synonym for int. */
export type I = number
/** Synonym for float. */
export type F = number
/** Synonym for string. */
export type S = string
/** Synonym for date. */
export type D = Date
/** Synonym for number, string or date. */
export type V = F | S | D
/** A primitive. */
export type Prim = S | F | B | null
/** Dictionary or generic object. */
export interface Dict<T> { [key: string]: T }
/** Identifier (non-empty string). */
export type Id = S
/** Record; named "Rec" to distinguish from Typescript's Record<K,T> utility type. */
export type Rec = Dict<Prim | Prim[] | Rec | Rec[]> // 
/** Several records. */
export type Recs = Rec[]
/** An object, or a serialized string representation of the object. */
export type Packed<T> = T | S
/** A container for records. */
export interface Data {
  list(): (Rec | null)[]
  dict(): Dict<Rec>
}

interface OpsD {
  p?: PageD // init
  d?: OpD[] // deltas
  r?: U // reset
  u?: S  // redirect
  e?: S // error
  m?: { // metadata
    u: S // active user's username
    e: B // can the user edit pages?
  }
}
interface OpD {
  k?: S
  v?: any
  c?: CycBufD
  f?: FixBufD
  m?: MapBufD
  l?: ListBufD
  d?: Dict<Datum>
  b?: BufD[]
}
type Tup = any[]
interface PageD {
  c: Dict<CardD>
}
type Datum = S | F | B | Dict<any> | any[] | BufD
interface CardD {
  d: Dict<Datum>
  b?: BufD[]
}
interface BufD {
  c: CycBufD
  f: FixBufD
  m: MapBufD
  l: ListBufD
}
interface MapBufD {
  f: S[]
  d: Dict<Tup>
}
interface FixBufD {
  f: S[]
  d: (Tup | null)[]
  n: U
}
interface CycBufD {
  f: S[]
  d: (Tup | null)[]
  n: U
  i: U
}
interface ListBufD {
  f: S[]
  d: (Tup | null)[]
  n: U
}
interface Cur {
  __cur__: true
  get(f: S): any
  set(f: S, v: any): void
}
interface Buf {
  put(xs: any): void
  set(k: S, v: any): void
  get(k: S): Cur | null
  registerOnChange(f: () => void): void
}
interface Typ {
  readonly f: S[] // fields
  readonly m: Dict<U> // offsets
  match(x: any): Tup | null
  make(t: Tup): Rec
}
interface DataBuf extends Data, Buf {
  __buf__: true
}
interface FixBuf extends DataBuf {
  n: U
  seti(i: U, v: any): void
  geti(i: U): Cur | null
}
type CycBuf = DataBuf
type ListBuf = DataBuf
type MapBuf = DataBuf

/** A page. */
export interface Page {
  key: S
  changed: Box<B>
  /** Get a card by name. */
  get(k: S): Card | undefined
  /** Get all cards. */
  items(): Card[]
}

interface XPage extends Page {
  add(k: S, c: Card): void
  set(k: S, v: any): void
  drop(k: S): void
  emit(): void
}

/** A generic placeholder for content on a page. */
export interface Model<T> {
  name: S
  state: T
  changed: Box<B>
}

/** A card on a page. */
export interface Card extends Model<Dict<any>> {
  id: S
  set(ks: S[], v: any): void
}

/** Error codes returned by the Wave daemon. */
export enum WaveErrorCode {
  /** Unknown error. Should never occur. */
  Unknown = 1,
  /** The requested page was not found. */
  PageNotFound,
}

/** The type of an event raised by the Wave socket client. */
export enum WaveEventType {
  /** Connected to daemon. */
  Connect,
  /** Disconnected from daemon. */
  Disconnect,
  /** Daemon asked to re-sync entire state. */
  Reset,
  /** Daemon sent redirect request. */
  Redirect,
  /** Daemon raised an error. */
  Error,
  /** A local, unhandled exception occured in user code. */
  Exception,
  /** Daemon sent configuration information. */
  Config,
  /** Daemon sent a Page. */
  Page,
  /** Daemon sent some data. */
  Data,
}

/** */
export type WaveEvent = {
  t: WaveEventType.Page, page: Page
} | {
  t: WaveEventType.Config, username: S, editable: B
} | {
  t: WaveEventType.Reset
} | {
  t: WaveEventType.Redirect, url: S,
} | {
  t: WaveEventType.Error, code: WaveErrorCode
} | {
  t: WaveEventType.Exception, error: any
} | {
  t: WaveEventType.Connect
} | {
  t: WaveEventType.Disconnect, retry: U
} | {
  t: WaveEventType.Data
}
const
  connectEvent: WaveEvent = { t: WaveEventType.Connect },
  resetEvent: WaveEvent = { t: WaveEventType.Reset },
  dataEvent: WaveEvent = { t: WaveEventType.Data }

type WaveEventHandler = (e: WaveEvent) => void

/** A set of changes to be made to a remote Page. */
export interface ChangeSet {
  /** Get a reference to a card. */
  get(key: S): Ref
  /** Assign data buffer to card. */
  put(key: S, data: any): void
  /** Assign value to card's key. */
  set(key: S, value: any): void
  /** Delete card. */
  del(key: S): void
  /** Delete page. */
  drop(): void
  /** Push changes to remote. */
  push(): void
}

/** A reference to a remote object. */
interface Ref {
  /** Get a reference to a sub-object. */
  get(key: S): Ref
  /** Assign value to key. */
  set(key: S, value: any): void
}

/** The Wave client. */
export interface Wave {
  /** Get a reference to a copy the remote Page. */
  fork(): ChangeSet
  /** Push data to remote. */
  push(data: any): void
}

let guid = 0
export const
  xid = () => `x${++guid}`,
  parseI = (s: S): I => {
    if (!/^-{0,1}\d+$/.test(s)) return NaN
    return parseInt(s, 10)
  },
  parseU = (s: S): U => {
    const i = parseI(s)
    return isNaN(i) || i < 0 ? NaN : i
  },
  isBuf = (x: any): x is Buf => x != null && x.__buf__ === true

export function unpack<T>(data: any): T {
  return (typeof data === 'string')
    ? decodeString(data)
    : (isData(data))
      ? data.list()
      : data
}

const
  errorCodes: Dict<WaveErrorCode> = {
    not_found: WaveErrorCode.PageNotFound,
  },
  decodeType = (d: S): [S, S] => {
    const i = d.indexOf(':')
    return (i > 0) ? [d.substring(0, i), d.substring(i + 1)] : ['', d]
  },
  decodeString = (data: S): any => {
    if (data === '') return data
    const [t, d] = decodeType(data)
    switch (t) {
      case 'data':
        try {
          return JSON.parse(d)
        } catch (e) {
          console.error(e)
        }
        break
      case 'rows':
        try {
          const [fields, rows] = JSON.parse(d)
          if (!Array.isArray(fields)) return data
          if (!Array.isArray(rows)) return data
          const w = fields.length // width
          const recs: Rec[] = []
          for (const r of rows) {
            if (!Array.isArray(r)) continue
            if (r.length !== w) continue
            const rec: Rec = {}
            for (let j = 0; j < w; j++) {
              const f = fields[j], v = r[j]
              rec[f] = v
            }
            recs.push(rec)
          }
          return recs
        } catch (e) {
          console.error(e)
        }
        break
      case 'cols':
        try {
          const [fields, columns] = JSON.parse(d)
          if (!Array.isArray(fields)) return data
          if (!Array.isArray(columns)) return data
          const w = fields.length // width
          if (columns.length !== w) return data
          if (columns.length === 0) return data
          const n = columns[0].length
          const recs = new Array<Rec>(n)
          for (let i = 0; i < n; i++) {
            const rec: Rec = {}
            for (let j = 0; j < w; j++) {
              const f = fields[j], v = columns[j][i]
              rec[f] = v
            }
            recs[i] = rec
          }
          return recs
        } catch (e) {
          console.error(e)
        }
        break
    }
    return data
  },
  keysOf = <T extends {}>(d: Dict<T>): S[] => {
    const a: S[] = []
    for (const k in d) a.push(k)
    return a
  },
  valuesOf = <T extends {}>(d: Dict<T>): T[] => {
    const a: T[] = []
    for (const k in d) a.push(d[k])
    return a

  },
  isMap = (x: any): B => {
    // for JSON data only: anything not null, string, number, bool, array
    if (x === null || x === undefined) return false
    switch (typeof x) {
      case 'number':
      case 'string':
      case 'boolean':
        return false
      default:
        if (Array.isArray(x)) return false
    }
    return true
  },
  isData = (x: any): x is Data => isBuf(x),
  isCur = (x: any): x is Cur => x != null && x.__cur__ === true,
  reverseIndex = (xs: S[]): Dict<U> => {
    const m: Dict<U> = {}
    for (let i = 0, n = xs.length; i < n; i++) m[xs[i]] = i
    return m
  },
  newType = (fields: S[]): Typ => {
    const
      n = fields.length,
      m = reverseIndex(fields),
      match = (x: any): Tup | null => {
        if (Array.isArray(x) && x.length === n) return x
        return null
      },
      make = (tup: Tup): Rec => {
        const r: Rec = {}
        for (let i = 0; i < n; i++) r[fields[i]] = tup[i]
        return r
      }
    return { f: fields, m, match, make }
  },
  newCur = (t: Typ, tup: Tup): Cur => {
    const
      get = (f: S): any => {
        if (tup != null) {
          let i = t.m[f]
          if (i != null && i >= 0 && i < tup.length) return tup[i]
          i = parseI(f)
          if (!isNaN(i) && i >= 0 && i < tup.length) return tup[i]
        }
        return null
      },
      set = (f: S, v: any) => {
        if (tup != null) {
          let i = t.m[f]
          if (i != null && i >= 0 && i < tup.length) tup[i] = v
          i = parseI(f)
          if (!isNaN(i) && i >= 0 && i < tup.length) tup[i] = v
        }
      }
    return { __cur__: true, get, set }
  },
  newFixBuf = (t: Typ, tups: (Tup | null)[]): FixBuf => {
    let onChange: (() => void) | null = null
    const
      n = tups.length,
      put = (xs: any) => {
        if (Array.isArray(xs) && xs.length === n) for (let i = 0; i < n; i++) seti(i, xs[i])
      },
      set = (k: S, v: any) => {
        const i = parseI(k)
        if (!isNaN(i)) seti(i, v)
      },
      seti = (i: U, v: any) => {
        if (i >= 0 && i < n) {
          if (v === null) {
            tups[i] = null
          } else {
            const tup = t.match(v)
            if (tup) {
              tups[i] = tup
              if (onChange) onChange()
            }
          }
        }
      },
      get = (k: S): Cur | null => {
        const i = parseI(k)
        if (!isNaN(i)) return geti(i)
        return null
      },
      geti = (i: U): Cur | null => {
        if (i >= 0 && i < n) {
          const tup = tups[i]
          if (tup) return newCur(t, tup)
        }
        return null
      },
      list = (): (Rec | null)[] => {
        const xs: (Rec | null)[] = []
        for (const tup of tups) xs.push(tup ? t.make(tup) : null)
        return xs
      },
      dict = (): Dict<Rec> => ({}),
      registerOnChange = (f: () => void) => {
        onChange = f
      }
    return { __buf__: true, n, put, set, seti, get, geti, list, dict, registerOnChange }
  },
  newCycBuf = (t: Typ, tups: (Tup | null)[], i: U): CycBuf => {
    const
      n = tups.length,
      b = newFixBuf(t, tups),
      cur = "",
      put = (xs: any) => {
        if (Array.isArray(xs)) for (const x of xs) set(cur, x)
      },
      set = (_k: S, v: any) => {
        b.seti(i, v)
        i++
        if (i >= n) i = 0
      },
      get = (_k: S): Cur | null => {
        return b.geti(i)
      },
      list = (): Rec[] => {
        const xs: Rec[] = []
        for (let j = i, k = 0; k < n; j++, k++) {
          if (j >= n) j = 0
          const tup = tups[j]
          if (tup) xs.push(t.make(tup))
        }
        return xs
      },
      dict = (): Dict<Rec> => ({}),
      registerOnChange = (f: () => void) => {
        b.registerOnChange(f)
      }
    return { __buf__: true, put, set, get, list, dict, registerOnChange }
  },
  newListBuf = (t: Typ, tups: (Tup | null)[], i: U): ListBuf => {
    let
      b = newFixBuf(t, tups),
      onChange: (() => void) | null = null
    const
      put = (xs: any) => { if (Array.isArray(xs)) for (const x of xs) set("", x) },
      set = (key: S, v: any) => {
        // Check if key is a valid index.
        const numKey = key !== "" ? +key : NaN
        if (!isNaN(numKey)) {
          let idx = numKey
          // If negative, start from last inserted idx.
          if (idx < 0) idx += i
          if (idx >= 0 && idx < tups.length) {
            b.seti(idx, v)
            return
          }
        }
        // Otherwise, append to the end.
        if (i >= tups.length) {
          tups = doubleTupsSize(tups)
          b = newFixBuf(t, tups)
          if (onChange) b.registerOnChange(onChange)
        }
        b.seti(i, v)
        i++
      },
      get = (k: S): Cur | null => {
        const i = parseI(k)
        if (!isNaN(i)) return geti(i)
        return null
      },
      geti = (i: U): Cur | null => {
        if (i >= 0 && i < tups.length) {
          const tup = tups[i]
          if (tup) return newCur(t, tup)
        }
        return null
      },
      list = (): Rec[] => {
        const xs: Rec[] = []
        for (const tup of tups) if (tup) xs.push(t.make(tup))
        return xs
      },
      dict = (): Dict<Rec> => ({}),
      registerOnChange = (f: () => void) => {
        onChange = f
        b.registerOnChange(f)
      }
    return { __buf__: true, put, set, get, list, dict, registerOnChange }
  },
  newMapBuf = (t: Typ, tups: Dict<Tup>): MapBuf => {
    let onChange: (() => void) | null = null
    const
      put = (xs: any) => {
        const ts: Dict<Tup> = {}
        for (const k in xs) {
          const x = xs[k], tup = t.match(x)
          if (tup) {
            ts[k] = tup
            if (onChange) onChange()
          }
        }
        tups = ts
      },
      set = (k: S, v: any) => {
        if (v === null) {
          delete tups[k]
        } else {
          const tup = t.match(v)
          if (tup) tups[k] = tup
        }
      },
      get = (k: S): Cur | null => {
        const tup = tups[k]
        return tup ? newCur(t, tup) : null
      },
      list = (): Rec[] => {
        const keys = keysOf(tups)
        keys.sort()
        const xs: Rec[] = []
        for (const k of keys) xs.push(t.make(tups[k]))
        return xs
      },
      dict = (): Dict<Rec> => {
        const d: Dict<Rec> = {}
        for (const k in tups) d[k] = t.make(tups[k])
        return d
      },
      registerOnChange = (f: () => void) => onChange = f
    return { __buf__: true, put, set, get, list, dict, registerOnChange }
  },
  newTups = (n: U) => {
    const xs = new Array<Tup | null>(n)
    for (let i = 0; i < n; i++) xs[i] = null
    return xs
  },
  doubleTupsSize = (tups: (Tup | null)[]) => {
    const n = tups.length
    const xs = new Array<Tup | null>(n * 2)
    for (let i = 0; i < n; i++) xs[i] = tups[i]
    return xs
  },
  loadCycBuf = (b: CycBufD): CycBuf => {
    const t = newType(b.f)
    return b.d && b.d.length
      ? newCycBuf(t, b.d, b.i ?? b.d.length)
      : newCycBuf(t, newTups(b.n <= 0 ? 10 : b.n), 0)
  },
  loadListBuf = (b: ListBufD): ListBuf => {
    const t = newType(b.f)
    return b.d && b.d.length
      ? newListBuf(t, b.d, b.d.length)
      : newListBuf(t, newTups(b.n <= 0 ? 10 : b.n), 0)
  },
  loadFixBuf = (b: FixBufD): FixBuf => {
    const t = newType(b.f)
    return newFixBuf(t, b.d && b.d.length ? b.d : newTups(b.n <= 0 ? 10 : b.n))
  },
  loadMapBuf = (b: MapBufD): MapBuf => {
    const t = newType(b.f)
    return newMapBuf(t, b.d || {})
  },
  loadBuf = (b: BufD): DataBuf | null => {
    if (b.c) return loadCycBuf(b.c)
    if (b.f) return loadFixBuf(b.f)
    if (b.m) return loadMapBuf(b.m)
    if (b.l) return loadListBuf(b.l)
    return null
  },
  loadCard = (key: S, c: CardD): Card => {
    const
      data: Dict<any> = {},
      componentCache: Dict<any> = {},
      changedB = box<B>(),
      ctor = (c: CardD) => {
        const { d, b } = c
        for (let k in d) {
          let v = d[k]
          if (b && k.length > 0 && k[0] === '~') {
            const buf = loadBuf(b[v as U])
            if (buf) {
              k = k.substring(1)
              v = buf
            }
          }
          if (k === "items" || k === "secondary_items" || k === "buttons") fillComponentNameMap(componentCache, v)
          set([k], v)
        }
      },
      set = (ks: S[], v: any) => {
        switch (ks.length) {
          case 0:
            return
          case 1:
            {
              const p = ks[0], b = data[p]
              if (v && (p === "side_panel" || p === "dialog" || p === "notification_bar")) {
                fillComponentNameMap(componentCache, v.items || v.buttons)
              }
              if (b && isBuf(b)) {
                b.put(v)
                return
              }
              const keys = p.split('.')
              const lastKey = keys[keys.length - 1]
              let x = data
              for (let i = 0; i < keys.length - 1; i++) x = gget(x, keys[i])
              v === null ? delete x[lastKey] : x[lastKey] = v
              return
            }
          default:
            {
              let x: any = data
              let i = 0
              if (!data.hasOwnProperty(ks[0]) && componentCache[ks[0]]) {
                x = componentCache[ks[0]]
                i = 1
              }
              for (; i < ks.length - 1; i++) x = gget(x, ks[i])
              gset(x, ks[ks.length - 1], v)
              return
            }
        }
      }
    ctor(c)
    return { id: xid(), name: key, state: data, changed: changedB, set }
  },
  gset = (x: any, k: S, v: any) => {
    if (x == null) return
    if (isBuf(x)) x.set(k, v)
    else if (isCur(x)) x.set(k, v)
    else if (isMap(x)) {
      if (v == null) delete x[k]; else x[k] = v
    } else if (Array.isArray(x)) {
      const i = parseI(k)
      if (!isNaN(i) && i >= 0 && i < x.length) x[i] = v
    }
  },
  gget = (x: any, k: S): any => {
    if (x == null) return null
    if (isBuf(x)) return x.get(k)
    if (isCur(x)) return x.get(k)
    if (isMap(x)) return x[k]
    if (Array.isArray(x)) {
      const i = parseI(k)
      if (!isNaN(i) && i >= 0 && i < x.length) return x[i]
    }
    return null
  },
  fillComponentNameMap = (nameComponentMap: Dict<any>, items: any) => {
    if (!items) return
    for (const item of items) {
      // Form components are always wrapped in a single key object.
      let component = item[Object.keys(item)[0]]
      // Handle non-form components, e.g. ui.tab.
      if (typeof component !== 'object') component = item
      if (component.name) nameComponentMap[component.name] = component
      if (component.items) fillComponentNameMap(nameComponentMap, component.items)
      if (component.secondary_items) fillComponentNameMap(nameComponentMap, component.secondary_items)
      // TODO: Maybe support choices?
      if (component.buttons) fillComponentNameMap(nameComponentMap, component.buttons)
    }
  },
  newPage = (): XPage => {
    let dirty = false, dirties: Dict<B> = {}

    const
      key = xid(),
      cards: Dict<Card> = {},
      changedB = box<B>(),
      add = (k: S, card: Card) => {
        cards[k] = card
        dirty = true
      },
      get = (k: S): Card | undefined => cards[k],
      items = (): Card[] => valuesOf(cards),
      drop = (k: S) => delete cards[k],
      set = (k: S, v: any) => {
        const ks = k.split(/\s+/g)
        if (ks.length === 1) {
          delete cards[k]
          dirty = true
          return
        }
        const cn = ks[0], c = cards[cn]
        if (c) {
          c.set(ks.slice(1), v)
          dirties[cn] = true
          // Special-case *_card.box and meta_card.layouts: changes require page invalidation
          const p = ks[1]
          if (p && (p === 'box' || (c.state['view'] === 'meta' && p === 'layouts'))) dirty = true
        }
      },
      emit = () => {
        if (dirty) {
          changedB(true)
        } else {
          for (const k in dirties) {
            const c = cards[k]
            if (c) c.changed(true)
          }
        }
        dirty = false // reset
        dirties = {} // reset
      }

    return { key, changed: changedB, add, get, set, items, drop, emit }
  },
  load = ({ c }: PageD): XPage => {
    const page = newPage()
    for (const k in c) page.add(k, loadCard(k, c[k]))
    return page
  },
  exec = (page: XPage, ops: OpD[]): XPage | null => {
    for (const op of ops) {
      if (op.k && op.k.length > 0) {
        if (op.c) {
          page.set(op.k, loadCycBuf(op.c))
        } else if (op.f) {
          page.set(op.k, loadFixBuf(op.f))
        } else if (op.m) {
          page.set(op.k, loadMapBuf(op.m))
        } else if (op.l) {
          page.set(op.k, loadListBuf(op.l))
        } else if (op.d) {
          page.add(op.k, loadCard(op.k, { d: op.d, b: op.b || [] }))
        } else {
          page.set(op.k, op.v)
        }
      } else { // drop page
        page = newPage()
      }
    }
    if (page) page.emit()
    return page
  },
  keyseq = (...keys: S[]): S => keys.join(' '),
  toSocketAddress = (path: S): S => {
    const
      { protocol, host } = window.location,
      p = protocol === 'https:' ? 'wss' : 'ws'
    return p + "://" + host + path
  },
  refreshRateB = box(-1) // TODO ugly; refactor

export const
  disconnect = () => refreshRateB(0),
  connect = (address: S, handle: WaveEventHandler): Wave => {
    let
      _socket: WebSocket | null = null,
      _page: XPage | null = null,
      _backoff = 1

    const
      slug = window.location.pathname,
      reconnect = (address: S) => {
        const retry = () => reconnect(address)
        const socket = new WebSocket(address)
        socket.onopen = () => {
          _socket = socket
          handle(connectEvent)
          _backoff = 1
          const hash = window.location.hash
          socket.send(`+ ${slug} ${hash.charAt(0) === '#' ? hash.substring(1) : hash}`) // protocol: t<sep>addr<sep>data
        }
        socket.onclose = () => {
          const refreshRate = refreshRateB()
          if (refreshRate === 0) return

          // TODO handle refreshRate > 0 case

          _socket = null
          _backoff *= 2
          if (_backoff > 16) _backoff = 16
          handle({ t: WaveEventType.Disconnect, retry: _backoff })
          window.setTimeout(retry, _backoff * 1000)
        }
        socket.onmessage = (e) => {
          if (!e.data) return
          if (!e.data.length) return
          handle(dataEvent)
          for (const line of e.data.split('\n')) {
            try {
              const msg = JSON.parse(line) as OpsD
              if (msg.d) {
                const page = exec(_page || newPage(), msg.d)
                if (_page !== page) {
                  _page = page
                  if (page) handle({ t: WaveEventType.Page, page })
                }
              } else if (msg.p) {
                const page = _page = load(msg.p)
                handle({ t: WaveEventType.Page, page })
              } else if (msg.e) {
                handle({ t: WaveEventType.Error, code: errorCodes[msg.e] || WaveErrorCode.Unknown })
              } else if (msg.r) {
                handle(resetEvent)
              } else if (msg.u) {
                handle({ t: WaveEventType.Redirect, url: msg.u })
              } else if (msg.m) {
                const { u: username, e: editable } = msg.m
                handle({ t: WaveEventType.Config, username, editable })
              }
            } catch (error) {
              console.error(error)
              handle({ t: WaveEventType.Exception, error })
            }
          }
        }
        socket.onerror = () => {
          handle(dataEvent)
        }
      },
      push = (data: any) => {
        if (!_socket) return
        _socket.send(`@ ${slug} ${JSON.stringify(data || {})}`)
      },
      fork = (): ChangeSet => {
        const
          ops: OpD[] = [],
          ref = (k: S): Ref => {
            const
              get = (key: S): Ref => ref(keyseq(k, key)),
              set = (key: S, value: any) => ops.push({ k: keyseq(k, key), v: value })
            return { get, set }
          },
          get = (key: S) => ref(key),
          put = (key: S, data: any) => ops.push({ k: key, d: data }),
          set = (key: S, value: any) => ops.push({ k: keyseq(key), v: value }),
          del = (key: S) => ops.push({ k: key }),
          drop = () => ops.push({}),
          push = () => {
            if (!_socket) return
            const opsd: OpsD = { d: ops }
            _socket.send(`* ${slug} ${JSON.stringify(opsd)}`)
          }
        return { get, put, set, del, drop, push }
      }

    on(refreshRateB, r => {
      // If we receive a change in refresh rate once the page has been loaded, close the socket.
      // The socket onclose handler will reconnect using the refresh rate if necessary.
      if (r < 0) return
      if (_socket) _socket.close()
    })

    reconnect(toSocketAddress(address))

    return { fork, push }
  }
