import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// interfaces
import {ITriggerRunView} from "interfaces/IRunTypeView";

// view stores
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";
import {TriggerRunViewStore} from "views/Campaigns/store/TriggerRunViewStore";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// components
import FiltarableComponent from "components/Filter/FiltarableComponent";
import SwitchComponent from "views/Campaigns/components/SwitchComponent";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import PeriodComponent from "components/Filter/PeriodComponent";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
   container: {
    marginTop: theme.typography.pxToRem(20)
   },
   label: {
    width: theme.typography.pxToRem(200),
    marginRight: theme.typography.pxToRem(30)
   }
  }));

export default observer(() => {
 const whenToRunStepStore = CampaignViewStore.whenToRunStepStore;
 if (!whenToRunStepStore) return null;
 const store = whenToRunStepStore.runStore as ITriggerRunView;

 const classes = useStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, classes.textToRight, extraClasses.label);

 const first = {
  value: store.model.eventName,
  options: TriggerRunViewStore.systemEventsList,
  onChange: (e: string) => store.setEventName(e)
 };

 useEffect(() => {
  !store.model.eventName && store.setEventName(TriggerRunViewStore.systemEventsList[0]);
 });

 return (
   <Grid container>
    <Grid container item direction="row" className={extraClasses.container}>
     <Typography variant="subtitle2" className={centerNote}>
      {Dictionary.defValue(DictionaryService.keys.uponEventOccurs)}
     </Typography>
     <Grid item xs={12} sm={12} md={6}>
      <FiltarableComponent first={first} />
     </Grid>
    </Grid>
    <Grid container item direction="row" className={extraClasses.container}>
     <Typography variant="subtitle2" className={centerNote} />
     <Grid item xs={12} sm={12} md={7}>
      <RadioGroup onChange={() => store.switchSendAsOccurs()}>
       <FormControlLabel
         checked={store.model.sendAsOccurs}
         control={<Radio color="primary" />}
         label={Dictionary.defValue(DictionaryService.keys.sendAsOccurs)}
       />
       <Grid container>
        <Grid item xs={12} sm={12} md={2}>
         <FormControlLabel
           checked={!store.model.sendAsOccurs}
           control={<Radio color="primary" />}
           label={Dictionary.defValue(DictionaryService.keys.waitFor)}
         />
        </Grid>
        {
         !store.model.sendAsOccurs &&
         <PeriodComponent
           onPeriod={(e) => store.setPeriod(e)}
           onAmount={(e) => store.setAmount(e)}
           options={TriggerRunViewStore.timePeriods}
           tale={Dictionary.defValue(DictionaryService.keys.andThenSend)}
           period={store.timePeriod}
           amount={store.timeAmount} />
        }
       </Grid>
      </RadioGroup>
     </Grid>
    </Grid>
    <SwitchComponent
      title={Dictionary.defValue(DictionaryService.keys.startDate)}
      onTitle={Dictionary.defValue(DictionaryService.keys.now)}
      offTitle={Dictionary.defValue(DictionaryService.keys.later)}
      on={store.now}
      switchOn={() => store.switchNow()}
      later={store.model.startDate}
      setTimeDate={(date: Date) => store.onTimeChange(date, true)} />
    <SwitchComponent
      title={Dictionary.defValue(DictionaryService.keys.endDate)}
      onTitle={Dictionary.defValue(DictionaryService.keys.never)}
      offTitle={Dictionary.defValue(DictionaryService.keys.until)}
      on={store.never}
      switchOn={() => store.switchNever()}
      later={store.model.endDate || undefined}
      setTimeDate={(date: Date) => store.onTimeChange(date, false)} />
   </Grid>
 );
});
