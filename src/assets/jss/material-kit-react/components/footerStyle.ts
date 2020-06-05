import { container, primaryColor } from 'assets/jss/material-kit-react';
import { createStyles } from '@material-ui/core';
import { whiteColor } from '../../material-dashboard-react';

const footerStyle = createStyles({
  block: {
    color: 'inherit',
    padding: '0.5375rem',
    fontWeight: 500,
    fontSize: '12px',
    textTransform: 'uppercase',
    borderRadius: '3px',
    textDecoration: 'none',
    position: 'relative',
    display: 'block',
  },
  left: {
    float: 'left',
    display: 'block'
  },
  right: {
    padding: '15px 0',
    margin: '0',
  },
  footer: {
    padding: '.9375rem 1.9375rem',
    textAlign: 'center',
    display: 'flex',
    zIndex: 1,
    position: 'relative',
    backgroundColor: whiteColor
  },
  darkBlue: {
    backgroundColor: '#36275d'
  },
  a: {
    color: primaryColor,
    textDecoration: 'none',
    backgroundColor: 'transparent'
  },
  shift: {
    margin: '0 5px'
  },
  footerWhiteFont: {
    '&,&:hover,&:focus': {
      color: '#FFFFFF'
    }
  },
  container: {
    ...container,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  list: {
    marginBottom: '0',
    padding: '20px 0',
    marginTop: '0'
  },
  listRight: {
    marginLeft: 35
  },
  inlineBlock: {
    display: 'inline-block',
    padding: '0px',
    width: 'auto'
  },
  colBlock: {
    color: '#3C4858',
    padding: '0px',
    width: 'auto'
  },
  icon: {
    width: '28px',
    height: '18px',
    position: 'relative',
    top: -3
  },
});
export default footerStyle;
