import React from 'react';
import { Card, CardMedia, Link, makeStyles } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { App } from 'models/App';
import { ROUTE_DOCS_EDITOR_OVERVIEW } from 'models/Constants';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  cover: {
    width: '100%',
    minHeight: 300,
  }
});

const Overview: React.FC = () => {
  const classes = useStyles();
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
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardMedia component="iframe" className={classes.cover} src="https://www.youtube.com/embed/ycvGCaWxtPI" />
          </Card>
        </Grid>
      </Grid>
      <br/>
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.aboutTheEditor)}</Typography>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.makesItEasyToCreateA)}{' '}
        <Link href="https://facetsui.com/editor" target="_blank">facetsui.com.</Link>
      </Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.amongBenefits)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.itsFreeToUse)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.itFeaturesADragNDrop)}</Typography>
      <Typography
        component="li">{Dictionary.defValue(DictionaryService.keys.youCanChangeMobilePlatformAndOrientation)}</Typography>
      <Typography component="li">{Dictionary.defValue(DictionaryService.keys.youCanShareUIForView)}</Typography>
      <Typography
        component="li">{Dictionary.defValue(DictionaryService.keys.youCanTranslateMobileDesignInToReactNativeSourceCode)}</Typography>
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
