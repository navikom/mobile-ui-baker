import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CustomSelect from "components/CustomSelect/CustomSelect";
import OneTimeRunTypeComponent from "views/Campaigns/components/whenToSend/OneTimeRunTypeComponent";
import TriggerRunTypeComponent from "views/Campaigns/components/whenToSend/TriggerRunTypeComponent";
import RecurringRunTypeComponent from "views/Campaigns/components/whenToSend/RecurringRunTypeComponent";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

import { RunType } from "types/commonTypes";

// view stores
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";
import { WhenToSendViewStore } from "views/Campaigns/store/WhenToSendViewStore";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.typography.pxToRem(20)
    },
    label: {
      width: theme.typography.pxToRem(200),
      marginRight: theme.typography.pxToRem(30)
    }
  })
);

const RunTypeComponents = [
  OneTimeRunTypeComponent,
  TriggerRunTypeComponent,
  RecurringRunTypeComponent
];

export default observer(() => {
  const store = CampaignViewStore.whenToRunStepStore;
  if (!store) return null;

  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    classes.textToRight,
    extraClasses.label
  );

  return (
    <Card>
      <CardBody>
        <Grid container>
          <Grid
            container
            item
            direction="row"
            className={extraClasses.container}
          >
            <Typography variant="subtitle2" className={centerNote}>
              {Dictionary.defValue(DictionaryService.keys.runType)}
            </Typography>
            <Grid item xs={12} sm={12} md={6}>
              <FormControl fullWidth>
                <CustomSelect
                  value={store.currentRunType}
                  onChange={(e: RunType) => store.setCurrentRunType(e)}
                  options={WhenToSendViewStore.runTypes}
                />
              </FormControl>
            </Grid>
          </Grid>
          {React.createElement(RunTypeComponents[store.currentRunType - 1])}
        </Grid>
      </CardBody>
    </Card>
  );
});
