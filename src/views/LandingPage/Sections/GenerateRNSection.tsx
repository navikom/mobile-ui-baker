import React from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
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
    marginTop: theme.typography.pxToRem(40),
  },
  img: {
    maxWidth: theme.typography.pxToRem(800),
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)'
  },
  imgHighlight: {
    position: 'absolute',
    width: '120px',
    left: '138px',
    top: '188px',
    opacity: 0,
    animation: "$Button-loop 15s ease-in-out infinite"
  },
  imgPointer: {
    position: 'absolute',
    width: '80px',
    left: 365,
    top: 222,
    animation: "$Pointer 15s ease-in-out infinite"
  },
  title: {
    ...title,
    color: whiteColor,
    textAlign: 'center',
    marginTop: theme.typography.pxToRem(30)
  },
  subTitle: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    color: whiteColor,
    fontWeight: 500,
    textAlign: 'center',
  },
  description: {
    fontFamily: `"Roboto Slab", "Times New Roman", serif`,
    textAlign: 'center',
    color: whiteOpacity(.8)
  },
  '@keyframes Pointer': {
    '0%': {
      left: 365,
    },
    '40%': {
      left: 165
    },
    '80%': {
      left: 165
    },
    '100%': {
      left: 365,
    },
  },
  '@keyframes Button-loop': {
    '0%': {
      opacity: 0,
    },
    '30%': {
      opacity: 0,
    },
    '50%': {
      opacity: 1,
    },
    '80%': {
      opacity: 1,
    },
    '90%': {
      opacity: 0,
    },
    '100%': {
      opacity: 0,
    },
  },
}))


const BgImage = '/images/generate-bg.png';
const Highlight = '/images/highlight.png';
const Pointer = '/images/pointer.png';

export default function GenerateRNSection() {
  const classes = useStyles();
  return (
    <div className={classNames(classes.section, classes.root)}>
      <div className={classes.container}>
        <Grid container justify="center">
          <div>
            <h3
              className={classes.title}>{Dictionary.defValue(DictionaryService.keys.translateDesignInToReactNativeCode)}</h3>
            <h6 className={classes.subTitle}>
              {Dictionary.defValue(DictionaryService.keys.mobileApplicationCreationNeverWasSoSimple).toUpperCase()}
            </h6>
            <h5 className={classes.description}>
              {Dictionary.defValue(DictionaryService.keys.justPressTheButtonToConvertMobileApplicationDesignInToReact)}.{' '}
              {Dictionary.defValue(DictionaryService.keys.afterFewMinutesYouCan)}
            </h5>
          </div>
          <div className={classes.imgWrapper}>
            <LazyLoadImage
              className={classes.img}
              src={BgImage}
            />
            <LazyLoadImage
              className={classes.imgHighlight}
              src={Highlight}
            />
            <LazyLoadImage
              className={classes.imgPointer}
              src={Pointer}
            />
          </div>
        </Grid>
      </div>
    </div>
  )
}
