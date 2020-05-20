import React from 'react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link/Link';
import Grid from '@material-ui/core/Grid';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  img: {
    height: 500
  }
}));

const PluginCreds = '/images/doc_plugin_creds.png';

const MuiditorPlugin: React.FC = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.whatIsMuiditorPlugin)}</Typography>
      <br />
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
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.pluginNpmPackage)}</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.goToTheLink)}{' '}
        <Link href="https://github.com/navikom/muiditor-plugin" target="_blank">muiditor-plugin</Link>
        {' '}{Dictionary.defValue(DictionaryService.keys.andFollowInstructions)}
      </Typography>

    </React.Fragment>
  )
}

export default MuiditorPlugin;
