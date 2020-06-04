/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

// creates a beautiful scrollbar
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// @material-ui/core components

// interfaces
import { IRoute } from 'interfaces/IRoute';

// utils
import { lazy } from 'utils';

// core containers
import ScrollContainer from 'containers/ScrollContainer/ScrollContainer';
import routes from 'routes';

import WaitingComponent from 'hocs/WaitingComponent';
import { App } from 'models/App';
import {
  LAYOUT_PANEL,
  ROUTE_LOGIN,
  SIDEBAR_ENGAGE,
  SIDEBAR_MAIN,
  SIDEBAR_OTHER,
  SIDEBAR_USER,
  TITLE
} from 'models/Constants';
import CookiePopup from 'components/CookiePopup';
import dashboardStyle from 'assets/jss/material-dashboard-react/layouts/dashboardStyle';
import image from 'assets/img/sidebar-2.jpg';
import logo from 'assets/img/favicon.png';

// core components
const Navbar = lazy(() => import('components/Navbars/Navbar'));
const Footer = lazy(() => import('components/Footer/Footer'));
const Sidebar = lazy(() => import('components/Sidebar/Sidebar'));

const switchRoutes = (routes: IRoute[]) => (
  <Switch>
    {routes.map((prop: IRoute, key: number) => {
      if (prop.layout === LAYOUT_PANEL) {
        return (
          <Route
            exact
            path={prop.layout + (prop.path || prop.url) + (prop.params ? prop.params : '')}
            component={WaitingComponent(prop.component)}
            key={key}
          />
        );
      }
    })}
  </Switch>
);

export default (props: RouteComponentProps) => {
  const [color] = useState('blue');
  const [appImage] = useState(image);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currRoutes] =
    useState([...routes.filter(prop => prop.layout === LAYOUT_PANEL)]);
  const [sidebarRoutes] = useState(routes.filter(prop => prop.layout === LAYOUT_PANEL) as IRoute[]);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getRoute = () => {
    return props.location.pathname !== '/admin/maps';
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resizeFunction);
    if(!App.loggedIn) {
      App.navigationHistory!.push(ROUTE_LOGIN);
    }
    return () => {
      window.removeEventListener('resize', resizeFunction);
    };
  }, [App]);

  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [props.history.location, props.location]);

  const classes = dashboardStyle();

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={sidebarRoutes}
        logoText={TITLE}
        logo={logo}
        image={appImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        categories={[SIDEBAR_MAIN, SIDEBAR_ENGAGE, SIDEBAR_USER, SIDEBAR_OTHER]}
        {...props}
      />
      <ScrollContainer>
        <Navbar
          routes={currRoutes}
          handleDrawerToggle={handleDrawerToggle}
          {...props}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              {switchRoutes(currRoutes)}
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            {switchRoutes(currRoutes)}
          </div>
        )}
        {getRoute() ? <Footer /> : null}
      </ScrollContainer>
      <CookiePopup />
    </div>
  );
};
