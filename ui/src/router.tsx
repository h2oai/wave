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

import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from './app'
import LayoutBuilder from './gui/layout_builder'
import Login from './login'
import { wave } from './ui'

const
  Router = () => {
    const
      routes = [
        {
          path: '/gui',
          exact: true,
          render: () => <LayoutBuilder />
        },
        {
          path: wave.loginURL,
          exact: true,
          render: () => <Login />,
        },
        {
          path: wave.baseURL,
          exact: false,
          render: () => <App />
        },
      ]
    return (
      <BrowserRouter>
        <Switch>
          {routes.map((r, i) => <Route key={i} path={r.path} exact={r.exact}>{r.render()}</Route>)}
        </Switch>
      </BrowserRouter>
    )
  }

export default Router
