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
    height: '500px',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      height: '250px'
    }
  },
  img: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: 'auto',
    height: '100%',
  },
  imgHighlight: {
    position: 'absolute',
    width: 97,
    left: 109,
    top: 149,
    opacity: 0,
    animation: '$Button-loop 11s ease-in-out infinite',
    [theme.breakpoints.down('md')]: {
      width: 50,
      left: 54,
      top: 73,
      animation: '$Button-loop 11s ease-in-out infinite',
    }
  },
  imgPointer: {
    position: 'absolute',
    width: 30,
    left: 146,
    top: 178,
    animation: '$Pointer 11s ease-in-out infinite',
    [theme.breakpoints.down('md')]: {
      width: 25,
      left: 69,
      top: 90,
      animation: '$Pointer-small 11s ease-in-out infinite',
    }
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
      left: 345,
    },
    '10%': {
      left: 345
    },
    '20%': {
      left: 146
    },
    '80%': {
      left: 146
    },
    '90%': {
      left: 345,
    },
    '100%': {
      left: 345,
    },
  },
  '@keyframes Pointer-small': {
    '0%': {
      left: 162,
    },
    '10%': {
      left: 162
    },
    '20%': {
      left: 69
    },
    '80%': {
      left: 69
    },
    '90%': {
      left: 162,
    },
    '100%': {
      left: 162,
    },
  },
  '@keyframes Button-loop': {
    '0%': {
      opacity: 0,
    },
    '18%': {
      opacity: 0,
    },
    '22%': {
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
