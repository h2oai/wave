import { default as React } from 'react'
import { stylesheet } from 'typestyle'
import { CardMenu } from './card_menu'
import { GridLayout, CardView } from './layout'
import { Area, Layout, layoutsB, preload } from './meta'
import { B, bond, box, C, Dict, Disposable, on, Page, parseU, S, U } from './qd'
import { getTheme } from './theme'


type Breakpoint = {
  layout: Layout
  min: U
  max: U
  listener(e: MediaQueryListEvent): void
  mq: MediaQueryList
}

type Slot = {
  area?: S
  order?: U
  grow?: U
  size1?: S
  size2?: S
}

type CardSlot = {
  card: C
  slot: Slot
}

type Section = {
  area: Area
  sections?: Section[]
  cardslots: CardSlot[]
}


const
  presetBreakpoints: Dict<S> = {
    xs: '0px',
    s: '576px',
    m: '768px',
    l: '992px',
    xl: '1200px',
  },
  breakpointsB = box<Breakpoint[]>([]),
  layoutB = box<{ layout: Layout, index: U } | null>(null),
  parseBreakpoint = (spec: S): U => parseInt(presetBreakpoints[spec] ?? spec, 10),
  badSlot: Slot = {},
  parseBox = (index: U, spec: S): Slot => {
    if (!spec) return badSlot
    if (!spec.length) return badSlot
    const specs = spec.split(/\s*\/\s*/)
    let s = specs[index]
    if (!s) s = s[0] // shorthand: assume same area for every layout
    if (!s) return badSlot
    const
      [areaOrder, size1, size2] = s.split(/\s+/),
      [area, orderS] = areaOrder.split('#'),
      order = parseU(orderS),
      grow = parseU(size1)
    return {
      area,
      order: isNaN(order) ? undefined : order,
      grow: isNaN(grow) ? undefined : grow,
      size1,
      size2,
    }
  },
  segregate = <T extends {}>(xs: T[], f: (x: T) => B): [T[], T[]] => {
    const a: T[] = [], b: T[] = []
    for (const x of xs) (f(x) ? a : b).push(x)
    return [a, b]
  }

on(layoutsB, layouts => {
  const
    bps = layouts.map((layout, index): Breakpoint => {
      const
        nextLayout = layouts[index + 1],
        min = parseBreakpoint(layout.breakpoint),
        max = nextLayout ? parseBreakpoint(nextLayout.breakpoint) - 1 : 0,
        mq = window.matchMedia(
          max
            ? `(min-width:${min}px) and (max-width:${max}.98px)`
            : `(min-width:${min}px)`
        ),
        listener = (mq: MediaQueryListEvent) => { if (mq.matches) layoutB({ layout, index }) },
        bp: Breakpoint = { layout, min, max, mq, listener }

      mq.addEventListener('change', listener)
      if (mq.matches) layoutB({ layout, index })

      return bp
    })

  for (const { mq, listener } of breakpointsB()) mq.removeEventListener('change', listener)
  breakpointsB(bps)
})

