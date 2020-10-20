import React from 'react'
import Login from './login'
import App from './app'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

const
  Router = () => {
    const
      routes = [
        {
          path: '/_login',
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
