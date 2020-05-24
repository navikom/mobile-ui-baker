import React from 'react';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { DeviceComponentProps } from './DeviceComponent';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import AndroidWrapper from 'assets/img/device/nexus_6_outer.png';
import AndroidWrapperLand from 'assets/img/device/nexus_6_outer-land.png';
import IOSWrapper from 'assets/img/device/iphone_x_outer.png';
import IOSWrapperLand from 'assets/img/device/iphone_x_outer_land.png';
import IPhone6Inner from '../../../components/Icons/IPhone6Inner';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(3),
    overflow: 'auto',
  },
  wrapper: {
    position: 'relative',
    width: theme.typography.pxToRem(278),
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
  },
  frame: {
    width: theme.typography.pxToRem(278),
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  },
  inner: {
    position: 'absolute',
    top: theme.typography.pxToRem(59),
    left: theme.typography.pxToRem(19),
    width: 'calc(100% - 35px)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflowY: 'hidden',
  },
}));

const iosStyles = makeStyles((theme: Theme) => createStyles({
  wrapper: {
    height: theme.typography.pxToRem(556),
  },
  frame: {
    position: 'absolute',
    backgroundImage: `url(${IOSWrapper})`,
    height: theme.typography.pxToRem(556),
    top: 0,
    left: 0
  },
  inner: {
    height: theme.typography.pxToRem(490),
    top: theme.typography.pxToRem(25),
    left: theme.typography.pxToRem(18),
  },
  landscape: {
    backgroundImage: `url(${IOSWrapperLand})`,
    height: theme.typography.pxToRem(303),
    width: theme.typography.pxToRem(556),
  },
  landscapeInner: {
    top: theme.typography.pxToRem(18),
    left: theme.typography.pxToRem(62),
    height: theme.typography.pxToRem(271),
    width: theme.typography.pxToRem(491),
  },
  content: {
    position: 'absolute',
    top: theme.typography.pxToRem(10),
    left: theme.typography.pxToRem(19),
    width: '87%',
    height: '96%',
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    zIndex: 99,
    borderBottomLeftRadius: theme.typography.pxToRem(25),
    borderBottomRightRadius: theme.typography.pxToRem(25)
  }
}));

const androidStyles = makeStyles((theme: Theme) => createStyles({
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
}));

const IOSDevice: React.FC<DeviceComponentProps> = (
  {
    children,
    background,
    mode,
    statusBarColor,
    statusBarEnabled,
    portrait
  }) => {
  const classes = useStyles();
  const extraClasses = iosStyles();
  const inner = classNames(classes.inner, extraClasses.inner, {
    [extraClasses.landscapeInner]: !portrait,
  });
  const content = classNames(extraClasses.content);
  const frame = classNames(classes.frame, extraClasses.frame);
  return (
    <Grid>
      <Grid container className={content} style={{ ...background }}>
        <div className={extraClasses.contentWrapper}>{children}</div>
      </Grid>
      <div className={inner}>
        <IPhone6Inner
          antennaDX={-19}
          width={portrait ? 241 : 490}
          height={portrait ? undefined : 260}
          style={{ position: 'absolute' }}
          mode={mode}
          background={background.backgroundColor}
          statusBarColor={statusBarColor} />
      </div>
      <div className={frame} />
    </Grid>
  )
}

const AndroidDevice: React.FC<DeviceComponentProps> = (
  {
    children,
    background,
    mode,
    statusBarColor,
    statusBarEnabled,
    portrait
  }) => {
  const classes = useStyles();
  const extraClasses = iosStyles();

  return (
    <Grid id="capture">
    </Grid>
  )
}

const DeviceComponent: React.FC<DeviceComponentProps> = (
  { ios, children, portrait, ...rest }) => {
  const classes = useStyles();
  const extraClasses = ios ? iosStyles() : androidStyles();
  const wrapper = classNames(classes.wrapper, extraClasses.wrapper, {
    [extraClasses.landscape]: !portrait
  });
  return (
    <Grid className={classes.container} container justify="center">
      <div className={wrapper} id="capture">
        {ios ?
          <IOSDevice portrait={portrait} {...rest}>{children}</IOSDevice> :
          <AndroidDevice portrait={portrait} {...rest}>{children}</AndroidDevice>}
      </div>
    </Grid>
  );
};

export default DeviceComponent;