const
  theme = getTheme(),
  gap = 15,
  css = stylesheet({
    layout: {
      display: 'flex',
    },
    flex: {
      position: 'relative',
      display: 'flex',
    },
    slot: {
      position: 'relative',
      backgroundColor: theme.colors.card,
      boxSizing: 'border-box',
      boxShadow: `0px 3px 5px ${theme.colors.text0}`,
      overflow: 'auto',
      $nest: {
        '>*:first-child': {
          position: 'absolute',
          left: gap, top: gap, right: gap, bottom: gap,
        }
      }
    }
  }),
  justifications: Dict<S> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
  },
  alignments: Dict<S> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch',
  },
  wrappings: Dict<S> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    stretch: 'stretch',
  },
  toSectionStyle = (area: Area, direction?: S): React.CSSProperties => {
    const
      css: React.CSSProperties = {
        flexDirection: area.direction === 'row' ? 'row' : 'column',
        justifyContent: justifications[area.justify ?? ''],
        alignItems: alignments[area.align ?? ''],
        alignContent: wrappings[area.wrap ?? ''],
        flexWrap: area.wrap ? 'wrap' : undefined,
      }

    if (area.size) {
      if (direction === 'row') {
        css.width = area.size
      } else {
        css.height = area.size
      }
    } else {
      css.flexGrow = 1
    }

    return css
  },
  toSlotStyle = ({ card: c, slot }: CardSlot, direction?: S): React.CSSProperties => {
    const
      { size1, size2, grow, order } = slot,
      zIndex = c.name === '__unhandled_error__' ? 1 : undefined,
      style: React.CSSProperties = {
        zIndex,
        order,
      }
    if (grow) {
      style.flexGrow = grow
    } else {
      if (size1 && size2) {
        style.width = size1
        style.height = size2
      } else if (size1) {
        if (direction === 'row') {
          style.width = size1
        } else {
          style.height = size1
        }
      } else {
        style.flexGrow = 1
      }
    }
    return style

  },
  toSection = (area: Area): Section => ({
    area,
    sections: area.areas?.map(toSection),
    cardslots: []
  }),
  findSection = (section: Section, name: S): Section | null => {
    const { area, sections } = section
    if (area.name === name) return section
    if (sections) {
      for (const s of sections) {
        const c = findSection(s, name)
        if (c) return c
      }
    }
    return null
  },
  FlexSection = ({ section, direction }: { section: Section, direction?: S }) => {
    const
      { area, cardslots, sections } = section,
      children = sections
        ? sections.map(section => <FlexSection key={section.area.name} direction={area.direction} section={section} />)
        : cardslots.length ?
          cardslots.map(cardslot => {
            const { card: c } = cardslot
            return (
              <div key={c.id} className={css.slot} style={toSlotStyle(cardslot, area.direction)}>
                <CardView card={c} />
                {!!c.state.commands?.length && <CardMenu name={c.name} commands={c.state.commands} changedB={c.changed} />}
              </div>
            )
          })
          : null

    return (
      <div data-test={area.name} className={css.flex} style={toSectionStyle(area, direction)}>
        {children}
      </div>
    )
  },
  FlexLayout = bond(({ name, cards }: { name: S, cards: C[] }) => {
    const
      render = () => {
        const layoutIndex = layoutB()
        if (!layoutIndex) return <></>
        const
          { layout, index } = layoutIndex,
          section = toSection(layout.area),
          { width, min_width, max_width, height, min_height, max_height } = layout
        for (const card of cards) {
          const
            slot = parseBox(index, card.state.box),
            target = findSection(section, slot.area ?? '')
         target?.cardslots.push({ card, slot })
        }
        const style: React.CSSProperties = {
          width: width ?? '100%',
          minWidth: min_width,
          maxWidth: max_width,
          height,
          minHeight: min_height,
          maxHeight: max_height,
        }
        return (
          <div data-test={name} className={css.layout} style={style}>
            <FlexSection section={section} />
          </div>
        )
      }
    return { render, layoutB }
  })
export const
  PageLayout = bond(({ page }: { page: Page }) => {
    let
      metaCard: C | null = null,
      onMetaCardChanged: Disposable | null = null

    const
      { changed } = page,
      render = () => {
        const
          all = page.list(),
          [metas, cards] = segregate(all, c => c.state.view === 'meta')

        if (metas.length) {
          onMetaCardChanged?.dispose()
          metaCard = metas[0]
          preload(metaCard as any)
          onMetaCardChanged = on(metaCard.changed, () => preload(metaCard as any))
        }
        return layoutsB().length
          ? <FlexLayout name={page.key} cards={cards} />
          : <GridLayout name={page.key} cards={cards} />
      }

    return { render, changed }
  })
