import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.tsx";
import Button from "components/CustomButtons/Button.tsx";

import rtlHeaderLinksStyle from "assets/jss/material-dashboard-react/components/rtlHeaderLinksStyle.jsx";

// models
import { App } from "models/App.ts";
import { Auth } from "models/Auth/Auth.ts";

// api

class HeaderLinks extends React.Component {
  state = {
    open: false,
    personOpen: false
  };
  handleToggle(key) {
    this.setState(state => ({[key]: !state[key]}));
  }

  handleClose(event, key, prop) {
    if (this[key].contains(event.target)) {
      return;
    }

    this.setState({[prop]: false});
  };

  logout() {
    Auth.logout();
  }

  render() {
    const { classes, history } = this.props;
    const { open, personOpen } = this.state;
    return (
      <div>
        <div className={classes.searchWrapper}>
          <CustomInput
            formControlProps={{
              className: classes.margin + " " + classes.search
            }}
            inputProps={{
              placeholder: "جستجو...",
              inputProps: {
                "aria-label": "Search"
              }
            }}
          />
          <Button color="white" aria-label="edit" justIcon round>
            <Search />
          </Button>
        </div>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>آمارها</p>
          </Hidden>
        </Button>
        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={e => this.handleToggle("anchorEl")}
            className={classes.buttonLink}
          >
            <Notifications className={classes.icons} />
            <span className={classes.notifications}>۵</span>
            <Hidden mdUp implementation="css">
              <p onClick={this.handleClick} className={classes.linkText}>
                اعلان‌ها
              </p>
            </Hidden>
          </Button>
          <Poppers
            open={open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !open }) +
              " " +
              classes.pooperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={e => this.handleClose(e, "anchorEl", "open")}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={e => this.handleClose(e, "anchorEl", "open")}
                        className={classes.dropdownItem}
                      >
                        محمدرضا به ایمیل شما پاسخ داد
                      </MenuItem>
                      <MenuItem
                        onClick={e => this.handleClose(e, "anchorEl", "open")}
                        className={classes.dropdownItem}
                      >
                        شما ۵ وظیفه جدید دارید
                      </MenuItem>
                      <MenuItem
                        onClick={e => this.handleClose(e, "anchorEl", "open")}
                        className={classes.dropdownItem}
                      >
                        از حالا شما با علیرضا دوست هستید
                      </MenuItem>
                      <MenuItem
                        onClick={e => this.handleClose(e, "anchorEl", "open")}
                        className={classes.dropdownItem}
                      >
                        اعلان دیگر
                      </MenuItem>
                      <MenuItem
                        onClick={e => this.handleClose(e, "anchorEl", "open")}
                        className={classes.dropdownItem}
                      >
                        اعلان دیگر
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        <div className={classes.manager}>
          <Button
            buttonRef={ref => this.personAnchor = ref}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-label="Person"
            className={classes.buttonLink}
            onClick={() => this.handleToggle("personOpen")}
          >
            <Person className={classes.icons}/>
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>حساب کاربری</p>
            </Hidden>
          </Button>
          <Poppers
            open={personOpen}
            anchorEl={this.personAnchor}
            transition
            disablePortal
            className={
              classNames({[classes.popperClose]: !personOpen}) +
              " " +
              classes.pooperNav
            }
          >
            {({TransitionProps, placement}) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={e => this.handleClose(e, "personAnchor", "personOpen")}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={e => {
                          this.handleClose(e, "personAnchor", "personOpen");
                          if(App.loggedIn) {
                            this.logout();
                          }
                          history.push("/login");
                        }}
                        className={classes.dropdownItem}
                      >
                        {App.loggedIn ? "الخروج" : "تسجيل الدخول"}
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
}

export default withStyles(rtlHeaderLinksStyle)(HeaderLinks);
