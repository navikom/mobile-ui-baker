import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import CustomInput from "components/CustomInput/CustomInput";
import {
  PasswordType,
  UserDetails
} from "views/UserProfile/components/UserDetailsStore";
import ProgressButton from "components/CustomButtons/ProgressButton";
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      width: theme.typography.pxToRem(200)
    }
  })
);

function UserCredentials() {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    extraClasses.label
  );
  const store = UserDetails.passwordStore;
  const onChange = (name: PasswordType) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => store.onInput(name, e.target.value);
  return (
    <Grid container>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.password)}:
        </Typography>
        <CustomInput
          error={store.errors["password"] !== undefined}
          helperText={store.errors["password"]}
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            type: "password",
            onChange: onChange("password"),
            value: store.password
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.newPassword)}:
        </Typography>
        <CustomInput
          error={store.errors["newPassword"] !== undefined}
          helperText={store.errors["newPassword"]}
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            type: "password",
            onChange: onChange("newPassword"),
            value: store.newPassword
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.confirmPassword)}:
        </Typography>
        <CustomInput
          error={store.errors["confirmPassword"] !== undefined}
          helperText={store.errors["confirmPassword"]}
          formControlProps={{
            margin: "none"
          }}
          inputProps={{
            type: "password",
            onChange: onChange("confirmPassword"),
            value: store.confirmPassword
          }}
          labelText=""
        />
      </Grid>
      <ProgressButton
        onClick={() => UserDetails.saveNewPassword()}
        disabled={UserDetails.isPasswordStoreDisabled}
        variant="contained"
        loading={UserDetails.fetching}
        color="primary"
        text={Dictionary.defValue(DictionaryService.keys.save)}
        startIcon={<CloudUploadIcon />}
      />
    </Grid>
  );
}

export default observer(UserCredentials);
