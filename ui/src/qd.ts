import * as React from 'react'
import { Dialog } from './meta'

//
// Dataflow
// Mostly a port of H2O Flow's dataflow.coffee
//

export type Act = () => void
export type Eff<T> = (t: T) => void
export type Eff2<A, B> = (a: A, b: B) => void
export type Eff3<A, B, C> = (a: A, b: B, c: C) => void
export type Eff4<A, B, C, D> = (a: A, b: B, c: C, d: D) => void
export type Func<A, B> = (a: A) => B
export type Func2<A, B, C> = (a: A, b: B) => C
export type Func3<A, B, C, D> = (a: A, b: B, c: C) => D

export interface Disposable { dispose(): void }
interface Arrow<T> extends Disposable { f: Eff<T> }

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
export function box<T>(value?: T, equal?: Equal<T>): Box<T>;
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

export function boxed<T>(x: any): x is Box<T> { return x && x.__boxed__ === true }
export function unbox<T>(x: T | Box<T>): T { return boxed(x) ? x() : x }
export function rebox<T>(b: Box<T>, f: Eff<T>) { const x = b(); f(x); (b as Boxed<T>).touch() }

export function on<A>(a: Box<A>, f: Eff<A>): Disposable;
export function on<A, B>(a: Box<A>, b: Box<B>, f: Eff2<A, B>): Disposable;
export function on<A, B, C>(a: Box<A>, b: Box<B>, c: Box<C>, f: Eff3<A, B, C>): Disposable;
export function on<A, B, C, D>(a: Box<A>, b: Box<B>, c: Box<C>, d: Box<D>, f: Eff4<A, B, C, D>): Disposable;
export function on(...args: any[]): Disposable { return react(false, args.slice(0, args.length - 1), args[args.length - 1]) }

export function to<A>(a: Box<A>, f: Eff<A>): Disposable;
export function to<A, B>(a: Box<A>, b: Box<B>, f: Eff2<A, B>): Disposable;
export function to<A, B, C>(a: Box<A>, b: Box<B>, c: Box<C>, f: Eff3<A, B, C>): Disposable;
export function to<A, B, C, D>(a: Box<A>, b: Box<B>, c: Box<C>, d: Box<D>, f: Eff4<A, B, C, D>): Disposable;
export function to(...args: any[]): Disposable { return react(true, args.slice(0, args.length - 1), args[args.length - 1]) }

// tslint:disable-next-line:ban-types
export function react(immediate: boolean, boxen: Box<any>[], f: Function): Disposable {
  const
    xs = boxen as Boxed<any>[],
    emit = () => f(...xs.map(x => x())),
    arrows = xs.map(x => x.on(emit)),
    dispose = () => arrows.forEach(a => a.dispose())

  if (immediate) emit()
  return { dispose }
}

export function by<A, B>(a: Box<A>, map: Func<A, B>): Box<B>
export function by<A, B, C>(a: Box<A>, b: Box<B>, zip: Func2<A, B, C>): Box<B>
export function by<A, B, C, D>(a: Box<A>, b: Box<B>, c: Box<C>, zip: Func3<A, B, C, D>): Box<B>
export function by(...args: any[]): any {
  if (args.length < 2) throw new Error(`invalid number of args: want 2 or more, got ${args.length}`)
  const
    m = args.length - 1,
    xs = args.slice(0, m) as Boxed<any>[],
    f = args[m] as Function,
    yB = box(f(...xs.map(x => x())))

  xs.forEach(x => x.on(_ => yB(f(...xs.map(x => x())))))
  return yB
}

export function watch<T>(x: Box<T>, label?: string): Disposable {
  // eslint-disable-next-line no-console
  return on(x, label ? ((x: T) => console.log(label, x)) : ((x: T) => console.log(x)))
}

function remove<T>(xs: T[], x: T): void { const i = xs.indexOf(x); if (i > -1) xs.splice(i, 1) }

//
// React Component + Dataflow
//

interface Renderable {
  render(): JSX.Element
  init?(): void
  update?(): void
  dispose?(): void
}

export function bond<TProps, TState extends Renderable>(ctor: (props: TProps) => TState) {
  return class extends React.Component<TProps> {
    private readonly model: TState
    private readonly arrows: Disposable[]
    constructor(props: TProps) {
      super(props)

      const
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        self = this,
        model = ctor(props),
        arrows: Disposable[] = []

      Object.keys(model).forEach(k => {
        if (k === 'render' || k === 'dispose' || k === 'init' || k === 'update') return
        const v = (model as any)[k]
        if (boxed(v)) arrows.push(on(v, _ => self.setState({})))
      })

      this.model = model
      this.arrows = arrows
      this.state = {}
    }
    componentDidMount() {
      if (this.model.init) this.model.init()
    }
    componentDidUpdate() {
      if (this.model.update) this.model.update()
    }
    componentWillUnmount() {
      if (this.model.dispose) this.model.dispose()
      for (const a of this.arrows) a.dispose()
    }
    render() {
      return this.model.render()
    }
  }
}

//
// Sync
//

