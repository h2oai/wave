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


import { setStylesTarget } from 'typestyle'
import { loadTheme, registerIcons, Stylesheet } from '@fluentui/react'
import React from 'react'
import ReactDOM from 'react-dom'
import './cards'
import './index.scss'
import Router from './router'
import * as serviceWorker from './serviceWorker'
import { defaultTheme } from './theme'
import * as Icons from '@fluentui/react-icons-mdl2'

const target = document.createElement('style')
const nonce = document.body.dataset.nonce || ''
Stylesheet.getInstance().setConfig({ cspSettings: { nonce } })
target.setAttribute('nonce', nonce)
document.head.appendChild(target)
setStylesTarget(target)

loadTheme({
  defaultFontStyle: { fontFamily: 'Inter' },
  palette: defaultTheme.fluentPalette,
})

const icons = Object.entries(Icons).reduce((acc, [iconName, iconComponent]) => {
  if ('displayName' in iconComponent) acc[iconName.slice(0, -4)] = React.createElement(iconComponent as React.FC)
  return acc
}, {} as { [key: string]: JSX.Element })
registerIcons({ icons })

ReactDOM.render(<Router />, document.getElementById('wave-root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
