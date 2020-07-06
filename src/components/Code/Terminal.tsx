import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { blackOpacity, whiteOpacity } from 'assets/jss/material-dashboard-react';

const useStyles = makeStyles({
  root: {
    borderRadius: 4,
    width: '100%',
    backgroundColor: blackOpacity(.6),
    color: 'white',
    padding: '15px 10px',
    fontWeight: 'bolder',
    fontSize: 15
  }
});

const Terminal: React.FC = ({children}) => {
  const classes = useStyles();
  return <Typography className={classes.root}>{children}</Typography>
}

export default Terminal;
