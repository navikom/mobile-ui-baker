/* eslint-disable */
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
// @material-ui/core
import { makeStyles } from '@material-ui/core/styles';
// core components
import HeaderLinks from '../components/Header/HeaderLinks';
import Header from '../components/Header/Header';
import Footer from 'components/Footer/LandingFooter';
// routes
import routes from 'routes';

// interfaces
import { IRoute } from 'interfaces/IRoute';

import WaitingComponent from 'hocs/WaitingComponent';

// models
import { TITLE } from '../models/Constants';

import useStyles from 'assets/jss/material-kit-react/layouts/mainStyle';
import image from 'assets/img/bg7.jpg';

const switchRoutes = (
  <Switch>
    {routes.map((prop: IRoute, key) => {
      if (prop.layout === '/main') {
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

const Main: React.FC<RouteComponentProps> = (props) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Header
        absolute
        color="transparent"
        brand={TITLE}
        rightLinks={<HeaderLinks {...props} />}
        {...props}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          {switchRoutes}
        </div>
        <Footer whiteFont />
      </div>
    </React.Fragment>
  )
};

export default Main;
