import React from 'react';
import { Route, Switch } from 'react-router-dom';
// creates a beautiful scrollbar
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// @material-ui/core components
import routes from 'routes';


import { IRoute } from 'interfaces/IRoute';
import WaitingComponent from 'hocs/WaitingComponent';
import CookiePopup from '../components/CookiePopup';
import { makeStyles, Typography } from '@material-ui/core';
import { TITLE } from '../models/Constants';
import GridContainer from '../components/Grid/GridContainer';
import classNames from 'classnames';
import { whiteColor } from '../assets/jss/material-dashboard-react';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  header: {
    zIndex: -1,
    minHeight: '100vh',
    height: 'auto',
    display: 'inherit',
    position: 'absolute',
    width: '100%',
    margin: '0',
    padding: '0',
    border: '0',
    alignItems: 'center',
    '&:before': {
      backgroundColor: 'rgba(114,61,255,0.29)'
    },
    '&:before,&:after': {
      position: 'absolute',
      zIndex: 1,
      width: '100%',
      height: '100%',
      display: 'block',
      left: '0',
      top: '0',
      content: '""'
    }
  },
  gradientLightBlue: {
    '&:after': {
      background: 'linear-gradient(-45deg, rgba(156,39,176,0.10) 0%, rgba(28,206,234,0.11) 100%)',
    }
  },
  title: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    color: whiteColor,
  }
}))

const switchRoutes = (
  <Switch>
    {routes.map((prop: IRoute, key) => {
      if (prop.layout === '/empty') {
        return (
          <Route
            path={prop.path}
            component={WaitingComponent(prop.component)}
            key={key}
          />
        );
      }
      return null;
    })}
  </Switch>
);

const Empty: React.FC = () => {
  const classes = useStyles();

  const header = classNames(classes.header, classes.gradientLightBlue);

  return (
    <div className={classes.root}>
      <div className={header}/>
      <Typography variant='h3' align="center" className={classes.title}>
        <b>{TITLE.toUpperCase()}</b>
      </Typography>
      {switchRoutes}
    </div>
  );
}

export default Empty;
