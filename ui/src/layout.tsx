import { default as React } from 'react'
import { stylesheet } from 'typestyle'
import { CardMenu } from './card_menu'
import { format, isFormatExpr } from './intl'
import { B, bond, box, C, Card, Dict, F, Page, parseI, Rec, S, U, unpack, xid } from './qd'
import { getTheme, margin } from './theme'

type Slot = {
  x: U
  y: U
  w: U
  h: U
}

const
  newCardRegistry = () => {
    const
      m: Dict<typeof React.Component> = {},
      register = (name: S, ctor: typeof React.Component) => m[name] = ctor,
      lookup = (name: S) => m[name] || m['']
    return { register, lookup }
  }

export const
  cards = newCardRegistry(),
  substitute = (formatString?: S, data?: Rec, defaultValue: any = null) => {
    return (formatString !== undefined && formatString !== null)
      ? isFormatExpr(formatString)
        ? format(formatString.substr(1), data)
        : formatString
      : (defaultValue !== undefined && defaultValue !== null)
        ? defaultValue
        : null
  },
  Format = ({ data, defaultValue: v, format: f }: { data?: Rec, defaultValue?: any, format?: S }) => {
    const x = substitute(f, data, v)
    return x === null ? x : <>{x}</>
  },
  CardView = ({ card }: { card: Card<any> }) => {
    const Tag = cards.lookup(card.state.view)
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

type Size = [U, U]

const
  badPlacement: Slot = { x: 0, y: 0, w: 0, h: 0 },
  newGrid = (uw: U, uh: U, cols: U, rows: U, gap: U) => {
    let scale = 1
    const
      iw = uw - 2 * gap, // unit inner width
      ih = uh - 2 * gap, // unit inner height
      width = uw * cols + gap * (cols + 1),
      height = uh * rows + gap * (rows + 1),
      giw = width - 2 * gap,
      gih = height - 2 * gap,
      normalize = (s: S): S[] => {
        const x = s.trim().split(/\s+/g)
        switch (x.length) {
          case 1: return ['1', '1', s, s]
          case 2: return ['1', '1', ...x]
          case 3: return [...x, x[2]]
          case 4: return x
          default: return x.slice(0, 4)
        }
      },
      place = (s: S): Slot => {
        if (!s) return badPlacement
        const [x, y, w, h] = normalize(s).map(parseI)
        if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return badPlacement
        return {
          x,
          y,
          w: w > 0 ? w : cols + w, // XXX breaks backward compatibility
          h: h > 0 ? h : rows + h, // XXX breaks backward compatibility
        }
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

const
  theme = getTheme(),
  css = stylesheet({
    grid: {
      position: 'relative',
      display: 'grid',
      width: grid.innerWidth,
      height: grid.innerHeight,
      gridTemplateColumns: 'repeat(12,1fr)',
      gridTemplateRows: 'repeat(10,1fr)',
      gap: grid.gap,
      margin: margin(grid.gap),
    },
    slot: {
      position: 'relative',
      backgroundColor: theme.colors.card,
      boxSizing: 'border-box',
      borderRadius: 3,
      boxShadow: `0px 3px 5px ${theme.colors.text0}`,
      overflow: 'auto',
      $nest: {
        '>*:first-child': {
          position: 'absolute',
          left: grid.gap, top: grid.gap, right: grid.gap, bottom: grid.gap,
        }
      }
    }
  })

export const
  GridSlot = bond(({ c }: { c: C }) => {
    const
      render = () => {
        const
          slot = grid.place(c.state.box),
          { x, y, w, h } = slot,
          display = slot === badPlacement ? 'none' : 'block',
          zIndex = c.name === '__unhandled_error__' ? 1 : 'initial'

        return (
          <div className={css.slot} style={{ display, gridArea: `${y}/${x}/span ${h}/span ${w}`, zIndex }}>
            <CardView card={c} />
            {!!c.state.commands?.length && <CardMenu name={c.name} commands={c.state.commands} changedB={c.changed} />}
          </div>
        )
      }
    return { render }
  }),
  GridLayout = bond(({ page }: { page: Page }) => {
    const
      { changed } = page,
      render = () => {
        const
          children = page.list().map(c => <GridSlot key={c.id} c={c} />)
        return (
          <div data-test={page.key} className={css.grid}>
            {children}
          </div>
        )
      }
    return { render, changed }
  })
