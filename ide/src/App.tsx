import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';

function App() {
  return (
    <div className="main-container">
      <BrowserRouter>
        <Switch>
          <Route path='/' exact={true} component={HomePage} />
          <Route path='/app/:name' exact={false} component={AppPage} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App