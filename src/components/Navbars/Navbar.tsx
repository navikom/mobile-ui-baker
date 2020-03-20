import React from "react";
import classNames from "classnames";
import { RouteComponentProps } from "react-router-dom";

// @material-ui/core components
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.jsx";
import Button from "components/CustomButtons/Button.tsx";

import useStyles from "assets/jss/material-dashboard-react/components/headerStyle";
import { IRoute } from "interfaces/IRoute";

interface IHeader extends RouteComponentProps {
  routes: (google.maps.DirectionsRoute & IRoute)[];
  rtlActive: boolean;
  color:
    | "appBar"
    | "container"
    | "flex"
    | "title"
    | "adminTitle"
    | "link"
    | "appResponsive"
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "danger";
  handleDrawerToggle(): void;
}

export default (props: IHeader) => {
  const classes = useStyles();
  const makeBrand = () => {
    let name = "Page didn't find.";

    props.routes.map((prop: google.maps.DirectionsRoute & IRoute) => {
      if (
        props.location.pathname.includes(prop.layout + prop.url) ||
        props.location.pathname.includes(prop.layout + prop.path)
      ) {
        name = props.rtlActive ? prop.rtlName : prop.name;
      }
      return null;
    });
    return name;
  };
  const { color, history } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}

          <Button color="transparent" href="#" className={classes.adminTitle}>
            {makeBrand()}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          {props.rtlActive ? (
            <RTLNavbarLinks history={history} />
          ) : (
            <AdminNavbarLinks {...props} />
          )}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};
