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

import { default as React } from 'react'
import { stylesheet } from 'typestyle'
import { CardMenu } from './card_menu'
import { CardView, GridLayout, getCardEffectClass } from './layout'
import { Layout, layoutsB, preload, Zone } from './meta'
import { B, bond, box, C, Dict, Disposable, on, Page, parseU, S, U } from './qd'
import { clas } from './theme'


type Breakpoint = {
  layout: Layout
  min: U
  max: U
  listener(e: MediaQueryListEvent): void
  mq: MediaQueryList
}

type Slot = {
  order: U
  zone?: S
  grow?: U
  width?: S
  height?: S
}

type CardSlot = {
  card: C
  slot: Slot
}

type Section = {
  zone: Zone
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
  resizedB = box(), // breakpoint changed?
  parseBreakpoint = (spec: S): U => parseInt(presetBreakpoints[spec] ?? spec, 10),
  badSlot: Slot = { order: 0 },
  parseBox = ({ zone, order, size, width, height }: any): Slot => {
    return { zone, order: order ? order : 0, grow: parseU(size), width, height }
  },
  parseBoxes = (index: U, spec: S): Slot => {
    try {
      if (spec[0] === '[') {
        const specs: any[] = JSON.parse(spec)
        spec = specs[index]
        if (!spec) spec = specs[0]
        if (!spec) return badSlot
      }
      return spec[0] === '{' ? parseBox(JSON.parse(spec)) : { zone: spec, order: 0 }
    } catch {
      return badSlot
    }
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
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
        listener = (mq: MediaQueryListEvent) => {
          if (mq.matches) {
            layoutB({ layout, index })
            resizedB({})
          }
        },
        bp: Breakpoint = { layout, min, max, mq, listener }

      mq.addListener(listener)
      if (mq.matches) layoutB({ layout, index })

      return bp
    })

  for (const { mq, listener } of breakpointsB()) mq.removeListener(listener)
  breakpointsB(bps)
})

const
  css = stylesheet({
    layout: {
      display: 'flex',
    },
    flex: {
      position: 'relative',
      display: 'flex',
    },
    column: {
      $nest: {
        '>*': { marginBottom: 15 },
        '>*:last-child': { marginBottom: 0 }
      }
    },
    row: {
      $nest: {
        '>*': { marginRight: 15 },
        '>*:last-child': { marginRight: 0 }
      }
    },
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
  toSectionStyle = (zone: Zone, direction?: S): React.CSSProperties => {
    const
      css: React.CSSProperties = {
        flexDirection: zone.direction === 'row' ? 'row' : 'column',
        justifyContent: justifications[zone.justify ?? ''],
        alignItems: alignments[zone.align ?? ''],
        alignContent: wrappings[zone.wrap ?? ''],
        flexWrap: zone.wrap ? 'wrap' : undefined,
      }

    if (zone.size) {
      if (direction === 'row') {
        css.width = zone.size
      } else {
        css.height = zone.size
        css.minHeight = zone.size // Needed for Safari.
      }
    } else {
      css.flexGrow = 1
    }

    return css
  },
  toSlotStyle = ({ card: c, slot }: CardSlot): React.CSSProperties => {
    const
      { width, height, grow } = slot,
      zIndex = c.name === '__unhandled_error__' ? 1 : undefined,
      style: React.CSSProperties = { position: 'relative', zIndex }
    if (grow) {
      style.flexGrow = grow
    } else if (width || height) {
      if (width) style.width = width
      if (height) style.height = height
    } else {
      style.flexGrow = 1
    }
    return style
  },
  toSection = (zone: Zone): Section => ({
    zone,
    sections: zone.zones?.map(toSection),
    cardslots: []
  }),
  findSection = (section: Section, name: S): Section | null => {
    const { zone, sections } = section
    if (zone.name === name) return section
    if (sections) {
      for (const s of sections) {
        const c = findSection(s, name)
        if (c) return c
      }
    }
    return null
  },
  sortCardsInSection = (section: Section) => {
    const { sections } = section
    if (sections) {
      for (const s of sections) {
        sortCardsInSection(s)
      }
    }
    section.cardslots.sort((a, b) => a.slot.order - b.slot.order)
  },
  FlexSection = ({ section, direction }: { section: Section, direction?: S }) => {
    const
      { zone, cardslots, sections } = section,
      children = sections
        ? sections.map(section => <FlexSection key={section.zone.name} direction={zone.direction} section={section} />)
        : cardslots.length ?
          cardslots.map(cardslot => {
            const { card: c } = cardslot
            return (
              <div key={c.id} className={getCardEffectClass(c)} style={toSlotStyle(cardslot)}>
                <CardView card={c} />
                {!!c.state.commands?.length && <CardMenu name={c.name} commands={c.state.commands} changedB={c.changed} />}
              </div>
            )
          })
          : null

    return (
      <div data-test={zone.name} className={clas(css.flex, zone.direction === 'row' ? css.row : css.column)} style={toSectionStyle(zone, direction)}>
        {children}
      </div>
    )
  },
  FlexLayout = ({ name, cards }: { name: S, cards: C[] }) => {
    const layoutIndex = layoutB()
    if (!layoutIndex) return <></>
    const
      { layout, index } = layoutIndex,
      section = toSection({ name: 'main', zones: layout.zones }),
      { width, min_width, max_width, height, min_height, max_height } = layout
    for (const card of cards) {
      const
        slot = parseBoxes(index, card.state.box),
        target = findSection(section, slot.zone ?? '')
      target?.cardslots.push({ card, slot })
    }

    sortCardsInSection(section)

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
          preload(metaCard as any) // causes layoutB to be set, if available.
          onMetaCardChanged = on(metaCard.changed, () => preload(metaCard as any))
        }
        return layoutsB().length
          ? <FlexLayout name={page.key} cards={cards} />
          : <GridLayout name={page.key} cards={cards} />
      }

    return { render, changed, resizedB }
  })
