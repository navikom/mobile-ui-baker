import React from "react";
import {SMSChannelComponentType} from "types/commonTypes";
import {IInAppMessage, MobileVariantType} from "interfaces/IVariant";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";
import {blackOpacity} from "assets/jss/material-dashboard-react";
import Typography from "@material-ui/core/Typography";
import {observer} from "mobx-react-lite";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
   root: {
    padding: theme.spacing(3),
    height: "100%"
   },
   container: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1)
   },
   content: {
    color: blackOpacity(.6)
   }
  }));


const Content = observer((props: {variant: MobileVariantType}) => {
 const classes = useStyles();
 const data = props.variant.data as IInAppMessage;
 const content = `handle onMessage(title: string, message: string, keyValuePairs: string[][]) callback in your mobile app where
 title=${data.title},
 message=${data.message},
 keyValuePairs=${JSON.stringify(data.keyValuePairs.map((prop: string[]) => ({[prop[0]]: prop[1]})))}`;
 return (
   <Grid container className={classes.root} justify="center" alignItems="center">
    {
     data.title.length > 0 || data.message.length > 0 ? (
       <Grid container className={classes.container}>
        <Typography variant="body2" className={classes.content}>{content}</Typography>
       </Grid>
     ) : null
    }
   </Grid>
 );
});

function InAppChannelsComponent(props: SMSChannelComponentType) {
 const {ios, ...rest} = props;
 return <Content {...rest} />;
}

export default InAppChannelsComponent;
