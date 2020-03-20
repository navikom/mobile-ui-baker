import React from "react";
// @material-ui/core components
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Grid, { GridProps } from "@material-ui/core/Grid";
import { createStyles } from "@material-ui/core";

const style = createStyles({
  grid: {
    margin: "0 -15px !important",
    width: "unset"
  }
});

function GridContainer(props: WithStyles<typeof style> & GridProps) {
  const { classes, children, ...rest } = props;
  return (
    <Grid container {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(GridContainer);
