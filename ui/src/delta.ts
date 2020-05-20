import { box, Box } from "./dataflow"

export type B = boolean
export type U = number
export type I = number
export type F = number
export type S = string
export type D = Date
export type V = F | S | D
export type Prim = S | F | B | null // primitive

export interface Dict<T> { [key: string]: T } // generic object
export type Rec = Dict<Prim>


type Handler = () => void
interface Eventer {
  on(f: Handler): void
  off(f?: Handler): void
  emit(): void
}


interface OpsD {
  p?: PageD // init
  d?: OpD[] // deltas
  e?: S // error
}
interface OpD {
  k?: S
  v?: any
  __c__?: CycBufD
  __f__?: FixBufD
  __m__?: MapBufD
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
  __c__: CycBufD
  __f__: FixBufD
  __m__: MapBufD
}
interface MapBufD {
  f: S[]
  d: Dict<Tup>
}
interface FixBufD {
  f: S[]
  d: Array<Tup | null>
  n: U
}
interface CycBufD {
  f: S[]
  d: Array<Tup | null>
  n: U
  i: U
}

export interface Data {
  list(): Rec[]
}

export interface Page {
  key: S
  changedB: Box<B>
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
  data: T
  changed: Eventer
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
interface CycBuf extends DataBuf { }
interface MapBuf extends DataBuf { }

let guid = 0
export const
  xid = () => `x${++guid}`,
  parseI = (s: S): I => {
    if (!/^-{0,1}\d+$/.test(s)) return NaN
    return parseInt(s, 10)
  },
  dict = <T extends {}>(kvs: [S, T][]): Dict<T> => {
    const d: Dict<T> = {}
    for (const [k, v] of kvs) d[k] = v
    return d
  },
  newEvent = (): Eventer => {
    const
      fs: Array<Handler> = [],
      on = (f: Handler) => fs.push(f),
      off = (f?: Handler) => {
        if (f) {
          const i = fs.indexOf(f)
          if (i >= 0) fs.splice(i, 1)
        } else {
          fs.length = 0
        }
      },
      emit = () => { for (const f of fs) f() }
    return { on, off, emit }
  },
  decode = <T extends {}>(data: any): T =>
    (typeof data === 'string')
      ? decodeString(data)
      : (isData(data))
        ? data.list()
        : data

const
  decodeType = (d: S): [S, S] => {
    const i = d.indexOf(':')
    return (i > 0) ? [d.substring(0, i), d.substring(i + 1)] : ['', d]
  },
  decodeString = (data: S): any => {
    if (data === '') return data
    const [t, d] = decodeType(data)
    switch (t) {
      case 'json':
        try {
          return JSON.parse(d)
        } catch (e) {
          console.error(e)
        }
        break
      case 'data':
        try {
          const { f: fields, r: rows, c: columns } = JSON.parse(d)
          if (!Array.isArray(fields)) return data

          const w = fields.length // width
          if (Array.isArray(rows)) {
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
          } else if (Array.isArray(columns)) {
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
          }
        } catch (e) {
          console.error(e)
        }

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
  newFixBuf = (t: Typ, tups: Array<Tup | null>): FixBuf => {
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
        for (const k in keys) xs.push(t.make(tups[k]))
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
    if (b.__c__) return loadCycBuf(b.__c__)
    if (b.__f__) return loadFixBuf(b.__f__)
    if (b.__m__) return loadMapBuf(b.__m__)
    return null
  },
  loadCard = (key: S, c: CardD): C => {
    const
      data: Dict<any> = {},
      changed = newEvent(),
      ctor = (c: CardD) => {
        const { d, b } = c
        for (let k in d) {
          let v = d[k]
          if (b && k.length > 0 && k[0] === '#') {
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
    return { id: xid(), name: key, data, changed, set }
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
            if (c) c.changed.emit()
          }
        }
      }

    return { key, changedB, add, get, set, list, drop, sync }
  },
  load = ({ c }: PageD): Page => {
    const page = newPage()
    for (const k in c) page.add(k, loadCard(k, c[k]))
    return page
  },
  exec = (page: Page | null, ops: OpD[]): Page | null => {
    for (const op of ops) {
      if (op.k && op.k.length > 0) {
        if (page) {
          if (op.__c__) {
            page.set(op.k, loadCycBuf(op.__c__))
          } else if (op.__f__) {
            page.set(op.k, loadFixBuf(op.__f__))
          } else if (op.__m__) {
            page.set(op.k, loadMapBuf(op.__m__))
          } else if (op.d) {
            page.add(op.k, loadCard(op.k, { d: op.d, b: op.b || [] }))
          } else {
            page.set(op.k, op.v)
          }
        }
      } else { // drop page
        page = newPage()
      }
    }
    if (page) page.sync()
    return page
  }

export interface Socket {
  current: WebSocket | null
}
export const socket: Socket = { current: null }

export enum SockEventType { Message, Data }
export type SockEvent = SockMessage | SockData
export interface SockData { t: SockEventType.Data, page: Page }
export enum SockMessageType { Info, Warn, Err }
export interface SockMessage { t: SockEventType.Message, type: SockMessageType, message: S }
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
    let sock = new WebSocket(address)
    sock.onopen = function () {
      socket.current = sock
      handle({ t: SockEventType.Message, type: SockMessageType.Info, message: 'Connected' })
      backoff = 1
      sock.send(`+ ${window.location.pathname} `) // protocol: t<sep>addr<sep>data
    }
    sock.onclose = function () {
      socket.current = null
      backoff *= 2
      if (backoff > 16) backoff = 16
      handle({ t: SockEventType.Message, type: SockMessageType.Warn, message: `Disconneced. Reconnecting in ${backoff} seconds...` })
      setTimeout(retry, backoff * 1000)
    }
    sock.onmessage = function (e) {
      if (!e.data) return
      if (!e.data.length) return
      for (const line of e.data.split('\n')) {
        try {
          const msg = JSON.parse(line) as OpsD
          if (msg.d) {
            const newPage = exec(currentPage, msg.d)
            if (currentPage !== newPage) {
              currentPage = newPage
              if (newPage) handle({ t: SockEventType.Data, page: newPage })
            }
          } else if (msg.p) {
            currentPage = load(msg.p)
            handle({ t: SockEventType.Data, page: currentPage })
          } else if (msg.e) {
            handle({ t: SockEventType.Message, type: SockMessageType.Err, message: msg.e })
          }
        } catch (err) {
          console.error(err)
          handle({ t: SockEventType.Message, type: SockMessageType.Err, message: `Error: ${err}` })
        }
      }
    }
    sock.onerror = function (e: Event) {
      console.error('A websocket error was encountered.', e) // XXX
    }
  }

export const connect = (path: S, handle: SockHandler) => reconnect(toSocketAddress(path), handle)
