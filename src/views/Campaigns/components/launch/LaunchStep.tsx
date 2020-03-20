import React, { ReactNode, useState } from "react";
import {observer} from "mobx-react-lite";

// @material-ui/icons
import {EditOutlined} from "@material-ui/icons";

// @material-ui/core
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// assets
import cardStyles from "assets/jss/material-dashboard-react/views/cardStyle";

// models
import {EMAIL_CHANNEL, IN_APP_CHANNEL, PUSH_CHANNEL, SMS_CHANNEL} from "models/Constants";

// core components
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import {FormRow} from "components/Grid/FormRow";

// view store
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";

// utils
import {lazy} from "utils";
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import {ContentChannelsType, IContentStep} from "interfaces/IContentStep";
import Tab from "@material-ui/core/Tab";
import WaitingComponent from "hocs/WaitingComponent";

// channel components
const EmailContent = lazy(() => import("views/Campaigns/components/launch/EmailContent"));
const SMSContent = lazy(() => import("views/Campaigns/components/launch/SMSContent"));

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
   root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
   },
   container: {
    marginTop: theme.typography.pxToRem(20)
   },
   label: {
    width: theme.typography.pxToRem(200),
    marginRight: theme.typography.pxToRem(30)
   },
   bar: {
    marginBottom: theme.typography.pxToRem(10)
   }
  }));

const ChannelComponents = {
 [EMAIL_CHANNEL]: EmailContent,
 [SMS_CHANNEL]: SMSContent,
 [IN_APP_CHANNEL]: SMSContent,
 [PUSH_CHANNEL]: SMSContent
};

function ContentTabs(props: {store: IContentStep}) {
 const [index, setIndex] = useState(0);
 const classes = extraStyles();
 return(
   <React.Fragment>
    <AppBar position="static" color="default" className={classes.bar}>
     <Tabs
       value={index}
       onChange={(e: any, i: number) => setIndex(Math.min(i, props.store.variants.length - 1))}
       indicatorColor="primary"
       textColor="primary"
       variant="scrollable"
       scrollButtons="auto"
       aria-label="scrollable auto tabs example"
     >
      {
       props.store!.variants.map((prop: ContentChannelsType, i: number) => (
         <Tab
           key={i}
           label={`Variant (${String.fromCharCode(65 + i)})`}
           id={`scrollable-auto-tab-${i}`}
           aria-controls={`scrollable-auto-tabpanel-${i}`} />
       ))
      }
     </Tabs>
    </AppBar>
    {
     React.createElement(WaitingComponent(ChannelComponents[props.store.channel]), {store: props.store!.variants[index]})
    }
   </React.Fragment>
 )
}

type LaunchCardType = {
  header: string;
  onClick(): void;
  body?: ReactNode;
  data?: string[][][];
}

function LaunchCard(props: LaunchCardType) {
 const cardClasses = cardStyles();
 return (
   <GridContainer>
    <GridItem xs={12} sm={12} md={12}>
     <Card>
      <CardHeader color="inherit" plain>
       <Grid container justify="space-between" alignItems="center">
        <h4 className={cardClasses.cardTitleBlack}>
         {props.header}
        </h4>
        <Fab size="small" color="primary" aria-label="edit" onClick={props.onClick}>
         <EditOutlined />
        </Fab>
       </Grid>
      </CardHeader>
      <CardBody>
       {
        props.body !== undefined ? props.body : (
          <GridContainer spacing={5}>
           {
             props.data && props.data.map((data: string[][], index: number) => (
              <GridContainer key={index} item xs={12} spacing={3}>
               <FormRow data={data} />
              </GridContainer>
            ))
           }
          </GridContainer>
        )
       }
      </CardBody>
     </Card>
    </GridItem>
   </GridContainer>
 );
}

function LaunchStep() {
 const store = CampaignViewStore.launchStepStore;
 if (!store) return null;
 const extraClasses = extraStyles();

 return (
   <div className={extraClasses.root}>
    <LaunchCard
      header={Dictionary.defValue(DictionaryService.keys.audience).toUpperCase()}
      onClick={() => CampaignViewStore.handleStep(0)()}
      data={[[
       [Dictionary.defValue(DictionaryService.keys.campaign) + " " + Dictionary.defValue(DictionaryService.keys.name), ""],
       [Dictionary.defValue(DictionaryService.keys.audience) + " " + Dictionary.defValue(DictionaryService.keys.type), ""],
       [Dictionary.defValue(DictionaryService.keys.sendTo), ""]
      ], [[Dictionary.defValue(DictionaryService.keys.reachable) + " " + Dictionary.defValue(DictionaryService.keys.users), "0"]]
      ]
      }
    />
    <LaunchCard
      header={Dictionary.defValue(DictionaryService.keys.when).toUpperCase()}
      onClick={() => CampaignViewStore.handleStep(1)()}
      data={[[
       [Dictionary.defValue(DictionaryService.keys.campaign) + " " + Dictionary.defValue(DictionaryService.keys.type), ""],
       [Dictionary.defValue(DictionaryService.keys.deliveryTime), ""],
       [Dictionary.defValue(DictionaryService.keys.timezone), ""]
      ]]
      }
    />
    <LaunchCard
      header={Dictionary.defValue(DictionaryService.keys.message).toUpperCase()}
      onClick={() => CampaignViewStore.handleStep(2)()}
      body={<ContentTabs store={CampaignViewStore.contentStepStore as IContentStep}/>}
    />
    <LaunchCard
      header={Dictionary.defValue(DictionaryService.keys.conversionTracking).toUpperCase()}
      onClick={() => CampaignViewStore.handleStep(3)()}
      data={[[
       [Dictionary.defValue(DictionaryService.keys.conversionTracking), ""],
       [Dictionary.defValue(DictionaryService.keys.conversionEvent), ""],
       [Dictionary.defValue(DictionaryService.keys.conversionDeadline), ""]
      ]]
      }
    />
   </div>
 );
}

export default observer(LaunchStep);
