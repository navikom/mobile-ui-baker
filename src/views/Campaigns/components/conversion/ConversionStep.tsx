import React from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import CardBody from "components/Card/CardBody";
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// styles
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import cardStyles from "assets/jss/material-dashboard-react/views/cardStyle";

// stores
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";
import {ConversionStepStore} from "views/Campaigns/store/ConversionStepStore";

// components
import Card from "components/Card/Card";
import IOSSwitch from "components/Switch/IOSSwitch";
import CardHeader from "components/Card/CardHeader";
import FiltarableComponent from "components/Filter/FiltarableComponent";
import PeriodComponent from "components/Filter/PeriodComponent";

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
   cardBody: {
    minHeight: theme.typography.pxToRem(1)
   }
  }));

type BodyComponentProps = {
 event: string;
 timePeriod: string;
 timeAmount: number;
 setEvent(value: string): void;
 setPeriod(value: string): void;
 setAmount(value: number): void;
}

const BodyComponent = (props: BodyComponentProps) => {
 const classes = useStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, classes.textToRight, extraClasses.label);

 const first = {
  value: props.event,
  options: ConversionStepStore.systemEventsList,
  onChange: props.setEvent
 };
 return (
   <Grid container>
    <Grid container item direction="row" className={extraClasses.container}>
     <Typography variant="subtitle2" className={centerNote}>
      {Dictionary.defValue(DictionaryService.keys.conversionEvent)}
     </Typography>
     <Grid item xs={12} sm={12} md={6}>
      <FiltarableComponent first={first} />
     </Grid>
    </Grid>
    <Grid container item direction="row" className={extraClasses.container}>
     <Typography variant="subtitle2" className={centerNote}>
      {Dictionary.defValue(DictionaryService.keys.conversionDeadline)}
     </Typography>
     <Grid item xs={12} sm={12} md={6}>
      <PeriodComponent
        onPeriod={props.setPeriod}
        onAmount={props.setAmount}
        options={ConversionStepStore.timePeriods}
        tale={Dictionary.defValue(DictionaryService.keys.fromDeliveryMessageToUser)}
        period={props.timePeriod}
        amount={props.timeAmount} />
     </Grid>
    </Grid>
   </Grid>
 );
};

const ConversionStep = () => {
 const store = CampaignViewStore.conversionStepStore;
 if (!store) return null;

 const cardClasses = cardStyles();
 const extraClasses = extraStyles();

 return (
   <div className={extraClasses.root}>
    <Card>
     <CardHeader color="inherit" plain>
      <Grid container justify="space-between" alignItems="center">
       <h4 className={cardClasses.cardTitleBlack}>
        {Dictionary.defValue(DictionaryService.keys.conversionTracking).toUpperCase()}
       </h4>
       <IOSSwitch
         checked={store!.enabled}
         onChange={() => store.setEnabled(!store.enabled)}
         value={"On"}
       />
      </Grid>
     </CardHeader>
     <CardBody className={extraClasses.cardBody}>
      {
       store.enabled &&
       <BodyComponent
         event={store!.conversion.event}
         setEvent={store!.setEvent}
         setAmount={store!.setAmount}
         setPeriod={store!.setPeriod}
         timePeriod={store!.timePeriod}
         timeAmount={store!.timeAmount}
       />
      }
     </CardBody>
    </Card>
   </div>
 );
};

export default observer(ConversionStep);
