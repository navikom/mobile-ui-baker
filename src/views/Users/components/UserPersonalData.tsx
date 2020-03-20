import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

// @material-ui/core
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import { UserDetails } from "views/Users/components/UserDetailsStore";
import CustomInput from "components/CustomInput/CustomInput";
import Check from "components/Check/Check";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      opacity: 0.5,
      marginTop: theme.typography.pxToRem(10)
    },
    label: {
      width: theme.typography.pxToRem(200)
    },
    radioGroup: {
      width: theme.typography.pxToRem(300)
    }
  })
);

export default observer(() => {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const user = UserDetails.user;
  const centerNote = classNames(
    classes.note,
    classes.center,
    extraClasses.label
  );

  if (!user) return null;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Typography
        variant="subtitle1"
        color="inherit"
        align="center"
        className={extraClasses.title}
      >
        {Dictionary.defValue(DictionaryService.keys.personalData)}
      </Typography>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.email)}:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            disabled: true,
            value: user.email || ""
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.firstName)}:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            disabled: true,
            value: user.firstName || ""
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.lastName)}:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            disabled: true,
            value: user.lastName || ""
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.phone)}:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            disabled: true,
            value: user.phone || ""
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.birthday)}:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            disabled: true,
            value: user.birthday || ""
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.gender)}:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            disabled: true,
            value: user.gender || ""
          }}
          labelText=""
        />
      </Grid>
      <Divider variant="middle" />
      <Typography
        variant="subtitle1"
        color="inherit"
        align="center"
        className={extraClasses.title}
      >
        {Dictionary.defValue(DictionaryService.keys.permissions)}
      </Typography>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.notificationsEmail)}:
        </Typography>
        <Check checked={user.notificationEmail} />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.notificationSms)}:
        </Typography>
        <Check checked={user.notificationSms} />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.subscriptions)}:
        </Typography>
        <Check checked={user.subscription} />
      </Grid>
    </MuiPickersUtilsProvider>
  );
});
