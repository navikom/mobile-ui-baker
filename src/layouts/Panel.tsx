/* eslint-disable */
import React, { Suspense, useEffect, useState } from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { reaction } from "mobx";
import { observer, useDisposable } from "mobx-react-lite";

// creates a beautiful scrollbar
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components

// interfaces
import { IRoute } from "interfaces/IRoute";
import { IApp } from "interfaces/IApp";

// models
import { App } from "models/App";

// utils
import { lazy } from "utils";

// core components
const Navbar = lazy(() => import("components/Navbars/Navbar"));
const Footer = lazy(() => import("components/Footer/Footer"));
const Sidebar = lazy(() => import("components/Sidebar/Sidebar"));

// core containers
import ScrollContainer from "containers/ScrollContainer/ScrollContainer";
import routes, { appRoutes } from "routes";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/webinsolut.png";
import WaitingComponent from "hocs/WaitingComponent";
import { PANEL_ROUTE } from "models/Constants";

const switchRoutes = (routes: IRoute[]) => (
  <Switch>
    {routes.map((prop: IRoute, key: number) => {
      if (prop.layout === PANEL_ROUTE) {
        return (
          <Route
            exact
            path={prop.layout + (prop.path || prop.url) + (prop.params ? prop.params : "")}
            component={WaitingComponent(prop.component)}
            key={key}
          />
        );
      }
    })}
  </Switch>
);

export default (props: RouteComponentProps) => {
  const [appImage, setAppImage] = useState(image);
  const [color, setColor] = useState("blue");
  const [hasImage, setHasImage] = useState(true);
  const [fixedClasses, setFixedClasses] = useState("dropdown");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currRoutes, setCurrRoutes] =
    useState([...routes.filter(prop => prop.layout === PANEL_ROUTE), ...appRoutes.common]);
  const [sidebarRoutes, setSidebarRoutes] = useState(routes.filter(prop => prop.layout === PANEL_ROUTE) as IRoute[]);
  const [currentApp, setCurrentApp] = useState(null as string | null);

  const handleImageClick = (image: any) => {
    setAppImage(image);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getRoute = () => {
    return props.location.pathname !== "/admin/maps";
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const dispose = useDisposable(() =>
    reaction(() => App.currentApp && App.currentApp.title, (app?: string | null) => {
      console.log('effect==========', App.currentApp, App.appRoutes);
      setCurrentApp(app ? app : null);
      setCurrRoutes([...routes.filter(prop => prop.layout === PANEL_ROUTE), ...appRoutes.common, ...App.appRoutes]);
      setSidebarRoutes([...routes.filter(prop => prop.layout === PANEL_ROUTE), ...App.appRoutes]);
    })
  );

  useEffect(() => {
    window.addEventListener("resize", resizeFunction);
    return () => {
      window.removeEventListener("resize", resizeFunction);
      dispose();
    };
  }, []);

  useEffect(() => {
    if(mobileOpen) {
      setMobileOpen(false);
    }
  }, [props.history.location, props.location]);

  const classes = dashboardStyle();

  console.log('Admin=======', currentApp);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={sidebarRoutes}
        currentApp={currentApp}
        logoText={"ebInSolut"}
        logo={logo}
        image={appImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
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
        {getRoute() ? <Footer/> : null}
      </ScrollContainer>
    </div>
  );
};
