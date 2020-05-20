import React from 'react';
import { makeStyles, Link } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({

}));

const Overview: React.FC = () => {
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
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.youCanChangeMobilePlatformAndOrientation)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.youCanShareUIForView)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.doYouWantMore)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.youCanEmbedEditorOrViewerInsideWebPage)}</Typography>
    </React.Fragment>
  )
}

export default Overview;
