import classNames from 'classnames';
import React from 'react';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AndroidWrapper from 'assets/img/device/gpixel_outer.png';
import AndroidWrapperLand from 'assets/img/device/gpixel_outer_land.png';
import IOSWrapper from 'assets/img/device/iphone_6_outer.png';
import IOSWrapperLand from 'assets/img/device/iphone_6_outer_land.png';
import { blackOpacity, whiteColor } from 'assets/jss/material-dashboard-react';
import AndroidPixelInner from 'components/Icons/AndroidPixelInner';
import IPhone6Inner from 'components/Icons/IPhone6Inner';
import AndroidPixelNavBar from 'components/Icons/AndroidPixelNavBar';
import { Mode } from 'enums/ModeEnum';
import { DeviceComponentProps } from './DeviceComponent';

const android = { width: 360, height: 640 };
const iphoneSE = { width: 320, height: 568 };

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3),
      overflow: 'auto',
    },
    wrapper: {
      position: 'relative',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%',
    },
    inner: {
      position: 'absolute',
      top: 79,
      left: theme.typography.pxToRem(14),
      width: 'calc(100% - 30px)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      overflowY: 'hidden',
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
      width: android.width + 30,
      height: android.height + 160,
      backgroundImage: `url(${AndroidWrapper})`,
    },
    inner: {
      height: android.height,
      overflowX: 'hidden'
    },
    landscape: {
      backgroundImage: `url(${AndroidWrapperLand})`,
      height: android.width + 30,
      width: android.height + 160,
    },
    landscapeInner: {
      top: 19,
      left: 70,
      height: android.width,
      width: android.height,
    },
    time: {
      position: 'absolute',
      right: theme.typography.pxToRem(2),
      fontSize: theme.typography.pxToRem(13)
    },
    timeLandscape: {
      right: 32
    },
    content: {
      width: '100%',
      marginTop: '5.6%',
      height: '91.8%',
      marginLeft: theme.typography.pxToRem(1),
      position: 'relative'
    },
    contentLandscape: {
      marginTop: '2.7%',
      height: '95%'
    },
    fullHeight: {
      marginTop: 0,
      height: '100%'
    }
  })
);

const iosStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      height: iphoneSE.height + 150,
      width: iphoneSE.width + 30,
      backgroundImage: `url(${IOSWrapper})`
    },
    inner: {
      height: iphoneSE.height,
      top: theme.typography.pxToRem(65),
      left: theme.typography.pxToRem(16),
    },
    landscape: {
      backgroundImage: `url(${IOSWrapperLand})`,
      height: theme.typography.pxToRem(iphoneSE.width + 30),
      width: theme.typography.pxToRem(iphoneSE.height + 150),
    },
    landscapeInner: {
      top: 17,
      left: 65,
      height: theme.typography.pxToRem(iphoneSE.width),
      width: theme.typography.pxToRem(iphoneSE.height),
    },
    topBar: {
      position: 'absolute',
      top: 19
    },
    content: {
      width: '100%',
      height: '97%',
    },
    fullHeight: {
      height: '100%',
    }
  })
);

const IOSDevice: React.FC<DeviceComponentProps> = (
  {
    children,
    background,
    mode,
    statusBarEnabled,
    statusBarColor,
    portrait
  }) => {
  const classes = useStyles();
  const extraClasses = iosStyles();
  const inner = classNames(classes.inner, extraClasses.inner, {
    [extraClasses.landscapeInner]: !portrait,
  });
  const content = classNames({
    [extraClasses.topBar]: statusBarEnabled,
    [extraClasses.content]: true,
    [extraClasses.fullHeight]: !statusBarEnabled
  });

  return (
    <Grid className={inner} id="capture">
      {
        statusBarEnabled && (
          <IPhone6Inner
            width={portrait ? iphoneSE.width : iphoneSE.height}
            height={portrait ? iphoneSE.height : iphoneSE.width}
            style={{ position: 'absolute' }}
            mode={mode}
            background={background.backgroundColor}
            statusBarColor={statusBarColor} />
        )
      }
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
    statusBarEnabled,
    statusBarColor,
    mode,
    portrait
  }) => {
  const classes = useStyles();
  const extraClasses = androidStyles();
  const inner = classNames(classes.inner, extraClasses.inner, {
    [extraClasses.landscapeInner]: !portrait,
  });
  const time = moment().format('HH:mm');
  const timeStyle = classNames(
    mode === Mode.DARK ? classes.text : classes.textBlack,
    extraClasses.time,
    {
      [extraClasses.timeLandscape]: !portrait
    }
  );
  const content = classNames(extraClasses.content, {
    [extraClasses.contentLandscape]: !portrait,
    [extraClasses.fullHeight]: !statusBarEnabled
  });
  const navbar = portrait ?
    { bottom: 0 } : { transform: 'rotate(-90deg)', right: -165, height: android.width, zIndex:2 };

  return (
    <div className={inner} id="capture">
      {
        statusBarEnabled && (
          <>
            <AndroidPixelInner
              width={portrait ? android.width : android.height - 30}
              style={{ position: 'absolute' }}
              mode={mode}
              background={background.backgroundColor}
              statusBarColor={statusBarColor} />
            <AndroidPixelNavBar
              width={android.width}
              style={{ position: 'absolute', ...navbar }}
              mode={mode}
              background={background.backgroundColor}
              statusBarColor={statusBarColor} />
            <Typography className={timeStyle}>{time}</Typography>
          </>
        )
      }
      <div className={content} style={{ ...background }}>
        {children}
      </div>
    </div>
  )
};


const DeviceComponent: React.FC<DeviceComponentProps> = (
  { ios, children, scale, portrait, ...rest }) => {
  const classes = useStyles();
  const extraClasses = ios ? iosStyles() : androidStyles();
  const wrapper = classNames(classes.wrapper, extraClasses.wrapper, {
    [extraClasses.landscape]: !portrait
  });
  const marginTop = scale && scale <= 1 ? 0 : (scale || 1.1) * 80;
  return (
    <Grid container className={classes.container} justify="center" style={{width: `${150 * (scale || 1)}%`, marginTop: `${marginTop}px`}}>
      <div id='viewport' className={wrapper}>
        {ios ?
          <IOSDevice portrait={portrait} {...rest}>{children}</IOSDevice> :
          <AndroidDevice portrait={portrait} {...rest}>{children}</AndroidDevice>}
      </div>
    </Grid>
  );
};

export default DeviceComponent;
