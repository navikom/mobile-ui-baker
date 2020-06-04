import React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/core/styles';
import WaitingComponent from 'hocs/WaitingComponent';
import Panel from 'layouts/Panel';
import Documentation from 'layouts/Documentation';
import Main from 'layouts/Main';
import Editor from 'layouts/Editor';
import Empty from 'layouts/Empty';
import Viewer from 'layouts/Viewer';
// models
import { App as AppStore } from 'models/App';
import * as Constants from 'models/Constants';

import theme from 'assets/theme';
import 'assets/css/material-dashboard-react.css';
import { lazy } from './utils';

const LandingPage = lazy(() => import('views/LandingPage/LandingPage'));
const PageDidNotFound = lazy(() => import('views/PageDidNotFound/404'));

const hist = createBrowserHistory();

const prevHistoryPush = hist.push;
let lastLocation = hist.location;

hist.listen(location => {
  lastLocation = location;
});
hist.push = (pathname: any, state: {} = {}) => {
  if (
    lastLocation === null ||
    pathname !==
    lastLocation.pathname + lastLocation.search + lastLocation.hash ||
    JSON.stringify(state) !== JSON.stringify(lastLocation.state)
  ) {
    prevHistoryPush(pathname, state);
  }
};

AppStore.setHistory(hist);
AppStore.start();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={hist}>
        <Switch>
          <Route
            path={Constants.LAYOUT_PANEL}
            component={WaitingComponent(Panel)}
          />
          <Route
            path={Constants.LAYOUT_DOCS}
            component={WaitingComponent(Documentation)}
          />
          <Route
            path={Constants.ROUTE_EDITOR}
            component={WaitingComponent(Editor)}
          />
          {
            [Constants.ROUTE_VIEWER, Constants.ROUTE_SCREENS].map((route, i) => (
              <Route
                key={i}
                path={route}
                component={WaitingComponent(Viewer)}
              />
            ))
          }
          {
            [Constants.ROUTE_PRICES, Constants.ROUTE_PROJECTS, Constants.ROUTE_TERMS]
              .map((route, i) => (
                <Route
                  key={i}
                  path={route}
                  component={WaitingComponent(Main)}
                />
              ))
          }
          {
            [Constants.ROUTE_LOGIN,
              Constants.ROUTE_SIGN_UP,
              Constants.ROUTE_RECOVERY,
              Constants.ROUTE_RESET ].map((route, i) => (
              <Route
                key={i}
                path={route}
                component={WaitingComponent(Empty)}
              />
            ))
          }
          <Route
            exact
            path={Constants.ROUTE_ROOT}
            component={WaitingComponent(LandingPage)}
          />
          <Route component={WaitingComponent(PageDidNotFound)} />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App;
