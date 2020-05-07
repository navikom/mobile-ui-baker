import React from "react";
// @material-ui/core components
import Grid, { GridProps } from "@material-ui/core/Grid";
import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => createStyles({
  grid: {
    padding: "0 15px",
  }
}));

const GridItem: React.FC<GridProps> = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <Grid item {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default GridItem;
