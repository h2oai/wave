
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
