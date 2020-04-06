import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";

// @material-ui/icons
// core components
import Button from "components/CustomButtons/Button.tsx";

// interfaces
import { IRoute } from "interfaces/IRoute";

// model
import * as Constants from "models/Constants.ts";

import { mainNavRoutes } from "routes";
import useStyles from "assets/jss/material-dashboard-react/components/headerStyle";
import { Dictionary } from "services/Dictionary/Dictionary";

function nav(props: any, classes: any) {
  return mainNavRoutes.map((route: IRoute, i: number) => {
    if(!route.path) return null;
    return (
      <Button
        key={i}
        color="transparent"
        className={classes.link}
        onClick={() => props.history.push(route.path)}
      >
        {Dictionary.value(route.name)}
      </Button>
    );
  });
}

function Header({ ...props }) {
  function makeBrand() {
    const name = "Webinsolut";
    // props.routes.map((prop, key) => {
    //   if (prop.url === props.location.pathname) {
    //     name = props.rtlActive ? prop.rtlName : prop.name;
    //   }
    //   return null;
    // });
    return name;
  }
  const classes = useStyles();
  // const { color, history } = props;
  const appBarClasses = classNames({
    [" " + classes[props.color as keyof typeof classes]]: props.color
  });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button
            color="transparent"
            className={classes.title}
            onClick={() => props.history.push(Constants.ROOT_ROUTE)}
          >
            {makeBrand()}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          {nav(props, classes)}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <div />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default Header;
