import React from 'react';
import classNames from 'classnames';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.drawer + 1,
    },
    img: {
      position: 'absolute',
      width: 100,
      height: 100,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%) !important',
      animation: '$Img 9s ease-in-out infinite',
    },
    img0: {
    },
    img1: {
      animationDelay: '-3s'
    },
    img2: {
      animationDelay: '-5s'
    },
    '@keyframes Img': {
      '0%': {
        opacity: 0,
      },
      '50%': {
        opacity: 1,
      },
      '100%': {
        opacity: 0,
      }
    }
  })
);

const CustomBackdrop: React.FC<{ open: boolean; progress?: number | null}> = ({ open, progress }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.root} open={open}>
      {
        ['/images/facets_poqhyp-red.png', '/images/facets_poqhyp-blue.png', '/images/facets_poqhyp-green.png']
          .map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Facets UI"
              className={classNames(classes.img, classes[`img` + i as 'img0'])} />
          ))
      }
      {
        progress !== undefined && progress !== null && (
          <CircularProgress
            thickness={1}
            size={120}
            variant="static"
            value={progress}
          />
        )
      }
    </Backdrop>
  )
};

export default CustomBackdrop;
