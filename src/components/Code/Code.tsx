import React from 'react';
import { makeStyles } from '@material-ui/core';
import { blackOpacity, dangerColor } from '../../assets/jss/material-dashboard-react';

const useStyles = makeStyles(theme => ({
  code: {
    color: dangerColor[0],
    backgroundColor: blackOpacity(.06),
    padding: '1px 4px',
    borderRadius: 3
  }
}));

const Code: React.FC = ({children}) => {
  const classes = useStyles();
  return <code className={classes.code}>{children}</code>;
}

export default Code;
