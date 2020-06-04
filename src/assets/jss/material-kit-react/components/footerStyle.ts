import { container, primaryColor } from 'assets/jss/material-kit-react';
import { createStyles } from '@material-ui/core';

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
    padding: '2.5375rem 1.9375rem .9375rem',
    textAlign: 'center',
    display: 'flex',
    zIndex: 2,
    position: 'relative',
  },
  darkBlue: {
    backgroundColor: '#36275d'
  },
  a: {
    color: primaryColor,
    textDecoration: 'none',
    backgroundColor: 'transparent'
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
    marginLeft: 15
  },
  inlineBlock: {
    display: 'inline-block',
    padding: '0px',
    width: 'auto'
  },
  colBlock: {
    padding: '0px',
    width: 'auto'
  },
  icon: {
    width: '28px',
    height: '18px',
    position: 'relative',
    top: -3
  }
});
export default footerStyle;
