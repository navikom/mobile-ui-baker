import React from "react";

// models
import {EMAIL_CHANNEL, IN_APP_CHANNEL, PUSH_CHANNEL, SMS_CHANNEL} from "models/Constants";

// view stores
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";

// utils
import {lazy} from "utils";
import WaitingComponent from "hocs/WaitingComponent";
import {makeStyles, Theme} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {ContentChannelsType} from "interfaces/IContentStep";
import {AddCircleOutline, Delete} from "@material-ui/icons";
import {observer} from "mobx-react-lite";

// channel components
const EmailComponent = lazy(() => import("views/Campaigns/components/content/EmailComponent"));
const SMSComponent = lazy(() => import("views/Campaigns/components/content/SMSComponent"));
const PushComponent = lazy(() => import("views/Campaigns/components/content/PushComponent"));


const useStyles = makeStyles((theme: Theme) => ({
 root: {
  marginTop: theme.typography.pxToRem(10),
  flexGrow: 1,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
 },
 bar: {
  marginBottom: theme.typography.pxToRem(10)
 },
 tabButton: {
  minWidth: 0,
  "&:hover": {
   color: "rgba(0,0,0,.8)"
  }
 }
}));

const ChannelComponents = {
 [EMAIL_CHANNEL]: EmailComponent,
 [SMS_CHANNEL]: SMSComponent,
 [IN_APP_CHANNEL]: PushComponent,
 [PUSH_CHANNEL]: PushComponent
};

function ContentStep() {

 const classes = useStyles();
 const store = CampaignViewStore.contentStepStore;
 if (!store) return null;

 return (
   <div className={classes.root}>
    <AppBar position="static" color="default" className={classes.bar}>
     <Tabs
       value={store.currentVariant}
       onChange={(e: any, i: number) => store.setCurrentVariant(i)}
       indicatorColor="primary"
       textColor="primary"
       variant="scrollable"
       scrollButtons="auto"
       aria-label="scrollable auto tabs example"
     >
      {
       store!.variants.map((prop: ContentChannelsType, i: number) => (
         <Tab
           key={i}
           label={`Variant (${String.fromCharCode(65 + i)})`}
           id={`scrollable-auto-tab-${i}`}
           aria-controls={`scrollable-auto-tabpanel-${i}`} />
       ))
      }
      {
       store!.variants.length > 1 && (
         <Tab
           className={classes.tabButton}
           disableRipple={true}
           disableFocusRipple={true}
           icon={<Delete />} aria-label="delete"
           color="warning"
           onClick={() => store!.deleteStore()}/>
       )
      }
      <Tab
        className={classes.tabButton}
        disableRipple={true}
        disableFocusRipple={true}
        icon={<AddCircleOutline />} aria-label="add"
        color="primary"
        onClick={() => store!.addStore()}/>
     </Tabs>
    </AppBar>
    {
     React.createElement(WaitingComponent(ChannelComponents[store.channel]), {store: store!.currentStore})
    }
   </div>
 )
}

export default observer(ContentStep);
