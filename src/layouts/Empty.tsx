import React from "react";
import { Route, Switch } from "react-router-dom";
// creates a beautiful scrollbar
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import routes from "routes";


import { IRoute } from "interfaces/IRoute";
import WaitingComponent from "hocs/WaitingComponent";

const switchRoutes = (
  <Switch>
    {routes.map((prop: IRoute, key) => {
      if (prop.layout === "/empty") {
        return (
          <Route
            path={prop.path}
            component={WaitingComponent(prop.component)}
            key={key}
          />
        );
      }
      return null;
    })}
  </Switch>
);



const Empty: React.FC = () => {

    return (
      <React.Fragment>{switchRoutes}</React.Fragment>
    );
}

export default Empty;
