import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

// @material-ui/core components
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

// interfaces
import { IRoute } from 'interfaces/IRoute';

// models
import { App } from 'models/App';

// core components
import AdminNavbarLinks from 'components/Navbars/AdminNavbarLinks';
import { Dictionary } from 'services/Dictionary/Dictionary';

import useSidebarStyle from 'assets/jss/material-dashboard-react/components/sidebarStyle';

export type ColorType = 'purple' | 'blue' | 'green' | 'orange' | 'red';
type LinkProps = {
  color: string;
  location: any;
  routes: (google.maps.DirectionsRoute & IRoute)[];
  categories: string[];
}

const Links = observer((props: LinkProps) => {
  const classes = useSidebarStyle();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return props.location.pathname.includes(routeName);
  };

  const color = props.color as ColorType;
  const treeMap = props.categories
    .map((key) =>
      [key, props.routes.filter((route: google.maps.DirectionsRoute & IRoute) =>
        route.category === key && (route.auth || route.docs) && (!route.role || (App.user && App.user.hasRole(route.role))))])
    .filter(e => e[1].length);

  return (
    <div>
      {
        treeMap.map((routesList: any[], key: number) => {
          // if(routesList[1].length === 0) return null;
          const title = Dictionary.value(routesList[0]);
          return (
            <List className={classes.list} key={key}>
              <ListItemText
                primary={
                  title ? title.toUpperCase() : ''
                }
                className={classNames(classes.itemText, classes.categoryText)}
              />
              {routesList[1].map((prop: google.maps.DirectionsRoute & IRoute, key: number) => {
                if (prop.auth && !App.loggedIn) return null;

                const listItemClasses = classNames({
                  [' ' + classes[color]]: activeRoute(prop.layout + prop.path)
                });
                const whiteFontClasses = classNames({
                  [' ' + classes.whiteFont]: activeRoute(prop.layout + prop.path)
                });

                const LinkItem = prop.icon as (React.ComponentType<SvgIconProps> | undefined);
                return (
                  <NavLink
                    to={prop.layout + prop.path}
                    className={classes.item}
                    activeClassName="active"
                    key={key}
                  >
                    <ListItem button className={classNames(classes.itemLink, listItemClasses)}>
                      {typeof prop.icon === 'string' ? (
                        <Icon
                          className={classNames(classes.itemIcon, whiteFontClasses)}
                        >
                          {prop.icon}
                        </Icon>
                      ) : LinkItem ? (
                        <LinkItem
                          className={classNames(classes.itemIcon, whiteFontClasses)}
                        />
                      ) : null}
                      <ListItemText
                        primary={
                          Dictionary.value(prop.name)
                        }
                        className={classNames(classes.itemText, whiteFontClasses)}
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

const Brand = ({ ...props }) => {
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
          <img src={props.logo} alt="logo" className={classes.img} />
          <div className={classes.logoText}>{props.logoText}</div>
        </div>
      </a>
    </div>
  )
};

interface ISidebar extends RouteComponentProps {
  routes: (google.maps.DirectionsRoute & IRoute)[];

  handleDrawerToggle(): void;

  logoText: string;
  open: boolean;
  logo: any;
  color: string;
  image: any;
  currentApp: string;
  categories: string[];
}

function Sidebar(props: ISidebar) {
  const classes = useSidebarStyle();
  const { color, logo, image, logoText, routes } = props;

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={'right'}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper)
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <Brand logo={logo} logoText={logoText} classes={classes} />
          <div className={classes.sidebarWrapper}>
            <AdminNavbarLinks {...props} />
            <Links categories={props.categories} color={color} routes={routes} location={props.location} />
          </div>
          <div
            className={classes.background}
            style={image !== undefined ? { backgroundImage: 'url(' + image + ')' } : {}}
          />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={'left'}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper)
          }}
        >
          <Brand logo={logo} logoText={logoText} classes={classes} />
          <div className={classes.sidebarWrapper}>
            <Links categories={props.categories} routes={routes} color={color} location={props.location} />
          </div>
          <div
            className={classes.background}
            style={image !== undefined ? { backgroundImage: 'url(' + image + ')' } : {}}
          />
        </Drawer>
      </Hidden>
    </div>
  );
}

export default Sidebar;
