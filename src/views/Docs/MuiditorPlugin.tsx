import React from 'react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link/Link';
import Grid from '@material-ui/core/Grid';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { makeStyles } from '@material-ui/core';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import { ROUTE_DOCS_PLUGIN_PROPERTIES, ROUTE_DOCS_VIEWER_OVERVIEW } from '../../models/Constants';
import { App } from 'models/App';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  img: {
    height: 500
  },
  code: {
    width: '100%',
    backgroundColor: blackOpacity(.1),
    borderRadius: theme.typography.pxToRem(5)
  }
}));

const PluginCreds = '/images/doc_plugin_creds.png';

const MuiditorPlugin: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.whatIsMuiditorPlugin)}</Typography>
      <br />
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.pluginNpmPackage)}</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.hereIsALinkToThe)}{' '}
        <Link href="https://github.com/navikom/muiditor-plugin" target="_blank">muiditor-plugin</Link>
      </Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.isEmbeddedVersionOfEditor)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.isAJavaScriptPackage)}</Typography>
      <br />
      <Typography variant="h2">{Dictionary.defValue(DictionaryService.keys.initializeThePlugin)}</Typography>
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.getKeyAndSecret)}</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.toUsePluginInYourWebPage)}{' '}
        <Link href="https://muiditor.com/panel/user-profile" target="_blank">User Profile</Link>
        {' '}{Dictionary.defValue(DictionaryService.keys.enterYourWebPageUrl)}.
      </Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={PluginCreds}
        />
      </Grid>
      <br />
      <br />
      <Grid container justify="space-between">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_VIEWER_OVERVIEW)}>
          {Dictionary.defValue(DictionaryService.keys.goToViewerOverview)}
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_PLUGIN_PROPERTIES)}>
          {Dictionary.defValue(DictionaryService.keys.goToPluginProperties)}
        </Button>
      </Grid>
    </div>
  )
}

export default MuiditorPlugin;
