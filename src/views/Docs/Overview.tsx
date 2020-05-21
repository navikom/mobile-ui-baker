import React from 'react';
import { Link } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { App } from '../../models/App';
import { ROUTE_DOCS_EDITOR_OVERVIEW } from 'models/Constants';
import Grid from '@material-ui/core/Grid';


const Overview: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.whatIsMuiditor)}</Typography>
      <br />
      <br />
      <Typography variant="h2">{Dictionary.defValue(DictionaryService.keys.aboutMuiditor)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.isADragNDropEditor)}</Typography>
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.aboutTheEditor)}</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.makesItEasyToCreateA)}{' '}
        <Link href="https://muiditor.com/editor" target="_blank">muiditor.com.</Link>
      </Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.amongBenefits)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.itsFreeToUse)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.itFeaturesADragNDrop)}</Typography>
      <Typography
        component="li">{Dictionary.defValue(DictionaryService.keys.youCanChangeMobilePlatformAndOrientation)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.youCanShareUIForView)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.doYouWantMore)}</Typography>
      <Typography
        component="li">{Dictionary.defValue(DictionaryService.keys.youCanEmbedEditorOrViewerInsideWebPage)}</Typography>
      <Grid container justify="flex-end">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_EDITOR_OVERVIEW)}>
          {Dictionary.defValue(DictionaryService.keys.goToEditorOverview)}
        </Button>
      </Grid>
    </React.Fragment>
  )
}

export default Overview;
