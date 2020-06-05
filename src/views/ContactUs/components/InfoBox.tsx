import React from 'react';
import { withStyles } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Box = withStyles(theme => ({
  root: {
    color: '#31708f',
    backgroundColor: '#d9edf7',
    border: '1px solid #bce8f1',
    padding: 15,
    marginBottom: 20
  }
}))(MuiAlert);

type InfoBoxProps = AlertProps

const InfoBox: React.FC<InfoBoxProps> = (props) => {
  return (
    <Box icon={false} {...props} />
  )
}

export default InfoBox;
