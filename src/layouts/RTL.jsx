/* eslint-disable */
import React, { Suspense } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// utils
import { lazy } from "utils";

// core components
const Navbar = lazy(() => import("Navbar.tsx"));
const Footer = lazy(() => import("Footer.tsx"));
const Sidebar = lazy(() => import("Sidebar.tsx"));
const FixedPlugin = lazy(() => import("components/FixedPlugin/FixedPlugin.jsx"));

import routes from "routes.ts";

import rtlStyle from "assets/jss/material-dashboard-react/layouts/rtlStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

// core containers
const ScrollContainer = lazy(() => import("containers/ScrollContainer/ScrollContainer.tsx"));

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/rtl") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
    })}
  </Switch>
);

class RTL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: image,
      color: "blue",
      hasImage: true,
      fixedClasses: "dropdown ",
      mobileOpen: false
    };
  }

  handleImageClick = image => {
    this.setState({image: image});
  };
  handleColorClick = color => {
    this.setState({color: color});
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({fixedClasses: "dropdown show"});
    } else {
      this.setState({fixedClasses: "dropdown"});
    }
  };
  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen});
  };

  getRoute() {
    return this.props.location.pathname !== "/admin/maps";
  }

  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({mobileOpen: false});
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      if (this.state.mobileOpen) {
        this.setState({mobileOpen: false});
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  render() {
    const {classes, ...rest} = this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"الإبداعية تيم"}
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          rtlActive
          {...rest}
        />
        <ScrollContainer rtl={true}>
          <Navbar
            routes={routes}
            handleDrawerToggle={this.handleDrawerToggle}
            rtlActive
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer/> : null}
          <FixedPlugin
            handleImageClick={this.handleImageClick}
            handleColorClick={this.handleColorClick}
            bgColor={this.state["color"]}
            bgImage={this.state["image"]}
            handleFixedClick={this.handleFixedClick}
            fixedClasses={this.state.fixedClasses}
            rtlActive
          />
        </ScrollContainer>
      </div>
    );
  }
}

RTL.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(rtlStyle)(RTL);
