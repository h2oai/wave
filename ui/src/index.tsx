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

import { loadTheme, registerIcons } from '@fluentui/react'
import React from 'react'
import ReactDOM from 'react-dom'
import './cards'
import './index.scss'
import Router from './router'
import * as serviceWorker from './serviceWorker'
import { defaultTheme } from './theme'
import * as Icons from '@fluentui/react-icons-mdl2'


loadTheme({
  defaultFontStyle: { fontFamily: 'Inter' },
  palette: defaultTheme.fluentPalette,
})

type IconMapping = keyof typeof Icons

const reactIcons = Object.keys(Icons).filter((icon) => {
  return Icons[icon as IconMapping].name === 'Component'
})

const iconsToRegister = (reactIcons as IconMapping[]).reduce(
  (acc: { [key: string]: React.FunctionComponentElement<React.FC> }, cur) => (
    acc[cur.substring(0, cur.length - 4)] = React.createElement<React.FC>(Icons[cur] as React.FC), acc
  ), {})

registerIcons({
  icons: iconsToRegister
})

ReactDOM.render(<Router />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
