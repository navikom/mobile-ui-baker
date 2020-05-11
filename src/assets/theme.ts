import { createMuiTheme } from '@material-ui/core';
import {
  blackOpacity,
  dangerColor,
  infoColor,
  primaryColor,
  whiteColor
} from 'assets/jss/material-dashboard-react';

export default createMuiTheme({
  palette: {
    primary: { main: primaryColor[0] },
    secondary: { main: infoColor[0] },
    background: { default: '#eeeeee' },
    error: { main: dangerColor[0] }
  },
  overrides: {
    MuiButtonBase: {
      root: {
        color: blackOpacity(0.4)
      }
    },
    MuiButton: {
      root: {
        color: blackOpacity(0.4)
      },
      containedSecondary: {
        color: whiteColor
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '11px 12px',
        "&:hover,&:after": {
          borderColor: primaryColor[1]
        }
      },
      adornedStart: {
        paddingLeft: 'none'
      },
      adornedEnd: {
        paddingRight: 'none'
      }
    },
    MuiInputLabel: {
      outlined: {
        transform: 'translate(14px, 13px) scale(1)'
      }
    },
    MuiInputAdornment: {
      positionEnd: {
        marginLeft: 0
      }
    },
    MuiBadge: {
      badge: {
        border: '1px solid ' + whiteColor
      },
      anchorOriginTopRightRectangle: {
        transform: 'scale(1) translate(48%, -48%)'
      }
    },
    MuiIconButton: {
      root: {
        color: blackOpacity(0.4)
      }
    },
    MuiSvgIcon: {
      fontSizeSmall: {
        fontSize: '0.8rem'
      }
    },
    MuiPaper: {
      elevation4: {
        boxShadow:
          '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.02)'
      }
    },
    MuiFormLabel: {
      root: {
        fontSize: '0.8rem'
      }
    }
  }
});
