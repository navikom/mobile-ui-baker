import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  img: {
    height: 500
  }
}));

const Overview1 = '/images/doc_viewer.png';

const ViewerOverview: React.FC = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.aboutViewer)}</Typography>
      <br />
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.thisIsAPreviewTool)}</Typography>
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.whyYouNeedIt)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.theViewerAllowsShowMobileDesign)}</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={Overview1}
        />
      </Grid>
    </React.Fragment>
  )
}

export default ViewerOverview;
