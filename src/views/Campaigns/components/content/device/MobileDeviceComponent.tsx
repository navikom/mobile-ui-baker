import React, { useState } from "react";
import classNames from "classnames";

// @material-ui/icons
import { Android, Apple } from "@material-ui/icons";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

// assets
import { blackOpacity } from "assets/jss/material-dashboard-react";
import AndroidWrapper from "assets/img/device/gpixel_outer.png";
import IOSWrapper from "assets/img/device/iphone_6_outer.png";

// components
import SMSChannelComponent from "views/Campaigns/components/content/device/SMSChannelComponent";
import InAppChannelComponent from "views/Campaigns/components/content/device/InAppChannelComponent";
import PushChannelComponent from "views/Campaigns/components/content/device/PushChannelComponent";

// interfaces
import { MobileVariantType } from "interfaces/IVariant";

// models
import { PUSH_CHANNEL, SMS_CHANNEL } from "models/Constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      margin: "8px 0",
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.typography.pxToRem(3),
      boxShadow: "0 1px 4px 0 " + blackOpacity(0.14)
    },
    container: {
      padding: theme.spacing(3)
    },
    wrapper: {
      position: "relative",
      width: theme.typography.pxToRem(303),
      backgroundRepeat: "no-repeat",
      backgroundSize: "100%",
      marginTop: theme.spacing(2)
    },
    inner: {
      position: "absolute",
      top: theme.typography.pxToRem(72),
      left: theme.typography.pxToRem(19),
      width: "calc(100% - 38px)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100%"
    }
  })
);

const androidStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: theme.typography.pxToRem(617),
      backgroundImage: `url(${AndroidWrapper})`
    }
  })
);

const iosStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: theme.typography.pxToRem(620),
      backgroundImage: `url(${IOSWrapper})`
    }
  })
);

type DeviceType = {
  ios: boolean;
  variant: MobileVariantType;
};

function DeviceComponent(props: DeviceType) {
  const { ios, variant } = props;
  const classes = useStyles();
  const extraClasses = ios ? iosStyles() : androidStyles();
  const wrapper = classNames(classes.wrapper, extraClasses.wrapper);
  return (
    <div className={classes.container}>
      <div className={wrapper}>
        {variant.channel === SMS_CHANNEL ? (
          <SMSChannelComponent {...props} />
        ) : variant.channel === PUSH_CHANNEL ? (
          <PushChannelComponent {...props} />
        ) : (
          <InAppChannelComponent {...props} />
        )}
      </div>
    </div>
  );
}

function MobileDeviceComponent(props: {
  variant: MobileVariantType;
  justify: "flex-end" | "center";
}) {
  const [ios, setIOS] = useState(true);
  const classes = useStyles();
  const { justify, ...rest } = props;
  return (
    <Grid container justify={justify}>
      <Grid className={classes.root}>
        <Grid container justify="flex-end">
          <ButtonGroup variant="outlined" size="small">
            <Button
              color={ios ? "default" : "primary"}
              onClick={() => setIOS(false)}
            >
              <Android />
            </Button>
            <Button
              color={!ios ? "default" : "primary"}
              onClick={() => setIOS(true)}
            >
              <Apple />
            </Button>
          </ButtonGroup>
        </Grid>
        <DeviceComponent ios={ios} {...rest} />
      </Grid>
    </Grid>
  );
}

export default MobileDeviceComponent;
