import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';
import { whiteColor } from 'assets/jss/material-dashboard-react';

const animationTime = 20;

const useStyles = makeStyles((theme: Theme) => ({

  laptopWrapper: {
    left: -51,
    [theme.breakpoints.down('md')]: {
      left: 21
    },
  },
  cover: {
    position: 'absolute',
    width: 575,
    height: 345,
    top: 20,
    left: -24,
    backgroundColor: whiteColor,
    opacity: 0,
    animation: `$Cover ${animationTime}s linear infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none',
      opacity: 0,
    }
  },
  image: {
    width: '100%',
    height: '100%'
  },
  img: {
    position: 'absolute',
    width: 117,
    left: 205,
    top: 92,
    transform: ' translate(189px, -78px) scale(0.05)',
    opacity: 0,
  },
  img0: {
    animation: `$Img0 ${animationTime}s ease-in-out infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none'
    }
  },
  img1: {
    animation: `$Img1 ${animationTime}s ease-in-out infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none'
    }
  },
  img2: {
    animation: `$Img2 ${animationTime}s ease-in-out infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none'
    }
  },
  img3: {
    animation: `$Img3 ${animationTime}s ease-in-out infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none'
    }
  },
  img4: {
    animation: `$Img4 ${animationTime}s ease-in-out infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none',
      opacity: 0,
    }
  },
  img5: {
    animation: `$Img5 ${animationTime}s ease-in-out infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none',
      opacity: 0,
    }
  },
  figmaPopup: {
    position: 'absolute',
    top: 69,
    left: 409,
    width: 123,
    height: 77,
    opacity: 1,
    animation: `$FigmaPopup ${animationTime}s linear infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none',
      opacity: 0,
    }
  },
  figmaLogo: {
    position: 'absolute',
    width: 50,
    height: 70,
    left: 240,
    top: 155,
    animation: `$Figma ${animationTime}s linear infinite`,
    [theme.breakpoints.down('md')]: {
      animation: 'none',
      opacity: 0,
    }
  },
  '@keyframes Figma': {
    '0%': {
      opacity: 1,
      transform: 'scale(1)',
      left: 240,
      top: 155,
    },
    '3%': {
      transform: 'scale(1.2)',
    },
    '6%': {
      transform: 'scale(1)',
    },
    '9%': {
      transform: 'scale(1.2)',
    },
    '12%': {
      transform: 'scale(1)',
    },
    '15%': {
      transform: 'scale(1.2)',
    },
    '18%': {
      transform: 'scale(1)',
    },
    '21%': {
      transform: 'scale(1.2)',
    },
    '24%': {
      transform: 'scale(1)',
    },
    '27%': {
      transform: 'scale(1.2)',
    },
    '30%': {
      transform: 'scale(1)',
      left: 240,
      top: 155,
    },
    '31%': {
      transform: 'scale(0.14)',
      left: 428,
      top: 79,
    },
    '79%': {
      opacity: 1,
    },
    '80%': {
      opacity: 0,
    },
    '95%': {
      transform: 'scale(0.14)',
      opacity: 0,
      left: 428,
      top: 79,
    },
    '96%': {
      opacity: 0,
      left: 240,
      top: 155,
      transform: 'scale(1)',
    }
  },
  '@keyframes FigmaPopup': {
    '0%': {
      opacity: 0,
    },
    '30%': {
      opacity: 0,
    },
    '31%': {
      opacity: 1,
    },
    '82%': {
      opacity: 1,
    },
    '86%': {
      opacity: 0,
    },
    '100%': {
      opacity: 0,
    },
  },
  '@keyframes Cover': {
    '0%': {
      opacity: 0.8,
    },
    '30%': {
      opacity: 0.8,
    },
    '31%': {
      opacity: 0,
    },
    '93%': {
      opacity: 0,
    },
    '94%': {
      opacity: 0.8,
    },
    '100%': {
      opacity: 0.8,
    },
  },
  '@keyframes Img0': {
    '0%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '32%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '36%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '90%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate(0, 0) scale(1)',
    },
  },
  '@keyframes Img1': {
    '0%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '36%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '40%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '90%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate(0, 0) scale(1)',
    },
  },
  '@keyframes Img2': {
    '0%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '40%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '44%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '90%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate(0, 0) scale(1)',
    },
  },
  '@keyframes Img3': {
    '0%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '44%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '48%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '90%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate(0, 0) scale(1)',
    },
  },
  '@keyframes Img4': {
    '0%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '48%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '52%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '90%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate(0, 0) scale(1)',
    },
  },
  '@keyframes Img5': {
    '0%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '52%': {
      transform: 'translate(189px, -78px) scale(0.05)',
      opacity: 0,
    },
    '56%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '90%': {
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate(0, 0) scale(1)',
    },
  }
}));

export default useStyles;
