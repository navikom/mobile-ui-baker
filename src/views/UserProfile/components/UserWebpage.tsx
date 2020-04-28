import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import { createStyles, makeStyles, Theme, Link } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import CustomInput from "components/CustomInput/CustomInput";
import {
  UserDetails
} from "views/UserProfile/components/UserDetailsStore";
import ProgressButton from "components/CustomButtons/ProgressButton";
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import Button from '@material-ui/core/Button';
import CheckoutStore from 'views/Checkout/CheckoutStore';

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      opacity: .5,
      marginTop: theme.typography.pxToRem(10)
    },
    label: {
      width: theme.typography.pxToRem(200)
    }
  })
);

function UserWebpage() {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    extraClasses.label
  );
  const store = UserDetails.webpageStore;
  const checkoutStore = new CheckoutStore(CheckoutStore.PRO_PLAN_CODE);
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => store.onInput(e.target.value);

  const handleCheckout = () => {
    checkoutStore.startCheckout();
  };
  return (
    <Grid container>
      <Grid container justify="center">
        <Typography variant="subtitle1" color="inherit" align="center" className={extraClasses.title}>
          {Dictionary.defValue(DictionaryService.keys.embeddedToolsDetails)}
        </Typography>
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle1" className={classNames(classes.note, classes.center)}>
          {Dictionary.defValue(DictionaryService.keys.freePlan)}
        </Typography>
        <Button color="primary" variant="outlined" onClick={handleCheckout}>
          {Dictionary.defValue(DictionaryService.keys.upgrade)}
        </Button>
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.webpage)} url:
        </Typography>
        <CustomInput
          error={store.errors["webpage"] !== undefined}
          helperText={store.errors["webpage"]}
          formControlProps={{
            margin: "none",
            style: { width: '300px' }
          }}
          inputProps={{
            onChange,
            value: store.webpage
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          Key:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none",
            style: { width: '300px' }
          }}
          inputProps={{
            disabled: true,
            value: UserDetails.user!.uid || ""
          }}
          labelText=""/>
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          Secret:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: "none",
            style: { width: '300px' }
          }}
          inputProps={{
            disabled: true,
            value: UserDetails.user!.secret || ""
          }}
          labelText=""/>
      </Grid>
      <ProgressButton
        onClick={() => UserDetails.saveWebpage()}
        disabled={UserDetails.webpageStore.isDisabled || UserDetails.user!.webpage === store.webpage}
        variant="contained"
        loading={UserDetails.fetching}
        color="primary"
        text={Dictionary.defValue(DictionaryService.keys.save)}
        startIcon={<CloudUploadIcon />}
      />
      {
        UserDetails.user && UserDetails.user.uid && (
          <Typography variant="body2" color="secondary">{Dictionary.defValue(DictionaryService.keys.youCanEmbedNowEditorInto)}.
            <Link target="_blank" href="https://github.com/navikom/muiditor-plugin"> Muiditor Plugin</Link>
          </Typography>
        )
      }
    </Grid>
  );
}

export default observer(UserWebpage);
