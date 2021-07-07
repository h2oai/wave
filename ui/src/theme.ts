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
import { box, Dict, F, I, on, S, U } from 'h2o-wave'

interface Palette {
  text: S
  card: S
  page: S
}

interface Theme {
  palette: Palette
  fluentPalette: Partial<Fluent.IPalette>
}

export const
  px = (x: I) => `${x}px`,
  pc = (x: F) => `${x}%`,
  rem = (x: F) => `${x}rem`,
  clas = (...names: S[]) => names.join(' '),
  border = (thickness: U, color: S) => `${thickness}px solid ${color}`,
  dashed = (thickness: U, color: S) => `${thickness}px dashed ${color}`,
  padding = (...t: I[]) => t.map(px).join(' '),
  margin = padding,
  centerMixin = () => ({ display: 'flex', alignItems: 'center', justifyContent: 'center' }),
  // if color starts with $, treat  it like a css var, otherwise treat it like a regular color.
  // TODO this is ugly - why does the argument need a '$' prefix?
  cssVar = (color = '$gray') => color.startsWith('$') ? `var(--${color.substr(1)}, var(--gray))` : color,
  cssVarValue = (prop: S) => {
    if (!prop.startsWith('$')) return prop
    prop = prop.substring(1)
    return getComputedStyle(document.documentElement).getPropertyValue(`--${prop}`).trim()
  },
  spectrum: Dict<S> = {
    amber: '#ffc107',
    azure: '#03a9f4',
    black: '#000',
    blue: '#2196f3',
    brown: '#795548',
    cyan: '#00bcd4',
    gray: '#9e9e9e',
    green: '#8bc34a',
    indigo: '#3f51b5',
    lime: '#cddc39',
    mint: '#4caf50',
    orange: '#ff9800',
    pink: '#e91e63',
    purple: '#9c27b0',
    red: '#f44336',
    tangerine: '#ff5722',
    teal: '#009688',
    violet: '#673ab7',
    white: '#fff',
    yellow: '#ffeb3b',
  },
  // Src: https://gomakethings.com/dynamically-changing-the-text-color-based-on-background-color-contrast-with-vanilla-js/
  getContrast = (color: S) => {
    if (color.startsWith('$')) color = cssVarValue(color)
    if (color.startsWith('#')) color = color.slice(1)
    if (color.length === 3) color = color.split('').map(hex => `${hex}${hex}`).join('')

    const
      r = parseInt(color.substr(0, 2), 16),
      g = parseInt(color.substr(2, 2), 16),
      b = parseInt(color.substr(4, 2), 16),
      yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000

    return yiq >= 128 ? 'black' : 'white'
  }

const
  themes: Dict<Theme> = {
    default: {
      palette: {
        text: '#323130',
        card: '#ffffff',
        page: '#f5f5f5',
      },
      fluentPalette: {
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
    },
    dark: {
      palette: {
        text: '#ffffff',
        card: '#21252b',
        page: '#282c34',
      },
      fluentPalette: {
        // TODO: Generate dark fluent color palette.
      },
    },
    neon: {
      palette: {
        text: '#ffffff',
        card: '#0d0e0f',
        page: '#1b1d1f',
      },
      fluentPalette: {
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
    },
  },
  rgb = (hex: S): [U, U, U] => {
    const x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return x ? [parseInt(x[1], 16), parseInt(x[2], 16), parseInt(x[3], 16)] : [0, 0, 0]
  }

export const
  defaultThemeName = 'default',
  themeB = box(defaultThemeName),
  defaultTheme = themes[defaultThemeName]


on(themeB, themeName => {
  const
    theme = themes[themeName] ?? themes[defaultThemeName],
    { palette, fluentPalette } = theme

  // TODO: Resolve the any.
  // TODO: This is polluting the global namespace.
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
  Fluent.loadTheme({ palette: fluentPalette })
})

