import React from "react";
import classNames from "classnames";

// @material-ui/core
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// @material-ui/icons
import {KeyboardArrowDown, Send, Android, Clear, Apple} from "@material-ui/icons";

// interfaces
import {IPushMessage, MobileVariantType} from "interfaces/IVariant";
import {SMSChannelComponentType} from "types/commonTypes";

import {blackOpacity} from "assets/jss/material-dashboard-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
   root: {
    position: "absolute",
    top: theme.spacing(6),
    padding: theme.spacing(2)
   },
   container: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1)
   },
   box: {
    marginTop: theme.spacing(1)
   },
   content: {
    color: blackOpacity(.6)
   }
  }));

const iosStyles = makeStyles((theme: Theme) =>
  createStyles({
   root: {
    padding: theme.spacing(3),
    height: "100%"
   },
   container: {
    borderRadius: theme.typography.pxToRem(10),
    padding: 0
   },
   header: {
    borderBottom: "1px solid " + blackOpacity(.8),
    padding: theme.spacing(1),
   },
   appNameWrapper: {
    display: "flex",
    alignItems: "center"
   },
   appName: {
    fontSize: theme.typography.pxToRem(15),
    marginLeft: theme.typography.pxToRem(5)
   },
   title: {
    padding: theme.spacing(1)
   },
   message: {
    padding: "0 8px",
    marginBottom: theme.spacing(2)
   }
  }));

const androidStyles = makeStyles((theme: Theme) =>
  createStyles({
   container: {
    minHeight: theme.typography.pxToRem(50),
    padding: theme.spacing(2)
   },
   osIcon: {
    fontSize: theme.typography.pxToRem(35),
    position: "absolute",
    right: theme.typography.pxToRem(25),
    border: "1px solid " + blackOpacity(.6),
    borderRadius: "50%",
    padding: theme.typography.pxToRem(2)
   },
   pushIcon: {
    maxWidth: theme.typography.pxToRem(22),
    maxHeight: theme.typography.pxToRem(22)
   },
   appName: {
    fontSize: theme.typography.pxToRem(15),
    marginLeft: theme.typography.pxToRem(5)
   }
  }));

function IOSContent(props: {variant: MobileVariantType}) {
 const classes = useStyles();
 const extraClasses = iosStyles();
 const container = classNames(classes.container, extraClasses.container);
 const data = props.variant.data as IPushMessage;
 const title = classNames(extraClasses.title);
 const message = classNames(extraClasses.message);
 const appName = classNames(classes.content, extraClasses.appName);
 return (
   <Grid container justify="center" alignItems="center" className={extraClasses.root}>
    {
     data.title.length > 0 || data.message.length > 0 ? (
       <Grid container className={container}>
        <Grid container className={extraClasses.header} justify="space-between">
         <div className={extraClasses.appNameWrapper}>
          <Apple />
          <Typography className={appName} >Pixart.App</Typography>
         </div>
         <Clear className={classes.content} />
        </Grid>
        <Grid container className={title}>
         <Typography variant="body1">{data.title}</Typography>
        </Grid>
        <Grid container className={message}>
         <Typography variant="body2" className={classes.content}>{data.message}</Typography>
        </Grid>
       </Grid>
     ) : null
    }
   </Grid>
 );
}

function AndroidContent(props: {variant: MobileVariantType}) {
 const classes = useStyles();
 const extraClasses = androidStyles();
 const container = classNames(classes.container, extraClasses.container);
 const appName = classNames(extraClasses.appName);
 const data = props.variant.data as IPushMessage;
 return (
   <Grid container className={classes.root} justify="center">
    {
     data.title.length > 0 || data.message.length > 0 ? (
       <Grid container className={container}>
        <Grid container>
         <Send className={classes.content} />
         <Typography className={appName}>Pixart.App</Typography>
         <KeyboardArrowDown className={classes.content} />
        </Grid>
        <Grid container className={classes.box}>
         <Typography variant="body2">{data.title}</Typography>
        </Grid>
        <Grid container className={classes.box}>
         <Typography variant="caption" className={classes.content}>{data.message}</Typography>
        </Grid>
        <Android className={extraClasses.osIcon} />
       </Grid>
     ) : null
    }
   </Grid>
 );
}

function PushChannelComponent(props: SMSChannelComponentType) {
 const {ios, ...rest} = props;
 return ios ? <IOSContent {...rest} /> : <AndroidContent {...rest} />;
}

export default PushChannelComponent;
