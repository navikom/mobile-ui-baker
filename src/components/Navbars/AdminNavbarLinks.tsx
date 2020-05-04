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

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Dashboard from "@material-ui/icons/Dashboard";

// models
import { App } from "models/App";
import { Auth } from "models/Auth/Auth";
import { ROUTE_EDITOR, ROUTE_LOGIN } from "models/Constants";

import useStyles from "assets/jss/material-dashboard-react/components/headerLinksStyle";
import useDropdownStyles from "assets/jss/material-dashboard-react/dropdownStyle";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

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
      <div className={classes.manager}>
        <IconButton
          className={iconButtonStyle}
          onClick={handleClick(setAnchorEl, anchorEl)}
        >
          <Dashboard />
          <Hidden mdUp implementation="css">
            <p onClick={() => props.history.push(ROUTE_EDITOR)} className={classes.linkText}>
              {Dictionary.defValue(DictionaryService.keys.editor)}
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
                      onClick={() => props.history.push(ROUTE_EDITOR)}
                      className={dropdownClasses.dropdownItem}
                    >
                      {Dictionary.defValue(DictionaryService.keys.editor)}
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
            <p onClick={() => {
              if (App.loggedIn) {
                logout();
              }
              props.history.push(ROUTE_LOGIN);
            }}
               className={classes.linkText}>
              {App.loggedIn ? Dictionary.defValue(DictionaryService.keys.logout) : Dictionary.defValue(DictionaryService.keys.login)}
            </p>
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
                        props.history.push(ROUTE_LOGIN);
                      }}
                      className={dropdownClasses.dropdownItem}
                    >
                      {App.loggedIn ? Dictionary.defValue(DictionaryService.keys.logout) : Dictionary.defValue(DictionaryService.keys.login)}
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
