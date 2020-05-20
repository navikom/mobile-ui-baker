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

const Overview1 = '/images/doc_overview_1.png';
const Overview2 = '/images/doc_overview_2.png';
const Overview3 = '/images/doc_overview_3.png';

const EditorOverview: React.FC = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h1">{Dictionary.defValue(DictionaryService.keys.projectControlsHowItWorks)}</Typography>
      <br />
      <br />
      <Typography variant="h2">{Dictionary.defValue(DictionaryService.keys.designFlexibility)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.oneOfTheBiggestStrength)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.thisIsAchievedBySeparating)}</Typography>
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.rightSideToolbar)}</Typography>
      <br />
      <Typography variant="h4"><b>{Dictionary.defValue(DictionaryService.keys.projectTab)}</b></Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.generalToolsAndSettingsOfProject)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.inThisTabUsersCanManipulate)}</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={Overview1}
        />
      </Grid>
      <br />
      <Typography variant="h4"><b>{Dictionary.defValue(DictionaryService.keys.controlTab)}</b></Typography>
      <br/>
      <Typography>{Dictionary.defValue(DictionaryService.keys.viewElementsToolsAndSettings)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.inControlTabUsersCanChoose)}</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={Overview2}
        />
      </Grid>
      <br />
      <Typography variant="h4">{Dictionary.defValue(DictionaryService.keys.grid)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.toUseThemJust)}</Typography>
      <Typography>{Dictionary.defValue(DictionaryService.keys.everyContentBlockHasItsOwn)}</Typography>
      <br />
      <Grid container justify="center">
        <LazyLoadImage
          className={classes.img}
          src={Overview3}
        />
      </Grid>
      <br />
      <Typography variant="h3">{Dictionary.defValue(DictionaryService.keys.leftSideToolbar)}</Typography>
      <br />
      <Typography>{Dictionary.defValue(DictionaryService.keys.frequentlyWhenTheMobileUINotSimple)}</Typography>
    </React.Fragment>
  )
};

export default EditorOverview;
