import classNames from "classnames";
import React from "react";
import moment from "moment";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AndroidWrapper from "assets/img/device/gpixel_outer.png";
import IOSWrapper from "assets/img/device/iphone_6_outer.png";
import IOSInner from "assets/svg/ios_sms_inner.svg";
import AndroidInnerWhite from "assets/svg/android_sms_inner_white.svg";
import AndroidInnerBlack from "assets/svg/android_sms_inner_black.svg";
import { blackOpacity, whiteColor } from "assets/jss/material-dashboard-react";
import { Mode } from "views/Editor/store/EditorViewStore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
    },
    wrapper: {
      position: "relative",
      width: theme.typography.pxToRem(303),
      backgroundRepeat: "no-repeat",
      backgroundSize: "100%",
    },
    inner: {
      position: "absolute",
      top: theme.typography.pxToRem(59),
      left: theme.typography.pxToRem(14),
      width: "calc(100% - 30px)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      overflowY: 'auto',
    },
    text: {
      color: whiteColor
    },
    textBlack: {
      color: blackOpacity(0.9)
    }
  })
);

const androidStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: theme.typography.pxToRem(617),
      backgroundImage: `url(${AndroidWrapper})`,
    },
    inner: {
      backgroundImage: `url(${AndroidInnerWhite})`,
      height: theme.typography.pxToRem(484),
    },
    innerBlack: {
      backgroundImage: `url(${AndroidInnerBlack})`,
    },
    time: {
      position: "absolute",
      right: theme.typography.pxToRem(2),
      fontSize: theme.typography.pxToRem(13)
    },
    content: {
      width: '100%',
      marginTop: '6%',
      height: '90%',
      marginLeft: theme.typography.pxToRem(1)
    }
  })
);

const iosStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: theme.typography.pxToRem(620),
      backgroundImage: `url(${IOSWrapper})`
    },
    inner: {
      height: theme.typography.pxToRem(493),
      backgroundImage: `url(${IOSInner})`,
      top: theme.typography.pxToRem(58),
      left: theme.typography.pxToRem(15),
    },
    topBar: {
      position: "absolute",
      color: "#007afe",
      top: theme.typography.pxToRem(20)
    },
    content: {
      width: '100%',
      height: '95%',
    }
  })
);

interface IDevice {
  background?: string;
  mode?: Mode;
}

const IOSDevice: React.FC<IDevice> = ({children, background= whiteColor, mode = Mode.WHITE}) => {
  const classes = useStyles();
  const extraClasses = iosStyles();
  const inner = classNames(classes.inner, extraClasses.inner);
  const content = classNames(extraClasses.topBar, extraClasses.content);
  return (
    <Grid className={inner}>
      <Grid container className={content} justify="space-between" style={{backgroundColor: background}}>
        {children}
      </Grid>
    </Grid>
  )
};

const AndroidDevice: React.FC<IDevice> = ({children, background= whiteColor, mode = Mode.WHITE}) => {
  const classes = useStyles();
  const extraClasses = androidStyles();
  const inner = classNames({
    [classes.inner]: true,
    [extraClasses.inner]: true,
    [extraClasses.innerBlack]: mode === Mode.DARK
  });
  const time = moment().format("HH:mm");
  const timeStyle = classNames(mode === Mode.DARK ? classes.text : classes.textBlack, extraClasses.time);
  return (
    <div className={inner}>
      <Typography className={timeStyle}>{time}</Typography>
      <div className={extraClasses.content} style={{backgroundColor: background}}>
        {children}
      </div>
    </div>
  )
};

const DeviceComponent: React.FC<{ios: boolean, mode?: Mode}> = ({ios, children, mode}) => {
  const classes = useStyles();
  const extraClasses = ios ? iosStyles() : androidStyles();
  const wrapper = classNames(classes.wrapper, extraClasses.wrapper);
  return (
    <Grid container className={classes.container} justify="center">
      <div className={wrapper}>
        {ios ? <IOSDevice children={children} mode={mode} /> : <AndroidDevice children={children} mode={mode} />}
      </div>
    </Grid>
  );
};

export default DeviceComponent;
