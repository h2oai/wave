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
import Login from './login'
import App from './app'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

const
  Router = () => {
    const
      routes = [
        {
          path: '/_auth/login',
          exact: true,
          render: () => <Login />,
        },
        {
          path: '/',
          exact: false,
          render: () => <App />
        },
      ]
    return (
      <BrowserRouter>
        <Switch>
          {routes.map((r, i) => <Route key={i} path={r.path} exact={r.exact} render={r.render} />)}
        </Switch>
      </BrowserRouter>
    )
  }

export default Router
