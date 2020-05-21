import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { documentationRoutes } from 'routes';
import {
  LAYOUT_DOCS,
  ROUTE_DOCS_GET_STARTED,
  SIDEBAR_DOCS_EDITOR,
  SIDEBAR_DOCS_GET_STARTED, SIDEBAR_DOCS_PLUGIN, SIDEBAR_DOCS_VIEWER,
  TITLE
} from 'models/Constants';
import dashboardStyle from 'assets/jss/material-dashboard-react/layouts/dashboardStyle';
import ScrollContainer from 'containers/ScrollContainer/ScrollContainer';
import { IRoute } from 'interfaces/IRoute';
import WaitingComponent from 'hocs/WaitingComponent';
import { lazy } from 'utils';
import logo from 'assets/img/apple-icon.png';

// core components
const Navbar = lazy(() => import("components/Navbars/Navbar"));
const Footer = lazy(() => import("components/Footer/Footer"));
const Sidebar = lazy(() => import("components/Sidebar/Sidebar"));

const Documentation: React.FC<RouteComponentProps> = (props) => {
  const color = 'green';
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resizeFunction);
    if(props.location.pathname === LAYOUT_DOCS || props.location.pathname === LAYOUT_DOCS + '/') {
      props.history.replace(ROUTE_DOCS_GET_STARTED);
    }
    return () => {
      window.removeEventListener('resize', resizeFunction);
    };
  }, [props.history, props.location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [setMobileOpen, mobileOpen]);

  const classes = dashboardStyle();

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={documentationRoutes}
        logoText={TITLE + ' Docs'}
        logo={logo}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        categories={[SIDEBAR_DOCS_GET_STARTED, SIDEBAR_DOCS_PLUGIN, SIDEBAR_DOCS_EDITOR, SIDEBAR_DOCS_VIEWER]}
        {...props}
      />
      <ScrollContainer>
        <Navbar
          routes={documentationRoutes as unknown as (google.maps.DirectionsRoute & IRoute)[]}
          handleDrawerToggle={handleDrawerToggle}
          color={color}
          {...props}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              {documentationRoutes.map((prop: IRoute, key: number) => {
                return (
                  <Route
                    exact
                    path={prop.layout + (prop.path || prop.url) + (prop.params ? prop.params : '')}
                    component={WaitingComponent(prop.component)}
                    key={key}
                  />
                );
              })}
            </Switch>
          </div>
        </div>
        <Footer />
      </ScrollContainer>
    </div>
  );
};

export default Documentation;
