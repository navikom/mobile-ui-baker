import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import WaitingComponent from "hocs/WaitingComponent";
import Panel from "layouts/Panel";
import Main from "layouts/Main";
import Editor from "layouts/Editor";
import theme from "assets/theme";

import { createBrowserHistory } from "history";

// models
import { App as AppStore } from "models/App.ts";
import * as Constants from "models/Constants.ts";

import "assets/css/material-dashboard-react.css";

const hist = createBrowserHistory();

AppStore.setHistory(hist);
AppStore.start();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={hist}>
        <Switch>
          <Route
            path={Constants.PANEL_ROUTE}
            component={WaitingComponent(Panel)}
          />
          <Route
            path={Constants.LOGIN_ROUTE}
            component={WaitingComponent(Main)}
          />
          <Route
            path={Constants.EDITOR_ROUTE}
            component={WaitingComponent(Editor)}
          />
          <Route
            path={Constants.SIGN_UP_ROUTE}
            component={WaitingComponent(Main)}
          />
          <Route path={Constants.ROOT_ROUTE} component={WaitingComponent(Main)} />
          <Redirect to={Constants.START_PAGE_ROUTE} />
          <Route path="*" component={WaitingComponent(Panel)} />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App;
