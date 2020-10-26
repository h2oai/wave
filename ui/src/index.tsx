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

import { initializeIcons, loadTheme } from '@fluentui/react'
import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router'
import './cards'
import './index.css'
import * as serviceWorker from './serviceWorker'

loadTheme({
  defaultFontStyle: {
    fontFamily: 'Inter',
  },
  palette: {
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
  }
})

// Initialize Fluent icons
initializeIcons()

ReactDOM.render(<Router />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
