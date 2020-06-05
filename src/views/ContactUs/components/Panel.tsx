import { withStyles } from '@material-ui/core';
import { blackOpacity } from '../../../assets/jss/material-dashboard-react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

const Panel = withStyles(theme => ({
  root: {
    padding: '0 30px',
    boxShadow: 'none',
    '&:before': {
      height: 0
    },
    '&:after': {
      bottom: 1,
      left: 0,
      right: 0,
      height: 1,
      content: '""',
      opacity: 1,
      position: 'absolute',
      transition: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      backgroundColor: blackOpacity(.12)
    }
  }
}))(ExpansionPanel);

export const PanelSummary = withStyles(theme => ({
  root: {
    color: '#444444',
    fontSize: 16
  }
}))(ExpansionPanelSummary);

export const PanelDetails = withStyles(theme => ({
  root: {
    color: '#444444',
    fontSize: 14,
    display: 'initial'
  }
}))(ExpansionPanelDetails);

export const PanelActions = withStyles(theme => ({
  root: {
    justifyContent: 'center'
  }
}))(ExpansionPanelActions);

export default Panel;
