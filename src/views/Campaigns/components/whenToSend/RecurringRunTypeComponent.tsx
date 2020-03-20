import React from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// interfaces
import {IRecurringRunView} from "interfaces/IRunTypeView";

// view stores
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";
import {RecurringRunViewStore} from "views/Campaigns/store/RecurringRunViewStore";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// components
import FiltarableComponent from "components/Filter/FiltarableComponent";
import SwitchComponent from "views/Campaigns/components/SwitchComponent";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

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
 const store = whenToRunStepStore.runStore as IRecurringRunView;

 const classes = useStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, classes.textToRight, extraClasses.label);

 const first = {
  value: store.timePeriod,
  options: RecurringRunViewStore.timePeriodNames,
  onChange: (e: string) => store.setPeriod(e),
  label: Dictionary.defValue(DictionaryService.keys.every)
 };

 let second, third;
 const fieldProps = {
  time: store.reoccurTime || new Date(),
  onChange: (time: Date) => store.setReoccurTime(time),
  label: Dictionary.defValue(DictionaryService.keys.at)
 };

 if (store.secondSelectOptions) {
  third = fieldProps;
  second = {
   value: store.secondOption,
   options: store.secondSelectOptions,
   onChange: (e: string) => store.setSecondOption(e),
   label: Dictionary.defValue(DictionaryService.keys.every)
  }
 } else {
  second = fieldProps;
 }

 const fourth = {
  date: store.model.startDate || new Date(),
  onChange: () => {},
  disabled: true
 };

 const fifth = {
  time: store.model.startDate || new Date(),
  onChange: () => {},
  disabled: true
 };

 return (
   <Grid container>
    <Grid container item direction="row" className={extraClasses.container}>
     <Typography variant="subtitle2" className={centerNote}>
      {Dictionary.defValue(DictionaryService.keys.deliveryTime)}
     </Typography>
     <Grid item xs={12} sm={12} md={6}>
      <FiltarableComponent first={first} second={second} third={third} />
     </Grid>
    </Grid>
    <Grid container item direction="row" className={extraClasses.container}>
     <Typography variant="subtitle2" className={centerNote}>
      {Dictionary.defValue(DictionaryService.keys.nextShipping)}
     </Typography>
     <Grid item xs={12} sm={12} md={6}>
      <FiltarableComponent
        first={fourth}
        second={fifth}
      />
     </Grid>
    </Grid>
    <SwitchComponent
      title={Dictionary.defValue(DictionaryService.keys.stopShipping)}
      onTitle={Dictionary.defValue(DictionaryService.keys.never)}
      offTitle={Dictionary.defValue(DictionaryService.keys.until)}
      on={store.never}
      switchOn={() => store.switchNever()}
      later={store.model.endDate || undefined}
      setTimeDate={(date: Date) => store.onTimeChange(date, false)} />
   </Grid>
 );
});
