import { createStyles, Theme, withStyles } from '@material-ui/core';
import { blackOpacity } from '../../../assets/jss/material-dashboard-react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: blackOpacity(.3),
      color: theme.palette.common.white,
    }
  }),
)(TableCell);

export const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);
