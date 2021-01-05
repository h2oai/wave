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
import { CardEffect, CardView, getCardEffect, GridLayout } from './layout'
import { Layout, layoutsB, preload, Zone } from './meta'
import { B, bond, box, C, Dict, Disposable, on, Page, parseU, S, U } from './qd'
import { clas, getTheme, margin, palette } from './theme'


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
  theme = getTheme(),
  css = stylesheet({
    flex: {
      position: 'relative',
      display: 'flex',
    },
    slot: {
      boxSizing: 'border-box',
      transition: 'box-shadow 0.3s cubic-bezier(.25,.8,.25,1)',
      display: 'flex',
      flexDirection: 'column',
      margin: margin(7), // Approx 15px gutter between cards.
      $nest: {
        '>*': {
          boxSizing: 'border-box',
          flexGrow: 1, // Expand vertically
        }
      }
    },
    normal: {
      backgroundColor: theme.colors.card,
      boxShadow: `0px 3px 5px ${theme.colors.text0}`,
      $nest: {
        '&:hover': {
          boxShadow: `0px 12px 20px ${theme.colors.text2}`,
        }
      },
    },
    raised: {
      color: theme.colors.card,
      backgroundColor: palette.themePrimary,
      boxShadow: `0px 3px 7px ${theme.colors.text3}`,
      margin: 0,
    },
    flat: {
      backgroundColor: theme.colors.card,
      boxShadow: `0px 3px 5px ${theme.colors.text0}`,
    },
  }),
  getCardEffectClass = (c: C) => {
    const effect = getCardEffect(c)
    return clas(css.slot, effect === CardEffect.Normal
      ? css.normal
      : effect === CardEffect.Raised
        ? css.raised
        : effect == CardEffect.Flat
          ? css.flat : '')
  },
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
      style: React.CSSProperties = {
        flexDirection: zone.direction === 'row' ? 'row' : 'column',
        justifyContent: justifications[zone.justify ?? ''],
        alignItems: alignments[zone.align ?? ''],
        alignContent: wrappings[zone.wrap ?? ''],
        flexWrap: zone.wrap ? 'wrap' : undefined,
      }

    if (zone.size) {
      const grow = parseU(zone.size) // attempt strict-parse to uint
      if (!isNaN(grow)) {// no units; treat as ratio
        if (grow > 0) style.flexGrow = grow
      } else { // has units; treat as size
        if (direction === 'row') {
          style.width = zone.size
        } else {
          style.height = zone.size
          style.minHeight = zone.size // Needed for Safari.
        }
      }
    } else { // so size; occupy 1 part
      style.flexGrow = 1
    }

    return style
  },
  toSlotStyle = ({ card: c, slot }: CardSlot): React.CSSProperties => {
    const
      { width, height, grow } = slot,
      zIndex = c.name === '__unhandled_error__' ? 1 : undefined,
      style: React.CSSProperties = { position: 'relative', zIndex }

    if (grow || grow === 0 || width || height) {
      if (grow) style.flexGrow = grow // grow only if non-zero (else default to shrink)
      if (width) style.width = width
      if (height) style.height = height
    } else { // no size specified; occupy 1 part
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
      <div data-test={zone.name} className={css.flex} style={toSectionStyle(zone, direction)}>
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
    if (height === '100%') {
      style.display = 'flex'
      style.flexDirection = 'column'
    }
    return (
      <div data-test={name} style={style}>
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
