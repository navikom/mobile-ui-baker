import React, { useState } from "react";
import classNames from "classnames";
import { RouteComponentProps } from "react-router-dom";
import { History } from "history";
import { observer } from "mobx-react-lite";

// @material-ui/core components
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import MenuItem from "@material-ui/core/MenuItem";
import Menu, { MenuProps } from '@material-ui/core/Menu';
import { withStyles } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

// core components
import Button from "components/CustomButtons/Button";

// interfaces
import { IRoute } from "interfaces/IRoute";

// model
import * as Constants from "models/Constants";
import { App } from "models/App";

import { mainNavRoutes, mainNavRoutesLoggedIn } from "routes";
import useStyles from "assets/jss/material-dashboard-react/components/headerStyle";
import { Dictionary } from "services/Dictionary/Dictionary";

import { whiteColor } from "assets/jss/material-dashboard-react";
import { TITLE } from 'models/Constants';


const StyledMenu = withStyles({
  paper: {},
})((props: MenuProps) => (
  <Menu
    variant="menu"
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {},
}))(MenuItem);

function nav(history: History, classes: any) {

  return (App.loggedIn ? mainNavRoutesLoggedIn : mainNavRoutes).map((route: IRoute, i: number) => {
    if(!route.path) return null;
    const link = classNames({
      [classes.link]: true,
      [classes.active]: route.path === history.location.pathname
    });
    return (
      <Button
        key={i}
        color="transparent"
        className={link}
        onClick={() => history.push((route.auth ? `${route.layout}${route.path}` : route.path) as string)}
      >
        {Dictionary.value(route.name).toUpperCase()}
      </Button>
    );
  });
}

function navMobile(history: History, cb: () => void) {
  return (App.loggedIn ? mainNavRoutesLoggedIn : mainNavRoutes).map((route: IRoute, i: number) => {
    if(!route.path) return null;
    return (
      <StyledMenuItem
        key={i.toString()}
        onClick={() => {
          cb();
          history.push((route.auth ? `${route.layout}${route.path}` : route.path) as string)
        }}
      >
        <ListItemText primary={Dictionary.value(route.name)} />
      </StyledMenuItem>
    );
  });
}

interface HeaderProps extends RouteComponentProps {
  color: "primary" | "info" | "success" | "warning" | "danger";
}

const Header: React.FC<HeaderProps> = ({ color, history }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function makeBrand() {
    const name = TITLE.toUpperCase();
    return name;
  }

  const classes = useStyles();
  const appBarClasses = classNames({
    [" " + classes[color as keyof typeof classes]]: color
  });
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button
            color="transparent"
            className={classes.title}
            onClick={() => history.push(Constants.ROUTE_ROOT)}
          >
            {makeBrand()}
          </Button>
        </div>
        <Hidden smDown>
          {nav(history, classes)}
        </Hidden>
        <Hidden mdUp>
          <IconButton
            style={{color: whiteColor}}
            aria-label="open drawer"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {navMobile(history, handleClose)}
        </StyledMenu>
      </Toolbar>
    </AppBar>
  );
};

export default observer(Header);
