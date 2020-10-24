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

import { NestedCSSProperties } from "typestyle/lib/types"
import { Dict, I, F, S, U } from "./qd"
import * as Fluent from "@fluentui/react"

interface Palette {
  red: S
  pink: S
  purple: S
  violet: S
  indigo: S
  blue: S
  azure: S
  cyan: S
  teal: S
  mint: S
  green: S
  lime: S
  yellow: S
  amber: S
  orange: S
  tangerine: S
  brown: S
  gray: S
  text: S
  card: S
  page: S
}

interface Tones {
  text0: S
  text1: S
  text2: S
  text3: S
  text4: S
  text5: S
  text6: S
  text7: S
  text8: S
  text9: S
}

export const
  px = (x: I) => `${x}px`,
  pc = (x: F) => `${x}%`,
  rem = (x: F) => `${x}rem`,
  cssVar = (x: keyof (Palette & Tones & Fluent.IPalette), fallback = '--gray') => `var(--${x}, ${fallback})`,
  clas = (...names: string[]) => names.join(' '),
  quint = (prop: string) => `${prop} 600ms cubic-bezier(0.23, 1, 0.32, 1)`, // https://easings.net/#easeOutQuint
  border = (thickness: U, color: string) => `${thickness}px solid ${color}`,
  dotted = (thickness: U, color: string) => `${thickness}px dotted ${color}`,
  dashed = (thickness: U, color: string) => `${thickness}px dashed ${color}`,
  hairline = border(1, '#ececec'),
  padding = (...t: I[]) => t.map(px).join(' '),
  paddingRem = (...t: F[]) => t.map(rem).join(' '),
  margin = padding,
  rgba = (r: U, g: U, b: U, a: F) => `rgba(${r},${g},${b},${a.toFixed(1)})`,
  gray = (b: U) => { const h = b.toString(16); return `#${h}${h}${h}` },
  centerMixin = () => ({ display: 'flex', alignItems: 'center', justifyContent: 'center' }),
  displayMixin = (visible = true): React.CSSProperties => {
    if (visible) return {}
    return { display: 'none' }
  }

const
  palettes: Dict<{}> = {
    light: {
      text: '#323130',
      card: '#ffffff',
      page: '#f5f5f5',
    },
    dark: {
      text: '#ffffff',
      card: '#21252b',
      page: '#282c34',
    },
    neon: {
      text: '#ffffff',
      card: '#0d0e0f',
      page: '#1b1d1f',
    },
  },
  // tracking = a + b * Math.exp(c * fontSize)
  // a = -0.0223, b = 0.185, c = -0.1745
  fontTrackings = [
    [6, 0.043],
    [7, 0.032],
    [8, 0.024],
    [9, 0.016],
    [10, 0.01],
    [11, 0.005],
    [12, 0],
    [13, -0.0025],
    [14, -0.006],
    [15, -0.009],
    [16, -0.011],
    [17, -0.013],
    [18, -0.014],
    [20, -0.017],
    [24, -0.019],
    [30, -0.021],
    [40, -0.022],
    [80, -0.022],
  ],
  fontStyleFor = (size: U, tracking: F) => ({
    fontSize: size + 'px',
    letterSpacing: tracking + 'em',
    lineHeight: Math.round(1.4 * size) + 'px',
  }),
  fontStyles: ReturnType<typeof fontStyleFor>[] = []

fontTrackings.forEach(([size, tracking]) => fontStyles[size] = fontStyleFor(size, tracking))


const
  font: ThemeFont = {
    s6: fontStyles[6],
    s7: fontStyles[7],
    s8: fontStyles[8],
    s9: fontStyles[9],
    s10: fontStyles[10],
    s11: fontStyles[11],
    s12: fontStyles[12],
    s13: fontStyles[13],
    s14: fontStyles[14],
    s15: fontStyles[15],
    s16: fontStyles[16],
    s17: fontStyles[17],
    s18: fontStyles[18],
    s20: fontStyles[20],
    s24: fontStyles[24],
    s30: fontStyles[30],
    s40: fontStyles[40],
    s80: fontStyles[80],
    w1: { fontWeight: 100 }, // thin
    w2: { fontWeight: 200 }, // extralight
    w3: { fontWeight: 300 }, // light
    w4: { fontWeight: 400 }, // regular
    w5: { fontWeight: 500 }, // medium
    w6: { fontWeight: 600 }, // semibold
    w7: { fontWeight: 700 }, // bold
    w8: { fontWeight: 800 }, // extrabold
    w9: { fontWeight: 900 }, // black
  }

interface ThemeFont {
  s6: NestedCSSProperties
  s7: NestedCSSProperties
  s8: NestedCSSProperties
  s9: NestedCSSProperties
  s10: NestedCSSProperties
  s11: NestedCSSProperties
  s12: NestedCSSProperties
  s13: NestedCSSProperties
  s14: NestedCSSProperties
  s15: NestedCSSProperties
  s16: NestedCSSProperties
  s17: NestedCSSProperties
  s18: NestedCSSProperties
  s20: NestedCSSProperties
  s24: NestedCSSProperties
  s30: NestedCSSProperties
  s40: NestedCSSProperties
  s80: NestedCSSProperties
  /** Thin */
  w1: NestedCSSProperties
  /** Extra light */
  w2: NestedCSSProperties
  /** Light */
  w3: NestedCSSProperties
  /** Regular */
  w4: NestedCSSProperties
  /** Medium */
  w5: NestedCSSProperties
  /** Semi bold */
  w6: NestedCSSProperties
  /** Bold */
  w7: NestedCSSProperties
  /** Extra bold */
  w8: NestedCSSProperties
  /** Black */
  w9: NestedCSSProperties
}

export interface Theme {
  font: ThemeFont
  merge<T>(defs: Partial<T>, state: Partial<T>): T
}

let theme: Theme | null = null
export const
  loadTheme = (): Theme => {
    const merge = <T extends unknown>(defs: Partial<T>, state: Partial<T>): T => {
      const s = { ...defs, ...state } as any
      for (const k in s) {
        if (k.endsWith('_color')) {// XXX obsolete; remove
          // const v = s[k]
          // if (typeof v === 'string') s[k] = color(v)
        }
      }
      return s as T
    }
    theme = { font, merge }
    return theme
  },
  changeTheme = (name: S) => {
    const palette = palettes[name]
    // TODO: Resolve the any.
    Object.keys(palette).forEach(k => document.body.style.setProperty(`--${k}`, (palette as any)[k]))
  },
  getTheme = (): Theme => theme || loadTheme(),
  palette = {
    themePrimary: '#000000',
    themeLighterAlt: '#898989',
    themeLighter: '#737373',
    themeLight: '#595959',
    themeTertiary: '#373737',
    themeSecondary: '#2f2f2f',
    themeDarkAlt: '#252525',
    themeDark: '#151515',
    themeDarker: '#0b0b0b',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  },
  defaultFontStyle = {
    fontFamily: 'Inter',
  }
