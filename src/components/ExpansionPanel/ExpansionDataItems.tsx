import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React from "react";

const useInfoStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.typography.pxToRem(20)
    },
    label: {
      opacity: 0.4,
      fontWeight: 600
    },
    wrapper: {
      position: "relative",
      paddingLeft: theme.spacing(4),
      marginTop: theme.typography.pxToRem(20)
    },
    nested: {
      "&:after": {
        content: "''",
        position: "absolute",
        left: "15px",
        top: "-5px",
        height: "15px",
        width: "1px",
        borderLeft: "1px dashed #ccc"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        top: "10px",
        left: "15px",
        width: "15px",
        height: "1px",
        borderBottom: "1px dashed #ccc"
      }
    }
  })
);

export const ExpansionDataItems = ({ ...props }) => {
  const classes = useInfoStyles();
  return (
    <Grid container className={classes.wrapper}>
      <Grid container className={classes.nested} direction="row">
        <Grid item className={classes.label}>
          {props.title}:&nbsp;
        </Grid>
        <Grid item>{props.data}</Grid>
      </Grid>
    </Grid>
  );
};
