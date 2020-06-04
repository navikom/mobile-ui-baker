/* eslint-disable */
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import classNames from 'classnames';

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
import { TITLE } from 'models/Constants';
import CookiePopup from 'components/CookiePopup';
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
  const pageHeaderClasses = classNames(classes.pageHeader, classes.gradientLightBlue);
  return (
    <React.Fragment>
      <Header
        fixed
        color="transparent"
        brand={TITLE.toUpperCase()}
        rightLinks={<HeaderLinks {...props} />}
        changeColorOnScroll={{
          height: 200,
          color: 'white'
        }}
        {...props}
      />
      <div>
        <div className={pageHeaderClasses}/>
        <div className={classes.container}>
          {switchRoutes}
        </div>
        <Footer whiteFont darkBlue />
      </div>
      <CookiePopup />
    </React.Fragment>
  )
};

export default Main;