export type B = boolean
export type U = number
export type I = number
export type F = number
export type S = string
export type D = Date
export type V = F | S | D
export type Prim = S | F | B | null // primitive
export interface Size { width: U, height: U }
export interface Rect extends Size { left: U, top: U }

export interface Dict<T> { [key: string]: T } // generic object

export type Rec = Dict<Prim | Prim[]> // Record; named "Rec" to distinguish from Typescript's Record<K,T> utility type.
export type Recs = Rec[]
export type Packed<T> = T | S

export interface Data {
  list(): (Rec | null)[]
}

interface OpsD {
  p?: PageD // init
  d?: OpD[] // deltas
  e?: S // error
  r?: U // reset
}
interface OpD {
  k?: S
  v?: any
  c?: CycBufD
  f?: FixBufD
  m?: MapBufD
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

export interface Page {
  key: S
  changed: Box<B>
  add(k: S, c: C): void
  get(k: S): C | undefined
  set(k: S, v: any): void
  list(): C[]
  drop(k: S): void
  sync(): void
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
}
export interface Card<T> {
  name: S
  state: T
  changed: Box<B>
}
export interface C extends Card<Dict<any>> {
  id: S
  set(ks: S[], v: any): void
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
type MapBuf = DataBuf

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
  dict = <T extends {}>(kvs: [S, T][]): Dict<T> => {
    const d: Dict<T> = {}
    for (const [k, v] of kvs) d[k] = v
    return d
  },
  unpack = <T extends {}>(data: any): T =>
    (typeof data === 'string')
      ? decodeString(data)
      : (isData(data))
        ? data.list()
        : data,
  iff = (x: S) => x && x.length ? x : undefined

const
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
  }

const
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
  isBuf = (x: any): x is Buf => x != null && x.__buf__ === true,
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
            if (tup) tups[i] = tup
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
      }
    return { __buf__: true, n, put, set, seti, get, geti, list }
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
      }
    return { __buf__: true, put, set, get, list }
  },
  newMapBuf = (t: Typ, tups: Dict<Tup>): MapBuf => {
    const
      put = (xs: any) => {
        const ts: Dict<Tup> = {}
        for (const k in xs) {
          const x = xs[k], tup = t.match(x)
          if (tup) ts[k] = tup
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
      }
    return { __buf__: true, put, set, get, list }
  },
  newTups = (n: U) => {
    const xs = new Array<Tup | null>(n)
    for (let i = 0; i < n; i++) xs[i] = null
    return xs
  },
  loadCycBuf = (b: CycBufD): CycBuf => {
    const t = newType(b.f)
    return b.d && b.d.length
      ? newCycBuf(t, b.d, b.i)
      : newCycBuf(t, newTups(b.n <= 0 ? 10 : b.n), 0)
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
    return null
  },
  loadCard = (key: S, c: CardD): C => {
    const
      data: Dict<any> = {},
      changedB = box<B>(),
      ctor = (c: CardD) => {
        const { d, b } = c
        for (let k in d) {
          let v = d[k]
          if (b && k.length > 0 && k[0] === '~') {
            const buf = loadBuf(b[v as U])
            if (buf) {
              k = k.substr(1)
              v = buf
            }
          }
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
              if (b && isBuf(b)) {
                b.put(v)
                return
              }
              if (v == null) delete data[p]; else data[p] = v
              return
            }
          default:
            {
              let x: any = data
              const p = ks[ks.length - 1]
              for (const k of ks.slice(0, ks.length - 1)) x = gget(x, k)
              gset(x, p, v)
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
  newPage = (): Page => {
    let dirty = false, dirties: Dict<B> = {}

    const
      key = xid(),
      cards: Dict<C> = {},
      changedB = box<B>(),
      add = (k: S, card: C) => {
        cards[k] = card
        dirty = true
      },
      get = (k: S): C | undefined => cards[k],
      list = (): C[] => valuesOf(cards),
      drop = (k: S) => delete cards[k],
      set = (k: S, v: any) => {
        const ks = k.split(/\s+/g)
        if (ks.length === 1) {
          delete cards[k]
          dirty = true
          return
        }
        const c = cards[ks[0]]
        if (c) {
          c.set(ks.slice(1), v)
          dirties[ks[0]] = true
        }
      },
      sync = () => {
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

    return { key, changed: changedB, add, get, set, list, drop, sync }
  },
  load = ({ c }: PageD): Page => {
    const page = newPage()
    for (const k in c) page.add(k, loadCard(k, c[k]))
    return page
  },
  exec = (page: Page, ops: OpD[]): Page | null => {
    for (const op of ops) {
      if (op.k && op.k.length > 0) {
        if (op.c) {
          page.set(op.k, loadCycBuf(op.c))
        } else if (op.f) {
          page.set(op.k, loadFixBuf(op.f))
        } else if (op.m) {
          page.set(op.k, loadMapBuf(op.m))
        } else if (op.d) {
          page.add(op.k, loadCard(op.k, { d: op.d, b: op.b || [] }))
        } else {
          page.set(op.k, op.v)
        }
      } else { // drop page
        page = newPage()
      }
    }
    if (page) page.sync()
    return page
  }

//
// In-browser API
//

export interface PageRef {
  get(key: S): Ref
  set(key: S, value: any): void
  del(key: S): void
  drop(): void
  sync(): void
}

export interface Ref {
  get(key: S): Ref
  set(key: S, value: any): void
}

export interface Qd {
  readonly path: S
  readonly args: Rec
  readonly events: Dict<any>
  readonly refreshRateB: Box<U>
  readonly busyB: Box<B>
  socket: WebSocket | null
  dialogB: Box<Dialog | null>
  page(): PageRef
  sync(): void
}

const
  keyseq = (...keys: S[]): S => keys.join(' '),
  clearRec = (a: Rec) => {
    for (const k in a) delete a[k]
  }

export const qd: Qd = {
  path: window.location.pathname,
  args: {},
  events: {},
  refreshRateB: box(-1),
  busyB: box(false),
  socket: null,
  dialogB: box(null),
  page: (path?: S): PageRef => {
    path = path || qd.path
    const
      changes: OpD[] = [],
      ref = (k: S): Ref => {
        const
          get = (key: S): Ref => ref(`${k}.${key}`),
          set = (key: S, value: any) => changes.push({ k: keyseq(k, key), v: value })
        return { get, set }
      },
      get = (key: S) => ref(key),
      set = (key: S, value: any) => changes.push({ k: keyseq(key), v: value }),
      del = (key: S) => changes.push({ k: key }),
      drop = () => changes.push({}),
      sync = () => {
        const sock = qd.socket
        if (!sock) return
        const opsd: OpsD = { d: changes }
        sock.send(`* ${path} ${JSON.stringify(opsd)}`)
      }
    return { get, set, del, drop, sync }
  },
  sync: () => {
    const sock = qd.socket
    if (!sock) return
    const args: Dict<any> = { ...qd.args }
    clearRec(qd.args)
    if (Object.keys(qd.events).length) {
      args[''] = { ...qd.events }
      clearRec(qd.events)
    }
    sock.send(`@ ${qd.path} ${JSON.stringify(args)}`)
    qd.busyB(true)
  },
}

on(qd.refreshRateB, r => {
  // If we receive a change in refresh rate once the page has been loaded, close the socket.
  // The socket onclose handler will reconnect using the refresh rate if necessary.
  if (r < 0) return
  const sock = qd.socket
  if (sock) sock.close()
})

export enum SockEventType { Message, Data, Reset }
export type SockEvent = SockMessage | SockData | SockReload
export interface SockData { t: SockEventType.Data, page: Page }
export enum SockMessageType { Info, Warn, Err }
export interface SockMessage { t: SockEventType.Message, type: SockMessageType, message: S }
export interface SockReload { t: SockEventType.Reset }
type SockHandler = (e: SockEvent) => void

let backoff = 1, currentPage: Page | null = null
const
  toSocketAddress = (path: S): S => {
    const
      l = window.location,
      p = l.protocol === 'https:' ? 'wss' : 'ws'
    return p + "://" + l.host + path
  },
  reconnect = (address: S, handle: SockHandler) => {
    const retry = () => reconnect(address, handle)
    const sock = new WebSocket(address)
    sock.onopen = function () {
      qd.socket = sock
      handle({ t: SockEventType.Message, type: SockMessageType.Info, message: 'Connected' })
      backoff = 1
      const hash = window.location.hash
      sock.send(`+ ${qd.path} ${hash.charAt(0) === '#' ? hash.substr(1) : hash}`) // protocol: t<sep>addr<sep>data
    }
    sock.onclose = function () {
      const refreshRate = qd.refreshRateB()
      if (refreshRate === 0) return

      // TODO handle refreshRate > 0 case

      qd.socket = null
      backoff *= 2
      if (backoff > 16) backoff = 16
      handle({ t: SockEventType.Message, type: SockMessageType.Warn, message: `Disconneced. Reconnecting in ${backoff} seconds...` })
      setTimeout(retry, backoff * 1000)
    }
    sock.onmessage = function (e) {
      if (!e.data) return
      if (!e.data.length) return
      qd.busyB(false)
      for (const line of e.data.split('\n')) {
        try {
          const msg = JSON.parse(line) as OpsD
          if (msg.d) {
            const page = exec(currentPage || newPage(), msg.d)
            if (currentPage !== page) {
              currentPage = page
              if (page) handle({ t: SockEventType.Data, page: page })
            }
          } else if (msg.p) {
            currentPage = load(msg.p)
            handle({ t: SockEventType.Data, page: currentPage })
          } else if (msg.e) {
            handle({ t: SockEventType.Message, type: SockMessageType.Err, message: msg.e })
          } else if (msg.r) {
            handle({ t: SockEventType.Reset })
          }
        } catch (err) {
          console.error(err)
          handle({ t: SockEventType.Message, type: SockMessageType.Err, message: `Error: ${err}` })
        }
      }
    }
    sock.onerror = function (e: Event) {
      qd.busyB(false)
      console.error('A websocket error was encountered.', e) // XXX
    }
  }

export const connect = (path: S, handle: SockHandler) => reconnect(toSocketAddress(path), handle)

