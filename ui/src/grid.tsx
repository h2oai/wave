import React from 'react';
import { box, B, Card, unpack, Dict, F, parseI, Rec, Rect, S, U, xid } from './telesync';
import { format, isFormatExpr } from './intl';

export const
  Format = ({ data, defaultValue: v, format: f }: { data?: Rec, defaultValue?: any, format?: S }) => {
    return (f !== undefined && f !== null)
      ? isFormatExpr(f)
        ? <>{format(f.substr(1), data)}</>
        : <>{f}</>
      : (v !== undefined && v !== null)
        ? <>{v}</>
        : null
  },
  CardView = ({ card }: { card: Card<any> }) => {
    let Tag = cards.lookup(card.state.view)
    return <Tag {...card} />
  },
  Repeat = ({ view, props, data }: { view: S | any, props: any, data: any }) => {
    const items = unpack<Rec[]>(data).map((r, i) => {
      const card: Card<any> = {
        name: xid(),
        state: { ...unpack<Rec>(props), view, data: r },
        changed: box<B>(),
      }
      return <CardView key={i} card={card} />
    })
    return <>{items}</>
  }

const
  newCardRegistry = () => {
    const
      m: Dict<any> = {},
      register = (name: S, ctor: any) => m[name] = ctor,
      lookup = (name: S) => m[name] || m['']
    return { register, lookup }
  }

export const cards = newCardRegistry()

type Size = [U, U]

const
  newGrid = (uw: U, uh: U, cols: U, rows: U, gap: U) => {
    let scale = 1
    const
      iw = uw - 2 * gap, // unit inner width
      ih = uh - 2 * gap, // unit inner height
      width = uw * cols + gap * (cols + 1),
      height = uh * rows + gap * (rows + 1),
      giw = width - 2 * gap,
      gih = height - 2 * gap,
      placeOnGrid = (x: U, y: U, w: U, h: U): Rect => ({
        left: x * (uw + gap),
        top: y * (uh + gap),
        width: w * uw + (w - 1) * gap,
        height: h * uh + (h - 1) * gap,
      }),
      badPlacement: Rect = placeOnGrid(1, 1, 1, 1), // XXX
      normalize = (g: S): S[] => {
        const x = g.trim().split(/\s+/g)
        switch (x.length) {
          case 1: return ['1', '1', g, g]
          case 2: return ['1', '1', ...x]
          case 3: return [...x, x[2]]
          case 4: return x
          default: return x.slice(0, 4)
        }
      },
      place = (g: S): Rect => {
        const [x, y, w, h] = normalize(g).map(parseI)
        if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return badPlacement
        return placeOnGrid(x - 1, y - 1, w, h)
      },
      getWindowSize = (): Size => ([
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      ]),
      rescale = (): F => {
        const [w, h] = getWindowSize()
        scale = Math.min(w / width, h / height)
        return scale
      },
      inset: React.CSSProperties = ({ position: 'absolute', left: gap, top: gap, right: gap, bottom: gap, overflow: 'auto' })
    return {
      width, height,
      innerWidth: giw, innerHeight: gih,
      unitWidth: uw, unitHeight: uh,
      unitInnerWidth: iw, unitInnerHeight: ih,
      gap, place, scale, rescale, inset,
    }
  }

export const
  grid = newGrid(134, 76, 12, 10, 15) // approx 1800x930
