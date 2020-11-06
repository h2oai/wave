import AppPage from '@/pages/AppPage';
import HomePage from '@/pages/HomePage';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { bond } from './dataflow';

export default bond(() => {
  const
    render = () => (
      <div className="main-container">
        <BrowserRouter basename={BASENAME}>
          <Switch>
            <Route path='/' exact={true} component={HomePage} />
            <Route path='/app/:name' exact={false} component={AppPage} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  return { render }
})