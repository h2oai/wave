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

import * as Fluent from '@fluentui/react'
import { box, Dict, F, I, on, S, U } from './core'
import { Theme } from './meta'

interface Palette {
  text: S
  card: S
  page: S
}

interface PredefinedTheme {
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
  important = (val: S) => `${val} !important`,
  padding = (...t: I[]) => t.map(px).join(' '),
  margin = padding,
  centerMixin = () => ({ display: 'flex', alignItems: 'center', justifyContent: 'center' }),
  // if color starts with $, treat  it like a css var, otherwise treat it like a regular color.
  // TODO this is ugly - why does the argument need a '$' prefix?
  cssVar = (color = '$gray') => color.startsWith('$') ? `var(--wave-${color.substring(1)}, var(--wave-gray))` : color,
  cssVarValue = (prop: S) => {
    if (!prop.startsWith('$')) return prop
    prop = prop.substring(1)
    return getComputedStyle(document.body).getPropertyValue(`--wave-${prop}`).trim()
  },
  // The width is applied to both form item container and component root which is a problem for percentages.
  // E.g. 50% width on both form container and component results in 25% of total form width instead of 50% (component takes 50% of 50% of the form = 25% total).
  formItemWidth = (width?: S) => width?.includes('%') ? '100%' : width,
  cardPadding = 24,
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
  getContrast = (color: S) => {
    const colorFromString = Fluent.getColorFromString(color.startsWith('$') ? cssVarValue(color) : color)
    if (!colorFromString) return 'black'

    const { r, g, b } = colorFromString
    // Src: https://gomakethings.com/dynamically-changing-the-text-color-based-on-background-color-contrast-with-vanilla-js/
    return ((r * 299) + (g * 587) + (b * 114)) / 1000 >= 128 ? 'black' : 'white'
  }

const
  themes: Dict<PredefinedTheme> = {
    default: {
      palette: {
        card: '#ffffff',
        page: '#f5f5f5',
        text: '#323130',
      },
      fluentPalette: {
        black: '#000000',
        neutralDark: '#201f1e',
        neutralLight: '#edebe9',
        neutralLighter: '#f3f2f1',
        neutralLighterAlt: '#faf9f8',
        neutralPrimary: '#323130',
        neutralPrimaryAlt: '#3b3a39',
        neutralQuaternary: '#d0d0d0',
        neutralQuaternaryAlt: '#e1dfdd',
        neutralSecondary: '#605e5c',
        neutralTertiary: '#a19f9d',
        neutralTertiaryAlt: '#c8c6c4',
        themeDark: '#151515',
        themeDarkAlt: '#252525',
        themeDarker: '#0b0b0b',
        themeLight: '#595959',
        themeLighter: '#737373',
        themeLighterAlt: '#898989',
        themePrimary: '#000000',
        themeSecondary: '#2f2f2f',
        themeTertiary: '#373737',
        white: '#ffffff',
      },
    },
    neon: {
      palette: {
        card: '#0d0e0f',
        page: '#1b1d1f',
        text: '#ffffff',
      },
      fluentPalette: {
        black: '#f8f8f8',
        neutralDark: '#f4f4f4',
        neutralLight: '#2c2f32',
        neutralLighter: '#1f2123',
        neutralLighterAlt: '#16181a',
        neutralPrimary: '#fff',
        neutralPrimaryAlt: '#dadada',
        neutralQuaternary: '#3c4043',
        neutralQuaternaryAlt: '#35383b',
        neutralSecondary: '#d0d0d0',
        neutralTertiary: '#c8c8c8',
        neutralTertiaryAlt: '#5b5f63',
        themeDark: '#d7e464',
        themeDarkAlt: '#d0df4a',
        themeDarker: '#e1eb8a',
        themeLight: '#3d4211',
        themeLighter: '#202309',
        themeLighterAlt: '#080902',
        themePrimary: '#cddc39',
        themeSecondary: '#b3c132',
        themeTertiary: '#7a8422',
        white: '#0d0e0f',
      },
    },
    'h2o-dark': {
      palette: {
        card: '#121212',
        page: '#080808',
        text: '#ffffff',
      },
      fluentPalette: {
        black: '#f8f8f8',
        neutralDark: '#f4f4f4',
        neutralLight: '#343434',
        neutralLighter: '#252525',
        neutralLighterAlt: '#1c1c1c',
        neutralPrimary: '#ffffff',
        neutralPrimaryAlt: '#dadada',
        neutralQuaternary: '#454545',
        neutralQuaternaryAlt: '#3d3d3d',
        neutralSecondary: '#d0d0d0',
        neutralTertiary: '#c8c8c8',
        neutralTertiaryAlt: '#656565',
        themeDark: '#c2991d',
        themeDarkAlt: '#e6b522',
        themeDarker: '#8f7015',
        themeLight: '#ffefbe',
        themeLighter: '#fff6dc',
        themeLighterAlt: '#fffdf6',
        themePrimary: '#fec925',
        themeSecondary: '#ffcf40',
        themeTertiary: '#ffde7d',
        white: '#121212',
      },
    },
    // Credit: https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme
    'one-dark-pro': {
      palette: {
        card: '#282C34',
        page: '#0E0C21',
        text: '#cacccf',
      },
      fluentPalette: {
        black: '#f9f9f9',
        neutralDark: '#f3f3f4',
        neutralLight: '#414651',
        neutralLighter: '#353a44',
        neutralLighterAlt: '#2f333c',
        neutralPrimary: '#cacccf',
        neutralPrimaryAlt: '#e7e8e9',
        neutralQuaternary: '#4e545f',
        neutralQuaternaryAlt: '#484d59',
        neutralSecondary: '#e1e2e4',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#dcdddf',
        neutralTertiaryAlt: '#686e7a',
        themeDark: '#d899ec',
        themeDarkAlt: '#d288e8',
        themeDarker: '#e2b3f1',
        themeLight: '#3d2545',
        themeLighter: '#211425',
        themeLighterAlt: '#080509',
        themePrimary: '#CD7BE5',
        themeSecondary: '#b46dca',
        themeTertiary: '#7b4a8a',
        white: '#282C34',
      },
    },
    // Credit: https://monokai.pro/
    monokai: {
      palette: {
        card: '#2B2A2D',
        page: '#232022',
        text: '#cdcccf',
      },
      fluentPalette: {
        black: '#f9f9f9',
        neutralDark: '#f3f3f4',
        neutralLight: '#49484c',
        neutralLighter: '#3c3b3f',
        neutralLighterAlt: '#343337',
        neutralPrimary: '#cdcccf',
        neutralPrimaryAlt: '#e8e8e9',
        neutralQuaternary: '#58565b',
        neutralQuaternaryAlt: '#515054',
        neutralSecondary: '#e3e3e4',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#dedddf',
        neutralTertiaryAlt: '#737177',
        themeDark: '#f787a5',
        themeDarkAlt: '#f67194',
        themeDarker: '#f9a6bc',
        themeLight: '#491d29',
        themeLighter: '#271016',
        themeLighterAlt: '#0a0405',
        themePrimary: '#F56188',
        themeSecondary: '#d75679',
        themeTertiary: '#933b52',
        white: '#2B2A2D',
      },
    },
    // Credit: https://www.nordtheme.com/
    nord: {
      palette: {
        card: '#2E3441',
        page: '#3B4251',
        text: '#C8D1E3',
      },
      fluentPalette: {
        black: '#f8f9fc',
        neutralDark: '#f2f4f9',
        neutralLight: '#454c5b',
        neutralLighter: '#3a414f',
        neutralLighterAlt: '#343a48',
        neutralPrimary: '#C8D1E3',
        neutralPrimaryAlt: '#e5eaf2',
        neutralQuaternary: '#515969',
        neutralQuaternaryAlt: '#4c5363',
        neutralSecondary: '#dfe5ef',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#d9e0ec',
        neutralTertiaryAlt: '#6a7282',
        themeDark: '#a2cfdc',
        themeDarkAlt: '#92c7d6',
        themeDarker: '#b8dce5',
        themeLight: '#293a3f',
        themeLighter: '#161f21',
        themeLighterAlt: '#050808',
        themePrimary: '#87C0D0',
        themeSecondary: '#78aab8',
        themeTertiary: '#52747d',
        white: '#2E3441',
      }
    },
    // Credit: https://marketplace.visualstudio.com/items?itemName=johnpapa.winteriscoming
    'winter-is-coming': {
      palette: {
        card: '#0A2D44',
        page: '#031629',
        text: '#D4DEEC',
      },
      fluentPalette: {
        black: '#fafbfd',
        neutralDark: '#f5f8fb',
        neutralLight: '#1a4460',
        neutralLighter: '#123a54',
        neutralLighterAlt: '#0e344d',
        neutralPrimary: '#D4DEEC',
        neutralPrimaryAlt: '#ecf0f7',
        neutralQuaternary: '#24506d',
        neutralQuaternaryAlt: '#204a67',
        neutralSecondary: '#e7edf5',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#e3eaf3',
        neutralTertiaryAlt: '#3c6886',
        themeDark: '#63b5e2',
        themeDarkAlt: '#4aa9dd',
        themeDarker: '#89c8ea',
        themeLight: '#113041',
        themeLighter: '#091a23',
        themeLighterAlt: '#020609',
        themePrimary: '#38A0DA',
        themeSecondary: '#328dbf',
        themeTertiary: '#226082',
        white: '#0A2D44',
      },
    },
    // Credit: https://github.com/thvardhan/Gradianto
    fuchasia: {
      palette: {
        card: '#381E42',
        page: '#2C1834',
        text: '#C7CCD0',
      },
      fluentPalette: {
        black: '#f8f9f9',
        neutralDark: '#f2f3f4',
        neutralLight: '#51325e',
        neutralLighter: '#462852',
        neutralLighterAlt: '#3f234a',
        neutralPrimary: '#C7CCD0',
        neutralPrimaryAlt: '#e6e8ea',
        neutralQuaternary: '#5e3d6b',
        neutralQuaternaryAlt: '#583865',
        neutralSecondary: '#e0e3e5',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#dadee0',
        neutralTertiaryAlt: '#775584',
        themeDark: '#e692e0',
        themeDarkAlt: '#e180db',
        themeDarker: '#ecade8',
        themeLight: '#432340',
        themeLighter: '#231222',
        themeLighterAlt: '#090509',
        themePrimary: '#DE73D7',
        themeSecondary: '#c366bd',
        themeTertiary: '#854581',
        white: '#381E42',
      },
    },
    // Credit: https://github.com/thvardhan/Gradianto
    nature: {
      palette: {
        card: '#13413F',
        page: '#0C2521',
        text: '#CBCECE',
      },
      fluentPalette: {
        black: '#f9f9f9',
        neutralDark: '#f3f4f4',
        neutralLight: '#245b59',
        neutralLighter: '#1c4f4d',
        neutralLighterAlt: '#174846',
        neutralPrimary: '#CBCECE',
        neutralPrimaryAlt: '#e8e9e9',
        neutralQuaternary: '#2f6966',
        neutralQuaternaryAlt: '#2a6360',
        neutralSecondary: '#e3e4e4',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#dddfdf',
        neutralTertiaryAlt: '#46827f',
        themeDark: '#56cd95',
        themeDarkAlt: '#3ec385',
        themeDarker: '#7ddaaf',
        themeLight: '#0e3925',
        themeLighter: '#071e13',
        themeLighterAlt: '#020805',
        themePrimary: '#2dbd7a',
        themeSecondary: '#28a66b',
        themeTertiary: '#1b7149',
        white: '#13413F',
      },
    },
    // Credit: https://ethanschoonover.com/solarized/
    solarized: {
      palette: {
        card: '#FDF6E3',
        page: '#EEE7D5',
        text: '#002b36',
      },
      fluentPalette: {
        black: '#083e4c',
        neutralDark: '#165362',
        neutralLight: '#e8e2d1',
        neutralLighter: '#f2ebd9',
        neutralLighterAlt: '#f6efdd',
        neutralPrimary: '#002b36',
        neutralPrimaryAlt: '#3f7e8e',
        neutralQuaternary: '#cec9b9',
        neutralQuaternaryAlt: '#d8d2c2',
        neutralSecondary: '#5a96a4',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#7baebb',
        neutralTertiaryAlt: '#c6c1b2',
        themeDark: '#1d4d74',
        themeDarkAlt: '#225b8a',
        themeDarker: '#153956',
        themeLight: '#aecae0',
        themeLighter: '#d2e2ef',
        themeLighterAlt: '#f3f8fb',
        themePrimary: '#266599',
        themeSecondary: '#3874a5',
        themeTertiary: '#6b9bc2',
        white: '#FDF6E3',
      },
    },
    // Credit: https://material-theme.com/
    oceanic: {
      palette: {
        card: '#263238',
        page: '#1E272C',
        text: '#ced5d9',
      },
      fluentPalette: {
        black: '#d0dade',
        neutralDark: '#c1cdd2',
        neutralLight: '#3e4d55',
        neutralLighter: '#334148',
        neutralLighterAlt: '#2d3a41',
        neutralPrimary: '#B0BEC5',
        neutralPrimaryAlt: '#9aa6ad',
        neutralQuaternary: '#4a5b63',
        neutralQuaternaryAlt: '#44555d',
        neutralSecondary: '#697176',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#34393b',
        neutralTertiaryAlt: '#63757e',
        themeDark: '#52bfb1',
        themeDarkAlt: '#3ab3a3',
        themeDarker: '#79d0c4',
        themeLight: '#0d332e',
        themeLighter: '#071b19',
        themeLighterAlt: '#020706',
        themePrimary: '#2bab9a',
        themeSecondary: '#269687',
        themeTertiary: '#1a675c',
        white: '#263238',
      },
    },
    // Credit: https://emberjs.com/
    ember: {
      palette: {
        card: '#F4F6F8',
        page: '#EBEEF2',
        text: '#1C1E24',
      },
      fluentPalette: {
        black: '#30333c',
        neutralDark: '#464954',
        neutralLight: '#dfe1e3',
        neutralLighter: '#e8eaed',
        neutralLighterAlt: '#eceef1',
        neutralPrimary: '#1C1E24',
        neutralPrimaryAlt: '#747884',
        neutralQuaternary: '#c6c8ca',
        neutralQuaternaryAlt: '#cfd1d3',
        neutralSecondary: '#8d919c',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#a7aab4',
        neutralTertiaryAlt: '#bec0c2',
        themeDark: '#972318',
        themeDarkAlt: '#b3291d',
        themeDarker: '#6f1a12',
        themeLight: '#eeb7b2',
        themeLighter: '#f6d8d5',
        themeLighterAlt: '#fdf5f4',
        themePrimary: '#c72e20',
        themeSecondary: '#ce4236',
        themeTertiary: '#dd776e',
        white: '#F4F6F8',
      },
    },
    // Credit: https://slackthemes.net/#/lightning
    lighting: {
      palette: {
        card: '#F4F6F9',
        page: '#FFFFFF',
        text: '#4f5959',
      },
      fluentPalette: {
        black: '#2c3232',
        neutralDark: '#3c4444',
        neutralLight: '#e1e3e5',
        neutralLighter: '#eaecef',
        neutralLighterAlt: '#eef0f3',
        neutralPrimary: '#4f5959',
        neutralPrimaryAlt: '#636d6d',
        neutralQuaternary: '#c8c9cc',
        neutralQuaternaryAlt: '#d1d3d6',
        neutralSecondary: '#919c9c',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#c7cdcd',
        neutralTertiaryAlt: '#c0c2c4',
        themeDark: '#1f5495',
        themeDarkAlt: '#2564b1',
        themeDarker: '#173e6e',
        themeLight: '#b5ceed',
        themeLighter: '#d7e5f6',
        themeLighterAlt: '#f5f8fd',
        themePrimary: '#296fc4',
        themeSecondary: '#3e7ecb',
        themeTertiary: '#74a3dc',
        white: '#F4F6F9',
      },
    },
    // Credit: https://rainglow.io/
    kiwi: {
      palette: {
        text: '#000000',
        card: '#ffffff',
        page: '#f4fae8',
      },
      fluentPalette: {
        black: '#0b0b0b',
        neutralDark: '#151515',
        neutralLight: '#eaeaea',
        neutralLighter: '#f4f4f4',
        neutralLighterAlt: '#f8f8f8',
        neutralPrimary: '#000000',
        neutralPrimaryAlt: '#2f2f2f',
        neutralQuaternary: '#d0d0d0',
        neutralQuaternaryAlt: '#dadada',
        neutralSecondary: '#373737',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#595959',
        neutralTertiaryAlt: '#c8c8c8',
        themeDark: '#435918',
        themeDarkAlt: '#506a1d',
        themeDarker: '#324212',
        themeLight: '#c6d6a7',
        themeLighter: '#e0e9ce',
        themeLighterAlt: '#f7f9f2',
        themePrimary: '#597520',
        themeSecondary: '#698630',
        themeTertiary: '#93ac61',
        white: '#ffffff',
      },
    },
    // Credit: https://slackthemes.net/#/benext
    benext: {
      palette: {
        text: '#555555',
        card: '#FFFFFF',
        page: '#E3E6EA',
      },
      fluentPalette: {
        neutralDark: '#404040',
        neutralLight: '#d1d4d7',
        neutralLighter: '#dadde1',
        neutralLighterAlt: '#dde0e4',
        neutralPrimary: '#555555',
        neutralPrimaryAlt: '#696969',
        neutralQuaternary: '#babcbf',
        neutralQuaternaryAlt: '#c3c5c9',
        neutralSecondary: '#989898',
        neutralSecondaryAlt: '#8a8886',
        neutralTertiary: '#cccccc',
        neutralTertiaryAlt: '#b2b5b8',
        themeDark: '#823613',
        themeDarkAlt: '#9a4017',
        themeDarker: '#60280e',
        themeLight: '#e6beab',
        themeLighter: '#f2dbd1',
        themeLighterAlt: '#fcf6f3',
        themePrimary: '#ab481a',
        themeSecondary: '#b5582e',
        themeTertiary: '#cd8564',
        white: '#E3E6EA',
        black: '#2f2f2f',
      },
    },
  },
  themeRules = Fluent.themeRulesStandardCreator(),
  changeTheme = (themeName: S) => {
    const
      theme = themes[themeName] ?? themes[defaultThemeName],
      { palette, fluentPalette } = theme,
      cardColor = Fluent.getColorFromString(palette.card)!,
      updateTones = (key: S, color: S) => {
        document.body.style.setProperty(`--wave-${key}`, color)
        const { r, g, b } = Fluent.getColorFromString(cssVarValue(color))!
        let alpha = 0.05
        for (let i = 0; i < 10; i++) {
          document.body.style.setProperty(`--wave-${key}${i}`, `rgba(${r},${g},${b},${alpha})`)
          alpha += i === 0 ? 0.05 : 0.1
        }
      }

    Object.keys(palette).forEach(k => document.body.style.setProperty(`--wave-${k}`, palette[k as keyof Palette]))
    Object.keys(fluentPalette).forEach(k => document.body.style.setProperty(`--wave-${k}`, fluentPalette[k as keyof Fluent.IPalette] || null))

    if (palette.text) updateTones('text', palette.text)
    if (palette.card) updateTones('card', palette.card)
    if (fluentPalette.themePrimary) {
      updateTones('primary', fluentPalette.themePrimary)

      // Adjust saturation of spectrum colors based on the current theme.
      const fluentPrimary = Fluent.getColorFromString(fluentPalette.themePrimary)
      if (fluentPrimary) {
        const primaryHsl = Fluent.hsv2hsl(fluentPrimary.h, fluentPrimary.s, fluentPrimary.v)
        Object.keys(spectrum).forEach(spectrumColor => {
          const { h, s, v } = Fluent.getColorFromString(spectrum[spectrumColor])!
          const spectrumHsl = Fluent.hsv2hsl(h, s, v)
          document.body.style.setProperty(
            `--wave-${spectrumColor}`,
            themeName === 'default'
              // Prevents saturation adjustment for 'default' theme and sets back the initial spectrum colors. 
              // Initial values of spectrum colors are already adjusted for 'default' theme.
              // Recomputing them would make 'default' theme spectrum colors inconsistent when switching from 'default' theme into another one and then switching back.
              ? spectrum[spectrumColor]
              : `hsl(${spectrumHsl.h}, ${primaryHsl.s}%, ${spectrumHsl.l}%)`
          )
        })
      }
    }

    // HACK: Execute as microtask to prevent race condition. Since meta is handled in page.tsx:render,
    // Fluent wants to update all components present (Spinner), but throws warning it cannot update unmounted element (Spinner)
    // because it is replaced by our new component tree in the meanwhile.
    setTimeout(() => {
      const { semanticColors } = Fluent.loadTheme({ palette: fluentPalette, defaultFontStyle: { fontFamily: 'Inter' }, isInverted: Fluent.isDark(cardColor) })
      document.body.style.setProperty('--wave-errorText', semanticColors.errorText)
    }, 0)
  }

export const
  defaultThemeName = 'default',
  themeB = box(defaultThemeName),
  themesB = box<Theme[]>([]),
  defaultTheme = themes[defaultThemeName],
  directions: Dict<S> = {
    horizontal: 'row',
    vertical: 'column',
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
  }

on(themesB, newThemes => {
  newThemes.forEach(t => {
    const
      { text, primary, card, page } = t,
      primaryColor = Fluent.getColorFromString(primary)!,
      textColor = Fluent.getColorFromString(text)!,
      cardColor = Fluent.getColorFromString(card)!

    Fluent.ThemeGenerator.setSlot(themeRules[Fluent.BaseSlots[Fluent.BaseSlots.primaryColor]], primaryColor, Fluent.isDark(primaryColor), true, true)
    Fluent.ThemeGenerator.setSlot(themeRules[Fluent.BaseSlots[Fluent.BaseSlots.foregroundColor]], textColor, Fluent.isDark(textColor), true, true)
    Fluent.ThemeGenerator.setSlot(themeRules[Fluent.BaseSlots[Fluent.BaseSlots.backgroundColor]], cardColor, Fluent.isDark(cardColor), true, true)
    Fluent.ThemeGenerator.insureSlots(themeRules, Fluent.isDark(cardColor))

    const { palette } = Fluent.createTheme({
      ...{ palette: Fluent.ThemeGenerator.getThemeAsJson(themeRules) },
      isInverted: Fluent.isDark(cardColor),
    })

    themes[t.name] = { fluentPalette: palette, palette: { text, card, page } }
  })
  changeTheme(themeB())
})

on(themeB, changeTheme)