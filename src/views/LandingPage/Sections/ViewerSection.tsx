import React from 'react';
import classNames from 'classnames';
import { Slide, Fade } from 'react-awesome-reveal';
import { Grid } from '@material-ui/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { makeStyles } from '@material-ui/core/styles';
import { container, grayColor, title } from 'assets/jss/material-kit-react';

const useStyles = makeStyles(theme => ({
  section: {
    padding: '70px 0',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  container: {
    zIndex: 12,
    ...container,
    '@media (min-width: 576px)': {
      maxWidth: '540px'
    },
    '@media (min-width: 768px)': {
      maxWidth: '720px'
    },
    '@media (min-width: 992px)': {
      maxWidth: '960px'
    },
    '@media (min-width: 1200px)': {
      maxWidth: '1140px'
    }
  },
  descriptionWrapper: {
    color: grayColor,
    overflow: 'hidden'
  },
  title: {
    ...title,
    marginTop: '60px'
  },
  subTitle: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    marginTop: '5px',
    marginBottom: '30px',
    color: '#999',
    fontWeight: 500
  },
  description: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`
  },
  imgWrapper: {
    position: 'relative',
    height: '500px',
    display: 'flex',
    justifyContent: 'center'
  },
  landing: {
    width: 'auto',
    height: '100%',
    borderRadius: '36px'
  },
  landing1: {
    zIndex: 1,
  },
  landingPre: {
    position: 'absolute',
  },
  landing2: {
    left: -60,
    top: 50,
  },
  landing3: {
    right: -60,
    top: -40,
  },
}));

const Landing_1 = '/images/landing_1.png';
const Landing_2 = '/images/landing_2.png';
const Landing_3 = '/images/landing_3.png';

export default function ViewerSection() {
  const classes = useStyles();
  return (
    <div className={classNames(classes.section)}>
      <div className={classes.container}>
        <Grid container justify="center">
          <Grid item xs={12} sm={5} md={4}>
            <div className={classes.descriptionWrapper}>
              <h3 className={classes.title}>{Dictionary.defValue(DictionaryService.keys.embeddedViewer)}</h3>
              <h6 className={classes.subTitle}>
                {Dictionary.defValue(DictionaryService.keys.previewMobileUIInYour).toUpperCase()}
              </h6>
              <h5 className={classes.description}>
                {Dictionary.defValue(DictionaryService.keys.youNeedToPreviewAMobileInYourSite)}
              </h5>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{ marginLeft: 'auto' }}>
            <div className={classes.imgWrapper}>
              <LazyLoadImage
                className={classNames(classes.landing, classes.landing1)}
                src={Landing_1}
              />
              <Fade direction="top" cascade fraction={0.8} style={{opacity: .5}}>
                <LazyLoadImage
                  className={classNames(classes.landing, classes.landingPre, classes.landing2)}
                  src={Landing_2}
                />
                <LazyLoadImage
                  className={classNames(classes.landing, classes.landingPre, classes.landing3)}
                  src={Landing_3}
                />
              </Fade>
            </div>
          </Grid>
        </Grid>

      </div>
    </div>
  )
}
