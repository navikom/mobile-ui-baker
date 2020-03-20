import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// models
import { App } from "models/App.ts";
import * as Constants from "models/Constants.ts";

import "assets/css/material-dashboard-react.css?v=1.6.0";

// core components
import Panel from "layouts/Panel.tsx";
import Main from "layouts/Main.tsx";
import Editor from "layouts/Editor.tsx";
import WaitingComponent from "hocs/WaitingComponent";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "assets/theme";

const hist = createBrowserHistory();

App.setHistory(hist);
App.start();

ReactDOM.render(
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
  </ThemeProvider>,
  document.getElementById("root")
);
