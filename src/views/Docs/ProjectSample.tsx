import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardMedia, makeStyles } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { App } from 'models/App';
import {
  ROUTE_DOCS_EDITOR_OVERVIEW,
  ROUTE_DOCS_VIEWER_OVERVIEW
} from 'models/Constants';
import Code from 'components/Code/Code';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  cover: {
    width: '100%',
    minHeight: 300,
  }
});

const ProjectSample: React.FC = () => {

  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h1">
        {Dictionary.defValue(DictionaryService.keys.simpleMobileScreenWithHeaderAndDrawer)}.
      </Typography>
      <br />
      <br />
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.detailedVideoAboutHow)}{' '}
        <Code>{Dictionary.defValue(DictionaryService.keys.images)}</Code>{', '}
        <Code>{Dictionary.defValue(DictionaryService.keys.icons)}</Code>{' '}
        {Dictionary.defValue(DictionaryService.keys.and).toLowerCase()}{' '}
        <Code>{Dictionary.defValue(DictionaryService.keys.actions)}</Code>.
      </Typography>
      <br />
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardMedia component="iframe" className={classes.cover} src="https://www.youtube.com/embed/QRoiJ96fVWQ" />
          </Card>
        </Grid>
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
          onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_DOCS_VIEWER_OVERVIEW)}>
          {Dictionary.defValue(DictionaryService.keys.goToViewerOverview)}
        </Button>
      </Grid>
    </React.Fragment>
  )
}

export default ProjectSample;
