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
import reactIcons from './react-icons-mdl2-list.json'
import * as Icons from '@fluentui/react-icons-mdl2'


loadTheme({
  defaultFontStyle: { fontFamily: 'Inter' },
  palette: defaultTheme.fluentPalette,
})


type IconMappings = {
  name: keyof typeof import("/Users/mmihok/Documents/h2o-ai/projects/wave/repo/wave/ui/node_modules/@fluentui/react-icons-mdl2/lib/index")
}[]
const iconsToRegister = (reactIcons as IconMappings).reduce(
  (prev, current) => {
    return { ...prev, ...{ [current.name.substring(0, current.name.length - 4)]: React.createElement(Icons[current.name] as React.FC, {}) } }
  }, {})

registerIcons({
  icons: iconsToRegister
})

ReactDOM.render(<Router />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
