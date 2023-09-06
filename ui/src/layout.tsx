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

import { B, box, Card, Dict, F, Model, parseI, Rec, S, U, unpack, xid } from 'h2o-wave'
import { default as React } from 'react'
import { stylesheet } from 'typestyle'
import { CardMenu } from './card_menu'
import { format, isFormatExpr } from './intl'
import { clas, cssVar, important, margin } from './theme'

type Slot = {
  left: U
  top: U
  width?: U
  height?: U
  right?: U
  bottom?: U
}

export enum CardEffect {
  Transparent = 'transparent',
  Normal = 'normal',
  Raised = 'raised',
  Flat = 'flat',
}

export type CardStyle = {
  effect: CardEffect
  overflow?: B
  marginless?: B
  animate?: B
}

const
  defaultCardStyle: CardStyle = { effect: CardEffect.Normal },
  newCardRegistry = () => {
    const
      m: Dict<{ ctor: typeof React.Component, style: CardStyle }> = {},
      register = (name: S, ctor: typeof React.Component, style: CardStyle = defaultCardStyle) => (
        m[name] = { ctor, style }
      ),
      lookup = (name: S) => m[name] || m['']
    return { register, lookup }
  }

export const
  cards = newCardRegistry(),
  substitute = (formatString?: S, data?: Rec, defaultValue: any = null) => {
    return (formatString !== undefined && formatString !== null)
      ? isFormatExpr(formatString)
        ? format(formatString.substring(1), data)
        : formatString
      : (defaultValue !== undefined && defaultValue !== null)
        ? defaultValue
        : null
  },
  Format = ({ data, defaultValue: v, format: f, className, style }: { data?: Rec, defaultValue?: any, format?: S, className?: S, style?: React.CSSProperties }) => {
    const x = substitute(f, data, v)
    if (x == null) return null
    if (className || style) return <div className={className} style={style} >{x}</div>
    return <>{x}</>
  },
  CardView = ({ card }: { card: Model<any> }) => {
    const Tag = cards.lookup(card.state.view).ctor
    return <Tag {...card} />
  },
  Repeat = ({ view, props, data }: { view: S | any, props: any, data: any }) => {
    const items = unpack<Rec[]>(data).map((r, i) => {
      const card: Model<any> = {
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
  badPlacement: Slot = { left: 0, top: 0, width: 0, height: 0 },
  newGrid = (uw: U, uh: U, cols: U, rows: U, gap: U) => {
    let scale = 1
    const
      iw = uw - 2 * gap, // unit inner width
      ih = uh - 2 * gap, // unit inner height
      width = uw * cols + gap * (cols + 1),
      height = uh * rows + gap * (rows + 1),
      giw = width - 2 * gap,
      gih = height - 2 * gap,
      placeOnGrid = (x: U, y: U, w: U, h: U): Slot => {
        const
          slot: Slot = {
            left: x * (uw + gap),
            top: y * (uh + gap),
          }
        if (w > 0) {
          slot.width = w * uw + (w - 1) * gap
        } else {
          slot.right = -(w + 1) * (uw + gap)
        }
        if (h > 0) {
          slot.height = h * uh + (h - 1) * gap
        } else {
          slot.bottom = -(h + 1) * (uh + gap)
        }
        return slot
      },
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

export const grid = newGrid(134, 76, 12, 10, 15) // approx 1800x930

const css = stylesheet({
  grid: {
    position: 'relative',
    boxSizing: 'border-box',
    width: grid.innerWidth,
    margin: margin(grid.gap),
  },
  slot: {
    boxSizing: 'border-box',
    transition: 'box-shadow 0.3s cubic-bezier(.25,.8,.25,1)',
    display: 'flex',
    flexDirection: 'column',
    margin: margin(7), // Approx 15px gutter between cards.
    overflow: 'auto',
    $nest: {
      '>*': {
        boxSizing: 'border-box',
        flexGrow: 1, // Expand vertically
      }
    }
  },
  normal: {
    backgroundColor: cssVar('$card'),
    boxShadow: `0px 3px 5px ${cssVar('$text0')}`,
    $nest: {
      '&:hover': {
        boxShadow: `0px 12px 20px ${cssVar('$text2')}`,
      }
    },
  },
  flat: {
    backgroundColor: cssVar('$card'),
    boxShadow: `0px 3px 5px ${cssVar('$text0')}`,
  },
  raised: {
    margin: 0,
    background: cssVar('$themePrimary'),
    color: cssVar('$card'),
    boxShadow: `0px 3px 7px ${cssVar('$text3')}`,
    $nest: {
      '.ms-Link': {
        color: cssVar('$card'),
      },
      '.ms-Persona': {
        $nest: {
          '&-primaryText': {
            color: cssVar('$card'),
          },
          '&-secondaryText': {
            color: cssVar('$card'),
          },
          '&-tertiaryText': {
            color: cssVar('$card'),
          },
        }
      },
      '.ms-Button': {
        $nest: {
          '&-menuIcon': {
            color: cssVar('$card')
          },
        }
      },
      '.ms-Nav': {
        $nest: {
          '&-chevronButton': {
            color: cssVar('$card')
          },
          '&-link': {
            color: cssVar('$card')
          },
          '&-link .ms-Icon': {
            color: cssVar('$card')
          },
          '.is-selected .ms-Nav-link': {
            background: cssVar('$themeDark')
          },
          '.is-selected .ms-Nav-link:after': {
            borderColor: cssVar('$card')
          },
          '&-compositeLink:hover .ms-Nav-link': {
            background: cssVar('$text1'),
          },
          '&-compositeLink:hover.is-disabled .ms-Nav-link': {
            background: 'transparent',
          },
        }
      },
      '.w-menu': {
        color: important(cssVar('$card')),
        $nest: {
          '& .ms-Button-icon': {
            color: important(cssVar('$card')),
          },
          '&-label': {
            color: cssVar('$card')
          }
        }
      },
      '.w-text': {
        color: cssVar('$card')
      },
      '.w-tabs': {
        $nest: {
          '.ms-Pivot-link': {
            backgroundColor: cssVar('$themePrimary'),
            color: cssVar('$card')
          },
          '.ms-Pivot-link.is-selected': {
            backgroundColor: cssVar('$card'),
            color: cssVar('$text')
          },
        }
      },
      '.w-tabs-link': {
        $nest: {
          '.ms-Pivot-link': {
            color: cssVar('$card')
          },
          '.ms-Pivot-link:hover .ms-Pivot-linkContent': {
            color: cssVar('$text')
          },
          '.ms-Pivot-link.is-selected:before': {
            backgroundColor: cssVar('$card'),
          },
        }
      },
      '.ms-Checkbox': {
        $nest: {
          '&-text': {
            color: important(cssVar('$card')),
          },
          '&-checkbox': {
            borderColor: important(cssVar('$card')),
          },
          '&-checkmark': {
            color: cssVar('$themePrimary'),
          },
          '&-label:hover .ms-Checkbox-checkmark': {
            color: cssVar('$card'),
          },
          '&.is-checked .ms-Checkbox-checkbox': {
            background: important(cssVar('$card')),
          },
          '&.is-checked .ms-Checkbox-label:hover .ms-Checkbox-checkmark': {
            color: cssVar('$themePrimary')
          },
        }
      },
      '.ms-Toggle': {
        $nest: {
          '&-label': {
            color: cssVar('$card')
          },
          '&-stateText': {
            color: cssVar('$card')
          },
          '&-background': {
            borderColor: cssVar('$card'),
            background: cssVar('$themePrimary')
          },
          '&-thumb': {
            background: important(cssVar('$card'))
          },
          '&.is-checked .ms-Toggle-background': {
            background: cssVar('$card')
          },
          '&.is-checked .ms-Toggle-thumb': {
            background: important(cssVar('$text'))
          },
        }
      },
      '.ms-TextField-fieldGroup': {
        $nest: {
          i: {
            color: cssVar('$text')
          }
        }
      },
      '& + div.w-card-menu i': {
        color: cssVar('$card')
      },
      '.ms-Label': {
        color: cssVar('$card')
      },
    }
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  marginless: {
    margin: 0
  }
})

export const
  getCardEffectClass = (c: Card) => {
    const { effect, marginless, animate = true } = getCardStyle(c)
    return clas(css.slot, getEffectClass(effect), marginless ? css.marginless : '', animate ? 'wave-animate-card' : '')
  },
  toCardEffect = (color?: 'card' | 'transparent' | 'primary') => {
    switch (color) {
      case 'card': return CardEffect.Normal
      case 'transparent': return CardEffect.Transparent
      case 'primary': return CardEffect.Raised
      default: return CardEffect.Raised
    }
  },
  getEffectClass = (effect: CardEffect) => css[effect],
  getCardStyle = (c: Card): CardStyle => cards.lookup(c.state.view).style,
  GridLayout = ({ name, cards: cs }: { name: S, cards: Card[] }) => {
    const
      hasEditor = cs.find(c => c.state.view === 'editor') ? true : false,
      children = cs.map(c => {
        const
          placement = grid.place(c.state.box),
          { left, top, right, bottom, width, height } = placement,
          display = placement === badPlacement ? c.state.view === 'editor' ? undefined : 'none' : undefined,
          zIndex = c.name === '__unhandled_error__' ? 1 : 'initial'
        return (
          <div key={c.id} className={getCardEffectClass(c)} style={{ display, position: 'absolute', left, top, right, bottom, width, height, zIndex, margin: 0 }}>
            <CardView card={c} />
            <CardMenu name={c.name} commands={c.state.commands} changedB={c.changed} canEdit={hasEditor} />
          </div>
        )
      })
    return <div data-test={name} className={css.grid}>{children}</div>
  }