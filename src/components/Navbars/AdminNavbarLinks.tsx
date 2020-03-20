import React, { useState } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

// @material-ui/core components
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";

// models
import { App } from "models/App.ts";
import { Auth } from "models/Auth/Auth.ts";
import { LOGIN_ROUTE } from "models/Constants";

// core components
import CustomInput from "components/CustomInput/CustomInput.tsx";
import Button from "components/CustomButtons/Button.tsx";

import useStyles from "assets/jss/material-dashboard-react/components/headerLinksStyle";
import useDropdownStyles from "assets/jss/material-dashboard-react/dropdownStyle";

function AdminNavbarLinks(props: RouteComponentProps) {
  const classes = useStyles();
  const dropdownClasses = useDropdownStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [personAnchorEl, setPersonAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const handleClose = (
    cb: (el: (EventTarget & HTMLElement) | null) => void
  ) => () => cb(null);
  const logout = () => {
    Auth.logout();
  };

  const handleClick = (
    cb: (el: (EventTarget & HTMLElement) | null) => void,
    anchor: null | HTMLElement
  ) => (e: React.MouseEvent<HTMLElement>) => {
    cb(anchor ? null : e.currentTarget);
  };

  const open = Boolean(anchorEl);
  const personOpen = Boolean(personAnchorEl);

  const iconButtonStyle = classNames({
    [classes.whiteFont]: window.innerWidth < 959
  });

  return (
    <div>
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search"
            }
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div>
      <IconButton className={iconButtonStyle} aria-label="Dashboard">
        <Dashboard />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>Dashboard</p>
        </Hidden>
      </IconButton>
      <div className={classes.manager}>
        <IconButton
          className={iconButtonStyle}
          onClick={handleClick(setAnchorEl, anchorEl)}
        >
          <Badge badgeContent={5} color="primary">
            <Notifications />
          </Badge>
          <Hidden mdUp implementation="css">
            <p onClick={() => {}} className={classes.linkText}>
              Notification
            </p>
          </Hidden>
        </IconButton>
        <Poppers
          open={open}
          anchorEl={anchorEl}
          transition
          disablePortal
          className={
            classNames({ [dropdownClasses.popperClose]: !open }) +
            " " +
            dropdownClasses.pooperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose(setAnchorEl)}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleClose(setAnchorEl)}
                      className={dropdownClasses.dropdownItem}
                    >
                      Mike John responded to your email
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose(setAnchorEl)}
                      className={dropdownClasses.dropdownItem}
                    >
                      You have 5 new tasks
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose(setAnchorEl)}
                      className={dropdownClasses.dropdownItem}
                    >
                      You&apos;re now friend with Andrew
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose(setAnchorEl)}
                      className={dropdownClasses.dropdownItem}
                    >
                      Another Notification
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose(setAnchorEl)}
                      className={dropdownClasses.dropdownItem}
                    >
                      Another One
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      <div className={classes.manager}>
        <IconButton
          className={iconButtonStyle}
          onClick={handleClick(setPersonAnchorEl, personAnchorEl)}
          aria-label="Person"
        >
          <Person />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </IconButton>
        <Poppers
          open={personOpen}
          anchorEl={personAnchorEl}
          transition
          disablePortal
          className={
            classNames({ [dropdownClasses.popperClose]: !personOpen }) +
            " " +
            dropdownClasses.pooperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose(setPersonAnchorEl)}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={e => {
                        handleClose(setPersonAnchorEl)();
                        if (App.loggedIn) {
                          logout();
                        }
                        props.history.push(LOGIN_ROUTE);
                      }}
                      className={dropdownClasses.dropdownItem}
                    >
                      {App.loggedIn ? "Logout" : "Login"}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}

export default observer(AdminNavbarLinks);
