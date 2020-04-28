import {
  container,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor
} from 'assets/jss/material-dashboard-react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const title = {
  ...defaultFont,
  lineHeight: '30px',
  fontSize: '24px',
  borderRadius: '3px',
  color: whiteColor,
  margin: '0',
  '&:hover,&:focus': {
    background: 'transparent',
    color: whiteColor,
    opacity: 0.7
  }
};

const headerStyle = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      borderBottom: '0',
      marginBottom: '0',
      position: 'absolute',
      width: '100%',
      paddingTop: '10px',
      zIndex: 1029,
      color: grayColor[7],
      border: '0',
      borderRadius: '3px',
      padding: '10px 0',
      transition: 'all 150ms ease 0s',
      minHeight: '50px',
      display: 'block'
    },
    container: {
      ...container,
      minHeight: '50px'
    },
    flex: {
      flex: 1
    },
    title: {
      ...title,
      textTransform: 'none'
    },
    adminTitle: {
      ...title,
      color: 'inherit',
      textTransform: 'none'
    },
    link: {
      ...title,
      textTransform: 'none',
      lineHeight: '20px',
      fontSize: '17px'
    },
    active: {
      fontWeight: 500,
      textDecoration: 'underline',
      textUnderlinePosition: 'under'
    },
    appResponsive: {
      top: '8px'
    },
    primary: {
      backgroundColor: primaryColor[0],
      color: whiteColor,
      ...defaultBoxShadow
    },
    info: {
      backgroundColor: infoColor[0],
      color: whiteColor,
      ...defaultBoxShadow
    },
    success: {
      backgroundColor: successColor[0],
      color: whiteColor,
      ...defaultBoxShadow
    },
    warning: {
      backgroundColor: warningColor[0],
      color: whiteColor,
      ...defaultBoxShadow
    },
    danger: {
      backgroundColor: dangerColor[0],
      color: whiteColor,
      ...defaultBoxShadow
    },
    manager: {
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      },
      display: 'inline-block'
    }
  })
);

export default headerStyle;
