import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

// @material-ui/core
import { createStyles, makeStyles, Theme, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

// services
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';

// core components
import CustomInput from 'components/CustomInput/CustomInput';
import {
  UserDetails
} from 'views/UserProfile/components/UserDetailsStore';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import useStyles from 'assets/jss/material-dashboard-react/components/inputFieldStyle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { ROUTE_BILLING, ROUTE_DOCS_PLUGIN } from 'models/Constants';
import { App } from 'models/App';

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      opacity: .5,
      marginTop: theme.typography.pxToRem(10)
    },
    label: {
      width: theme.typography.pxToRem(200)
    },
    copy: {
      padding: '3px',
      fontSize: theme.typography.pxToRem(10),
      maxHeight: 30
    }
  })
);

function UserWebpage() {
  const defTooltips = [
    Dictionary.defValue(DictionaryService.keys.copyKey, Dictionary.defValue(DictionaryService.keys.key)),
    Dictionary.defValue(DictionaryService.keys.copyKey, Dictionary.defValue(DictionaryService.keys.secret))
  ];
  const [tooltips, setTooltips] = React.useState(defTooltips.slice());
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    extraClasses.label
  );
  const store = UserDetails.webpageStore;
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => store.onInput(e.target.value);

  const handleCheckout = () => {
    App.navigationHistory && App.navigationHistory.push(ROUTE_BILLING);
  };

  const copyToClipboard = (index: number, id: string) => () => {
    const input = document.getElementById(id) as HTMLInputElement & { select: () => void; setSelectionRange: (a: number, b: number) => void };
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand('copy');

      const newTooltips = tooltips.slice();
      newTooltips[index] =
        Dictionary.defValue(DictionaryService.keys.copied, Dictionary.defValue(DictionaryService.keys.key));
      setTooltips(newTooltips);
      setTimeout(() => {
        setTooltips(defTooltips.slice());
      }, 3000);
    }

  }

  return (
    <Grid container>
      <Grid container justify="center">
        <Typography variant="subtitle1" color="inherit" align="center" className={extraClasses.title}>
          {Dictionary.defValue(DictionaryService.keys.embeddedToolsDetails)}
        </Typography>
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle1" color="primary" className={centerNote} style={{opacity: 0.8}}>
          {UserDetails.user!.plan.title}
        </Typography>
        <Button color="primary" variant="outlined" onClick={handleCheckout}>
          {Dictionary.value(UserDetails.user!.plan.id > 0 ? 'update' : 'upgrade')}
        </Button>
      </Grid>
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.webpage)} url:
        </Typography>
        <CustomInput
          error={store.errors['webpage'] !== undefined}
          helperText={store.errors['webpage']}
          formControlProps={{
            margin: 'none',
            style: { width: '300px' }
          }}
          inputProps={{
            onChange,
            value: store.webpage
          }}
          labelText=""
        />
      </Grid>
      <Grid container item direction="row" alignItems="center">
        <Typography variant="subtitle2" className={centerNote}>
          Key:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: 'none',
            style: { width: '300px' }
          }}
          inputProps={{
            id: 'key',
            value: UserDetails.user!.uid || ''
          }}
          labelText="" />
        {
          UserDetails.user && UserDetails.user.uid && (
            <Tooltip placement="top" title={tooltips[0]}>
              <Button
                classes={{
                  root: extraClasses.copy
                }}
                onClick={copyToClipboard(0, 'key')}
                variant="text" size="small">
                {Dictionary.defValue(DictionaryService.keys.copy)}
              </Button>
            </Tooltip>
          )
        }
      </Grid>
      <Grid container item direction="row" alignItems="center">
        <Typography variant="subtitle2" className={centerNote}>
          Secret:
        </Typography>
        <CustomInput
          formControlProps={{
            margin: 'none',
            style: { width: '300px' }
          }}
          inputProps={{
            id: 'secret',
            value: UserDetails.user!.secret || ''
          }}
          labelText="" />
        {
          UserDetails.user && UserDetails.user.secret && (
            <Tooltip placement="top" title={tooltips[1]}>
              <Button
                classes={{
                  root: extraClasses.copy
                }}
                onClick={copyToClipboard(1, 'secret')}
                variant="text" size="small">
                {Dictionary.defValue(DictionaryService.keys.copy)}
              </Button>
            </Tooltip>
          )
        }
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
          <Typography variant="body2"
                      color="secondary">{Dictionary.defValue(DictionaryService.keys.youCanEmbedNowEditorInto)}.
            <Link target="_blank" href={ROUTE_DOCS_PLUGIN}> FacetsUI Plugin</Link>
          </Typography>
        )
      }
    </Grid>
  );
}

export default observer(UserWebpage);
