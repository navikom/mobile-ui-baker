import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import styles from './editorStyle';
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { container, title } from 'assets/jss/material-kit-react';
import { Grid } from '@material-ui/core';
import { whiteColor, whiteOpacity } from '../../../assets/jss/material-dashboard-react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';

const useStyles = makeStyles(theme => ({
  section: {
    padding: '70px 0',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  root: {
    background: 'radial-gradient(ellipse at center,#585858 0,#232323 100%)',
    backgroundColor: '#343434'
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
  imgWrapper: {
    height: theme.typography.pxToRem(660),
    position: 'relative',
    maxWidth: theme.typography.pxToRem(1040),
    marginTop: theme.typography.pxToRem(-140),
  },
  img: {
    maxWidth: theme.typography.pxToRem(1040),
    position: 'absolute',
    top: 0,
    right: 0
  },
  wrapper: {
    marginLeft: 'auto'
  },
  descriptionWrapper: {
    marginTop: theme.typography.pxToRem(130),
  },
  title: {
    ...title,
    color: whiteColor,
    marginTop: theme.typography.pxToRem(30)
  },
  subTitle: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    color: whiteColor,
    fontWeight: 500,
  },
  description: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    color: whiteOpacity(.8)
  }
}))


const BgImage = '/images/bg-3d.png';

export default function ShareSection() {
  const classes = useStyles();
  return (
    <div className={classNames(classes.section, classes.root)}>
      <div className={classes.container}>
        <Grid container justify="center">
          <Grid item xs={12} sm={7} md={7}>
            <div className={classes.imgWrapper}>
              <LazyLoadImage
                className={classes.img}
                src={BgImage}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={5} md={4} className={classes.wrapper}>
            <div className={classes.descriptionWrapper}>
              <h3 className={classes.title}>{Dictionary.defValue(DictionaryService.keys.embeddedViewer)}</h3>
              <h6 className={classes.subTitle}>
                {Dictionary.defValue(DictionaryService.keys.forReadOrEdit).toUpperCase()}
              </h6>
              <h5 className={classes.description}>
                {Dictionary.defValue(DictionaryService.keys.youCanStartCollaborate)}
              </h5>
            </div>
          </Grid>
        </Grid>

      </div>
    </div>
  )
}
