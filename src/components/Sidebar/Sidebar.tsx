import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";

// @material-ui/core components
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

// interfaces
import { IRoute } from "interfaces/IRoute";

// models
import { App } from "models/App.ts";
import {
  SIDEBAR_APPLICATION,
  SIDEBAR_ENGAGE,
  SIDEBAR_MAIN,
  SIDEBAR_OTHER,
  SIDEBAR_USER,
} from "models/Constants";

// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.jsx";
import { Dictionary } from "services/Dictionary/Dictionary";

import useSidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle";

type ColorType = "purple" | "blue" | "green" | "orange" | "red";
type LinkProps = {
  color: string;
  location: any;
  rtlActive: boolean;
  routes: (google.maps.DirectionsRoute & IRoute)[];
  currentApp: string;
}

const Links = observer((props: LinkProps) => {
  const classes = useSidebarStyle();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return props.location.pathname.includes(routeName);
  };

  const getKey = (key: string) => key === SIDEBAR_APPLICATION && props.currentApp ? props.currentApp : key;
  const color = props.color as ColorType;
  const treeMap = [SIDEBAR_MAIN, SIDEBAR_APPLICATION, SIDEBAR_ENGAGE, SIDEBAR_USER, SIDEBAR_OTHER]
    .map((key) =>
      [getKey(key), props.routes.filter((route: google.maps.DirectionsRoute & IRoute) =>
        route.category === key && (!route.role || (App.user && App.user.hasRole(route.role))))]);

  return (
    <div>
      {
        treeMap.map((routesList: any[], key: number) => {
          if(routesList[1].length === 0) return null;
          const title = Dictionary.value(routesList[0]);
          return (
            <List className={classes.list} key={key}>
              <ListItemText
                primary={
                  title ? title.toUpperCase() : ""
                }
                className={classNames(classes.itemText, classes.categoryText, {
                  [classes.itemTextRTL]: props.rtlActive
                })}
              />
              {routesList[1].map((prop: google.maps.DirectionsRoute & IRoute, key: number) => {
                if (!prop.path || !prop.auth) return null;
                if(prop.auth && !App.loggedIn) return null;
                const listItemClasses = classNames({
                  [" " + classes[color]]: activeRoute(prop.layout + prop.path)
                });
                const whiteFontClasses = classNames({
                  [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path)
                });

                const LinkItem = prop.icon as React.ComponentType<SvgIconProps>;
                return (
                  <NavLink
                    to={prop.layout + prop.path}
                    className={classes.item}
                    activeClassName="active"
                    key={key}
                  >
                    <ListItem button className={classNames(classes.itemLink, listItemClasses, {
                      [classes.itemIconRTL]: props.rtlActive
                    })}>
                      {typeof prop.icon === "string" ? (
                        <Icon
                          className={classNames(classes.itemIcon, whiteFontClasses, {
                            [classes.itemIconRTL]: props.rtlActive
                          })}
                        >
                          {prop.icon}
                        </Icon>
                      ) : (
                        <LinkItem
                          className={classNames(classes.itemIcon, whiteFontClasses, {
                            [classes.itemIconRTL]: props.rtlActive
                          })}
                        />
                      )}
                      <ListItemText
                        primary={
                          props.rtlActive ? prop.rtlName : Dictionary.value(prop.name)
                        }
                        className={classNames(classes.itemText, whiteFontClasses, {
                          [classes.itemTextRTL]: props.rtlActive
                        })}
                        disableTypography={true}
                      />
                    </ListItem>
                  </NavLink>
                );
              })}
            </List>
          )
        })
      }
    </div>
  )
});

const Brand = ({...props}) => {
  const classes = props.classes;
  return (
    <div className={props.classes.logo}>
      <a
        href="/"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive
        })}
      >
        <div className={classes.logoImage}>
          <img src={props.logo} alt="logo" className={classes.img}/>
          <div className={classes.logoText}>{props.logoText}</div>
        </div>
      </a>
    </div>
  )
}

interface ISidebar extends RouteComponentProps {
  routes: (google.maps.DirectionsRoute & IRoute)[];
  rtlActive: boolean;
  handleDrawerToggle(): void;
  logoText: string;
  open: boolean;
  logo: any;
  color: string;
  image: any;
  currentApp: string;
}

function Sidebar(props: ISidebar) {
  const classes = useSidebarStyle();
  const {color, logo, image, logoText, routes, history, currentApp, rtlActive} = props;

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <Brand logo={logo} logoText={logoText} classes={classes}/>
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks history={history}/> : <AdminNavbarLinks {...props}/>}
            <Links color={color} rtlActive={rtlActive} routes={routes} location={props.location} currentApp={currentApp}/>
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{backgroundImage: "url(" + image + ")"}}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive
            })
          }}
        >
          <Brand logo={logo} logoText={logoText} classes={classes}/>
          <div className={classes.sidebarWrapper}>
            <Links routes={routes} rtlActive={rtlActive} color={color} location={props.location} currentApp={currentApp}/>
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{backgroundImage: "url(" + image + ")"}}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

export default Sidebar;
