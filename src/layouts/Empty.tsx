import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
// creates a beautiful scrollbar
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import routes from "routes";

import mainStyle from "assets/jss/material-dashboard-react/layouts/mainStyle";

import image from "assets/img/sidebar-2.jpg";
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

interface MainProps extends RouteComponentProps, WithStyles<typeof mainStyle> {}


const Empty: React.FC<MainProps> = ({classes}) => {

   const backgroundImage = `url(${image})`;
    return (
      <div className={classes.wrapper}>
        <div className={classes.fullPage} style={{backgroundImage}}>
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes}</div>
          </div>
        </div>
      </div>
    );
}

export default withStyles(mainStyle)(Empty);
