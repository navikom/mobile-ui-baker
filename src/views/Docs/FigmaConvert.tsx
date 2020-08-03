import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { App } from 'models/App';
import {
  ROUTE_DOCS_EDITOR_OVERVIEW,
  ROUTE_DOCS_EDITOR_SAMPLE,
  ROUTE_DOCS_GET_STARTED,
} from 'models/Constants';
import Code from '../../components/Code/Code';

const useStyles = makeStyles(theme => ({
  img: {
    width: '70%'
  }
}));

const importProject = '/images/import-project.png';
const fromFigma = '/images/from-figma.png';
const fromFigmaForm = '/images/from-figma-form.png';
const figmaFileKey = '/images/figma-file-key.png';
const figmaFileKey2 = '/images/figma-file-key-2.png';
const figmaAccessToken = '/images/figma-access-token.png';
const figmaAccessToken2 = '/images/figma-access-token-2.png';

const FigmaConvert: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.downloadProjectFromFigma)}.</Typography>
      <br />
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.youCanImportYourFigmaDesign)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.toImportFigmaProject)}.</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={importProject}
        />
      </Grid>
      <br/>
      <Typography>{Dictionary.defValue(DictionaryService.keys.checkFromFigmaButton)}.</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={fromFigma}
        />
      </Grid>
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.toImportFromFigma)}{' '}
        <b>{Dictionary.defValue(DictionaryService.keys.accessToken)}</b>{' '}
        {Dictionary.defValue(DictionaryService.keys.and)}{' '}
        <b>{Dictionary.defValue(DictionaryService.keys.fileKey)}</b>.
      </Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={fromFigmaForm}
        />
      </Grid>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.takeTheAccessToken)}.</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={figmaAccessToken}
        />
      </Grid>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={figmaAccessToken2}
        />
      </Grid>

      <Typography>{Dictionary.defValue(DictionaryService.keys.takeTheFileKey)}.</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={figmaFileKey}
        />
      </Grid>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={figmaFileKey2}
        />
      </Grid>

      <br />
      <br />
      <Grid container justify="space-between">
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_EDITOR_OVERVIEW)}>
          {Dictionary.defValue(DictionaryService.keys.goToEditorOverview)}
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_EDITOR_SAMPLE)}>
          {Dictionary.defValue(DictionaryService.keys.goToTheProjectSample)}
        </Button>
      </Grid>
    </React.Fragment>
  )
};

export default FigmaConvert;
