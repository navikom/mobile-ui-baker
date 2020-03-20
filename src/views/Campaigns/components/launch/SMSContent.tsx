import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { IContentSMSView } from "interfaces/IContentStep";
import MobileDeviceComponent from "views/Campaigns/components/content/device/MobileDeviceComponent";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    letterWrapper: {
      border: "1px solid rgba(0,0,0,.1)",
      minHeight: theme.typography.pxToRem(100),
      padding: theme.spacing(1),
      overflowY: "auto"
    }
  })
);

function SMSContent(props: { store: IContentSMSView }) {
  const classes = useStyles();
  return (
    <Grid container className={classes.letterWrapper} justify="center">
      <MobileDeviceComponent variant={props.store.variant} justify="center" />
    </Grid>
  );
}

export default SMSContent;
