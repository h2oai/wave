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

import * as Fluent from "@fluentui/react"
import { F, I, S, U, qd } from "./qd"

interface Palette {
  text: S
  card: S
  page: S
}

type Theme = 'light' | 'dark' | 'neon'

export const
  px = (x: I) => `${x}px`,
  pc = (x: F) => `${x}%`,
  rem = (x: F) => `${x}rem`,
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
  },
  // if color starts with $, treat  it like a css var, otherwise treat it like a regular color.
  cssVar = (color = '$gray') => color.startsWith('$') ? `var(--${color.substr(1)}, var(--gray))` : color

const
  palettes: { [K in Theme]: Palette } = {
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
  fluentPalettes: { [K in Theme]: Partial<Fluent.IPalette> } = {
    light: {
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
    neon: {
      themePrimary: '#cddc39',
      themeLighterAlt: '#080902',
      themeLighter: '#202309',
      themeLight: '#3d4211',
      themeTertiary: '#7a8422',
      themeSecondary: '#b3c132',
      themeDarkAlt: '#d0df4a',
      themeDark: '#d7e464',
      themeDarker: '#e1eb8a',
      neutralLighterAlt: '#1a1c1e',
      neutralLighter: '#191b1d',
      neutralLight: '#181a1c',
      neutralQuaternaryAlt: '#17181a',
      neutralQuaternary: '#161719',
      neutralTertiaryAlt: '#151618',
      neutralTertiary: '#c8c8c8',
      neutralSecondary: '#d0d0d0',
      neutralPrimaryAlt: '#dadada',
      neutralPrimary: '#ffffff',
      neutralDark: '#f4f4f4',
      black: '#f8f8f8',
      white: '#1b1d1f',
    },
    dark: {
      // TODO: Generate dark fluent color palette.
    }
  },
  rgb = (hex: S): [U, U, U] => {
    const x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return x ? [parseInt(x[1], 16), parseInt(x[2], 16), parseInt(x[3], 16)] : [0, 0, 0]
  }

export const
  changeTheme = (name: Theme) => {
    const palette = palettes[name]
    const fluentPalette = fluentPalettes[name]
    // TODO: Resolve the any.
    Object.keys(palette).forEach(k => document.body.style.setProperty(`--${k}`, (palette as any)[k]))
    Object.keys(fluentPalette).forEach(k => document.body.style.setProperty(`--${k}`, (fluentPalette as any)[k]))

    // Update text tones.
    if (palette.text) {
      const [r, g, b] = rgb(palette.text)
      let alpha = 0.05
      for (let i = 0; i < 10; i++) {
        document.body.style.setProperty(`--text${i}`, `rgba(${r},${g},${b},${alpha})`)
        alpha += i === 0 ? 0.05 : 0.1
      }
    }

    // Change global Fluent theme.
    Fluent.loadTheme({ palette: fluentPalettes[name] })
    qd.theme(name)
  }