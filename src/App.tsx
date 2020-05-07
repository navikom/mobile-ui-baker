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

import theme from 'assets/theme';

// models
import { App as AppStore } from 'models/App';
import * as Constants from 'models/Constants';

import 'assets/css/material-dashboard-react.css';

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
          <Route
            path={Constants.ROUTE_VIEWER}
            component={WaitingComponent(Viewer)}
          />
          {
            [Constants.ROUTE_LOGIN, Constants.ROUTE_SIGN_UP, Constants.ROUTE_RESET, Constants.ROUTE_PRICES, Constants.ROUTE_PROJECTS]
              .map((route, i) => (
                <Route
                  key={i}
                  path={route}
                  component={WaitingComponent(Main)}
                />
              ))
          }
          {
            [Constants.ROUTE_ROOT].map((route, i) => (
              <Route
                key={i}
                path={route}
                component={WaitingComponent(Empty)}
              />
            ))
          }
          <Redirect to={Constants.ROUTE_START_PAGE} />
          <Route path="*" component={WaitingComponent(Panel)} />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App;
