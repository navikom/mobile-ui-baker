/* eslint-disable */
import React, { Suspense } from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
// creates a beautiful scrollbar
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
//utils
import { lazy } from "utils";

// core components
const Nav = lazy(() => import("components/Navbars/MainNav"));
const Footer = lazy(() => import("components/Footer/MainFooter"));

import routes from "routes.ts";

import mainStyle from "assets/jss/material-dashboard-react/layouts/mainStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import { IRoute } from "interfaces/IRoute";
import WaitingComponent from "hocs/WaitingComponent";

const switchRoutes = (
  <Switch>
    {routes.map((prop: IRoute, key) => {
      if (prop.layout === "/main") {
        return (
          <Route
            path={prop.path}
            component={WaitingComponent(prop.component)}
            key={key}
          />
        );
      }
    })}
  </Switch>
);

interface MainProps extends RouteComponentProps, WithStyles<typeof mainStyle> {}

type MainState = {
  image: any,
  color: string,
  hasImage: boolean,
  mobileOpen: boolean
}

class Main extends React.Component<MainProps, MainState> {
  private wHeight: number;

  constructor(props: MainProps) {
    super(props);
    this.state = {
      image: image,
      color: "blue",
      hasImage: true,
      mobileOpen: false
    };
    this.wHeight = window.innerHeight;
  }

  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({mobileOpen: false});
    }
    this.wHeight = window.innerHeight;
  };

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      // const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener("resize", this.resizeFunction);
  }

  componentDidUpdate(e: MainProps) {
    if (e.history.location.pathname !== e.location.pathname) {
      // this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({mobileOpen: false});
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen});
  };

  render() {
    const {classes, ...rest} = this.props;
    const backgroundImage = `url(${image})`;
    return (
      <div className={classes.wrapper}>
        <div className={classes.fullPage} style={{backgroundImage}}>
          <div className={classes.content}>
              <Nav routes={routes} handleDrawerToggle={this.handleDrawerToggle} {...rest} />
              <div className={classes.container} style={{marginTop: `${this.wHeight * .15}px`}}>{switchRoutes}</div>
              <Footer/>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(mainStyle)(Main);
