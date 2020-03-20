import classNames from "classnames";
import moment from "moment";
import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import AndroidInner from "assets/svg/android_sms_inner.svg";
import IOSInner from "assets/svg/ios_sms_inner.svg";
import Typography from "@material-ui/core/Typography";
import {blackOpacity, inheritColor, whiteColor} from "assets/jss/material-dashboard-react";
import {ISMSVariant, MobileVariantType} from "interfaces/IVariant";
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";
import Grid from "@material-ui/core/Grid";
import {SMSChannelComponentType} from "types/commonTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
   inner: {
    position: "absolute",
    top: theme.typography.pxToRem(72),
    left: theme.typography.pxToRem(19),
    width: "calc(100% - 38px)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%"
   },
   text: {
    color: whiteColor
   },
   sender: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
   },
   caption: {
    fontSize: theme.typography.pxToRem(8),
    color: blackOpacity(.4)
   },
   contentText: {
    fontSize: theme.typography.pxToRem(12),
    color: blackOpacity(.6)
   }
  }));

const androidStyles = makeStyles((theme: Theme) =>
  createStyles({
   inner: {
    backgroundImage: `url(${AndroidInner})`,
    height: theme.typography.pxToRem(478)
   },
   time: {
    position: "absolute",
    right: theme.typography.pxToRem(2),
    fontSize: theme.typography.pxToRem(13)
   },
   sender: {
    position: "absolute",
    top: theme.typography.pxToRem(28),
    left: theme.typography.pxToRem(34),
    fontSize: theme.typography.pxToRem(15),
    width: theme.typography.pxToRem(130),
   },
   contentWrapper: {
    position: "absolute",
    top: theme.typography.pxToRem(60),
    padding: theme.spacing(1),
   },
   contentIcon: {
    width: theme.typography.pxToRem(40),
    height: theme.typography.pxToRem(40),
    backgroundColor: "#098043",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
   },
   contentContainer: {
    width: "78%",
   },
   content: {
    position: "relative",
    backgroundColor: whiteColor,
    padding: theme.spacing(1),
    borderRadius: theme.typography.pxToRem(3),
    "&:before": {
     position: "absolute",
     content: "''",
     left: theme.typography.pxToRem(-7),
     border: "7px solid " + whiteColor,
     borderColor: `${whiteColor} transparent transparent`
    }
   },
   contentFooter: {
    paddingTop: theme.spacing(1)
   },
   typeMessage: {
    position: "absolute",
    left: theme.typography.pxToRem(20),
    fontSize: theme.typography.pxToRem(15),
    color: blackOpacity(.5),
    bottom: theme.typography.pxToRem(52),
   }
  }));

const iosStyles = makeStyles((theme: Theme) =>
  createStyles({
   inner: {
    height: theme.typography.pxToRem(475),
    backgroundImage: `url(${IOSInner})`
   },
   topBar: {
    position: "absolute",
    color: "#007afe",
    padding: "0 3px 0 19px",
    top: theme.typography.pxToRem(20)
   },
   barText: {
    fontSize: theme.typography.pxToRem(14)
   },
   sender: {
    maxWidth: theme.typography.pxToRem(100)
   },
   contentContainer: {
    position: "absolute",
    top: theme.spacing(5),
    padding: theme.spacing(2)
   },
   caption: {
    fontSize: theme.typography.pxToRem(5)
   },
   content: {
    borderRadius: theme.typography.pxToRem(10),
    backgroundColor: inheritColor[1],
    padding: theme.spacing(1),
    marginTop: theme.spacing(1)
   }
  }));


function AndroidContent(props: {variant: MobileVariantType}) {
 const classes = useStyles();
 const extraClasses = androidStyles();
 const inner = classNames(classes.inner, extraClasses.inner);
 const time = moment().format("HH:mm");
 const timeStyle = classNames(classes.text, extraClasses.time);
 const senderStyle = classNames(classes.text, classes.sender, extraClasses.sender);
 const variant = props.variant as ISMSVariant;

 return (
   <div className={inner}>
    <Typography className={timeStyle}>{time}</Typography>
    <Typography className={senderStyle}>{variant.data.sender}</Typography>
    {
     variant.data.message.length > 0 && (
       <Grid container className={extraClasses.contentWrapper} justify="space-between">
        <div className={extraClasses.contentIcon}>
         <Typography variant="subtitle1" className={classes.text}>{variant.data.sender.substr(0, 1)}</Typography>
        </div>
        <div className={extraClasses.contentContainer}>
         <div className={extraClasses.content}>
          <Typography className={classes.contentText}>{variant.data.message}</Typography>
         </div>
         <div className={extraClasses.contentFooter}>
          <Typography className={classes.caption}>{time} via SMS</Typography>
         </div>
        </div>
       </Grid>
     )
    }
    <Typography className={extraClasses.typeMessage}>{Dictionary.defValue(DictionaryService.keys.type)} {Dictionary.defValue(DictionaryService.keys.message)}</Typography>
   </div>
 );
}

function IOSContent(props: {variant: MobileVariantType}) {
 const classes = useStyles();
 const extraClasses = iosStyles();
 const inner = classNames(classes.inner, extraClasses.inner);
 const senderStyle = classNames(classes.sender, extraClasses.sender, extraClasses.barText);
 const variant = props.variant as ISMSVariant;
 const captionStyle = classNames(classes.caption, extraClasses.caption);
 const time = moment().format("HH:mm");
 return (
   <Grid className={inner}>
    <Grid container className={extraClasses.topBar} justify="space-between">
     <Typography className={extraClasses.barText}>{Dictionary.defValue(DictionaryService.keys.messages)}</Typography>
     <Typography className={senderStyle}>{variant.data.sender}</Typography>
     <Typography className={extraClasses.barText}>{Dictionary.defValue(DictionaryService.keys.details)}</Typography>
    </Grid>
    {
     variant.data.message.length > 0 && (
       <Grid container className={extraClasses.contentContainer}>
        <Grid container alignContent="center" justify="center">
         <Typography className={captionStyle}>{Dictionary.defValue(DictionaryService.keys.textMessage)}</Typography>
        </Grid>
        <Grid container alignContent="center" justify="center">
         <Typography className={captionStyle}>{Dictionary.defValue(DictionaryService.keys.today)} {time}</Typography>
        </Grid>
        <Grid container className={extraClasses.content}>
         <Typography className={classes.contentText}>{variant.data.message}</Typography>
        </Grid>
       </Grid>
     )
    }
   </Grid>
 );
}

function SMSChannelComponent(props: SMSChannelComponentType) {
 const {ios, ...rest} = props;
 return ios ? <IOSContent {...rest} /> : <AndroidContent {...rest} />;
}

export default SMSChannelComponent;
