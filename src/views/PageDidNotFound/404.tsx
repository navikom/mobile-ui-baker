import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// @material-ui/icons

// core components
import Header from 'components/Header/Header';
import HeaderLinks from 'components/Header/HeaderLinks';
import Parallax from 'components/Parallax/Parallax';

import styles from 'assets/jss/material-kit-react/views/landingPage';

// Sections for this page
import { TITLE } from 'models/Constants';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Footer from 'components/Footer/LandingFooter';
import useScreenSize from 'hooks/useScreenSize';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(styles);

const PageDidNotFound: React.FC<RouteComponentProps> = (props) => {
  const isMobile = useScreenSize();
  const classes = useStyles();
  return (
    <React.Fragment>
      <Header
        color="transparent"
        brand={TITLE.toUpperCase()}
        rightLinks={<HeaderLinks {...props} />}
        fixed
        {...props}
      />
      <Parallax filter image={require('assets/img/landing-bg.jpg')}>
        <div className={classes.container}>
          <Grid container justify="center">
              <h1 style={{fontSize: 100}}>404</h1>
          </Grid>
          <Grid container justify="center">
            <h4>{Dictionary.defValue(DictionaryService.keys.thePageYouRequestedDidNot)}.</h4>
          </Grid>
        </div>
      </Parallax>
      <Footer isMobile={isMobile} />
    </React.Fragment>
  );
};

export default PageDidNotFound;
