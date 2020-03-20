import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

// pickers
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  DatePicker
} from "@material-ui/pickers";

// @material-ui/core
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

// interfaces
import { IUser } from "interfaces/IUser";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// models
import { FEMALE, MALE } from "models/User/UserStore";

// core components
import CustomInput from "components/CustomInput/CustomInput";
import ProgressButton from "components/CustomButtons/ProgressButton";
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

// view store
import { UserDetails } from "views/UserProfile/components/UserDetailsStore";


const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      opacity: .5,
      marginTop: theme.typography.pxToRem(10)
    },
    label: {
      width: theme.typography.pxToRem(200)
    },
    radioGroup: {
      width: theme.typography.pxToRem(300)
    }
  }));


export default observer(() => {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const store = UserDetails.personalDataStore;
  const user = store.formUser;
  const centerNote = classNames(classes.note, classes.center, extraClasses.label);
  const onChange = (name: string) =>
    (e: any) => store.onInput({ [name]: e.target.value } as IUser);
  const onChangeDate = (name: string) => (date: any) =>
    store.onInput({ [name]: date } as IUser);
  const onSwitch = (name: string) => (e: any) =>
    store.onInput({ [name]: e.target.checked } as IUser);
  if (!user) return null;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Typography variant="subtitle1" color="inherit" align="center" className={extraClasses.title}>
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
            onChange: onChange("firstName"),
            value: user.email || ""
          }}
          labelText=""/>
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
            onChange: onChange("firstName"),
            value: user.firstName || ""
          }}
          labelText=""/>
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
            onChange: onChange("lastName"),
            value: user.lastName || ""
          }}
          labelText=""/>
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.phone)}:
        </Typography>
        <CustomInput
          error={store.errors["phone"] !== undefined}
          helperText={store.errors["phone"]}
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            onChange: onChange("phone"),
            value: user.phone || ""
          }}
          labelText=""/>
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.birthday)}:
        </Typography>
        <DatePicker
          maxDate={new Date()}
          margin="normal"
          label=""
          id="date-picker-dialog"
          format="MM/dd/yyyy"
          value={user.birthday || new Date()}
          onChange={onChangeDate("birthday")}
        />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.gender)}:
        </Typography>
        <RadioGroup aria-label="position"
                    className={extraClasses.radioGroup}
                    name="gender"
                    value={user.gender}
                    onChange={onChange("gender")} row>
          <FormControlLabel
            value={MALE}
            control={<Radio color="primary"/>}
            label={MALE}
            labelPlacement="start"
          />
          <FormControlLabel
            value={FEMALE}
            control={<Radio color="primary"/>}
            label={FEMALE}
            labelPlacement="start"
          />
        </RadioGroup>
      </Grid>
      <Divider variant="middle"/>
      <Typography variant="subtitle1" color="inherit" align="center" className={extraClasses.title}>
        {Dictionary.defValue(DictionaryService.keys.permissions)}
      </Typography>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.notificationsEmail)}:
        </Typography>
        <Switch
          checked={user.notificationEmail}
          onChange={onSwitch("notificationEmail")}
          value="notificationEmail"
          color="primary"
        />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.notificationSms)}:
        </Typography>
        <Switch
          checked={user.notificationSms}
          onChange={onSwitch("notificationSms")}
          value="notificationSms"
          color="primary"
        />
      </Grid>
      <Grid container item direction="row" className={classes.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.subscriptions)}:
        </Typography>
        <Switch
          checked={user.subscription}
          onChange={onSwitch("subscription")}
          value="subscription"
          color="primary"
        />
      </Grid>
      <ProgressButton
        onClick={() => UserDetails.saveUser()}
        disabled={UserDetails.isPersonalDisabled}
        variant="contained"
        loading={UserDetails.fetching}
        color="primary"
        text={Dictionary.defValue(DictionaryService.keys.save)}
        startIcon={<CloudUploadIcon/>}
      />
    </MuiPickersUtilsProvider>
  );
});
