import React from "react";
// @material-ui/core components
import Grid, { GridProps } from "@material-ui/core/Grid";
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => createStyles({
  grid: {
    margin: "0 -15px",
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      margin: "0",
    }
  }
}));

const GridContainer: React.FC<GridProps> = ({children, ...rest}) => {
  const classes = useStyles();
  return (
    <Grid container {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default GridContainer;
