import classNames from "classnames";
import React from "react";
import moment from "moment";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AndroidWrapper from "assets/img/device/gpixel_outer.png";
import AndroidWrapperLand from "assets/img/device/gpixel_outer_land.png";
import IOSWrapper from "assets/img/device/iphone_6_outer.png";
import IOSWrapperLand from "assets/img/device/iphone_6_outer_land.png";
import { blackOpacity, whiteColor } from "assets/jss/material-dashboard-react";
import { IBackgroundColor, Mode } from "views/Editor/store/EditorViewStore";
import AndroidPixelInner from "components/Icons/AndroidPixelInner";
import IPhone6Inner from "components/Icons/IPhone6Inner";
import AndroidPixelNavBar from "components/Icons/AndroidPixelNavBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
      overflow: "auto"
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
      overflowY: "hidden",
    },
    text: {
      color: whiteColor
    },
    textBlack: {
      color: blackOpacity(0.9)
    },
  })
);

const androidStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: theme.typography.pxToRem(617),
      backgroundImage: `url(${AndroidWrapper})`,
    },
    inner: {
      height: theme.typography.pxToRem(484),
    },
    landscape: {
      backgroundImage: `url(${AndroidWrapperLand})`,
      height: theme.typography.pxToRem(303),
      width: theme.typography.pxToRem(620),
    },
    landscapeInner: {
      top: theme.typography.pxToRem(18),
      left: theme.typography.pxToRem(62),
      height: theme.typography.pxToRem(271),
      width: theme.typography.pxToRem(490),
    },
    time: {
      position: "absolute",
      right: theme.typography.pxToRem(2),
      fontSize: theme.typography.pxToRem(13)
    },
    content: {
      width: "100%",
      marginTop: "6.8%",
      height: "90%",
      marginLeft: theme.typography.pxToRem(1)
    },
    contentLandscape: {
      marginTop: "3.7%",
      height: "93%"
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
      height: theme.typography.pxToRem(490),
      top: theme.typography.pxToRem(55),
      left: theme.typography.pxToRem(15),
    },
    landscape: {
      backgroundImage: `url(${IOSWrapperLand})`,
      height: theme.typography.pxToRem(303),
      width: theme.typography.pxToRem(620),
    },
    landscapeInner: {
      top: theme.typography.pxToRem(21),
      left: theme.typography.pxToRem(60),
      height: theme.typography.pxToRem(260),
      width: theme.typography.pxToRem(490),
    },
    topBar: {
      position: "absolute",
      top: theme.typography.pxToRem(17)
    },
    content: {
      width: "100%",
      height: "97%",
    }
  })
);

const IOSDevice: React.FC<DeviceComponentProps> = (
  {
    children,
    background,
    mode,
    statusBarColor,
    portrait
  }) => {
  const classes = useStyles();
  const extraClasses = iosStyles();
  const inner = classNames(classes.inner, extraClasses.inner, {
    [extraClasses.landscapeInner]: !portrait,
  });
  const content = classNames(extraClasses.topBar, extraClasses.content);
  return (
    <Grid className={inner}>
      <IPhone6Inner
        width={portrait? undefined : 490}
        height={portrait? undefined : 260}
        style={{position: "absolute"}}
        mode={mode}
        background={background.backgroundColor}
        statusBarColor={statusBarColor}/>
      <Grid container className={content} justify="space-between" style={{ ...background }}>
        {children}
      </Grid>
    </Grid>
  )
};

const AndroidDevice: React.FC<DeviceComponentProps> = (
  {
    children,
    background,
    statusBarColor,
    mode,
    portrait
  }) => {
  const classes = useStyles();
  const extraClasses = androidStyles();
  const inner = classNames(classes.inner, extraClasses.inner, {
    [extraClasses.landscapeInner]: !portrait,
  });
  const time = moment().format("HH:mm");
  const timeStyle = classNames(mode === Mode.DARK ? classes.text : classes.textBlack, extraClasses.time);
  const content = classNames(extraClasses.content, {
    [extraClasses.contentLandscape]: !portrait
  });
  const navbar = portrait ?
    { bottom: 0 } : { transform: "rotate(-90deg)", right: -230, height: 271 };
  return (
    <div className={inner}>
      <AndroidPixelInner
        width={portrait? undefined : 490}
        style={{position: "absolute"}}
        mode={mode}
        background={background.backgroundColor}
        statusBarColor={statusBarColor}/>
      <AndroidPixelNavBar
        width={portrait? undefined : 490}
        style={{position: "absolute", ...navbar}}
        mode={mode}
        background={background.backgroundColor}
        statusBarColor={statusBarColor}/>
      <Typography className={timeStyle}>{time}</Typography>
      <div className={content} style={{ ...background }}>
        {children}
      </div>
    </div>
  )
};

interface DeviceComponentProps {
  ios?: boolean;
  mode: Mode;
  statusBarColor: string;
  background: IBackgroundColor;
  portrait: boolean;
}

const DeviceComponent: React.FC<DeviceComponentProps> = (
  { ios, children, mode, statusBarColor, background, portrait }) => {
  const classes = useStyles();
  const extraClasses = ios ? iosStyles() : androidStyles();
  const wrapper = classNames(classes.wrapper, extraClasses.wrapper, {
    [extraClasses.landscape]: !portrait
  });
  return (
    <Grid container className={classes.container} justify="center">
      <div className={wrapper}>
        {ios ?
          <IOSDevice children={children} mode={mode} background={background} statusBarColor={statusBarColor} portrait={portrait} /> :
          <AndroidDevice children={children} mode={mode} background={background} statusBarColor={statusBarColor} portrait={portrait} />}
      </div>
    </Grid>
  );
};

export default DeviceComponent;
