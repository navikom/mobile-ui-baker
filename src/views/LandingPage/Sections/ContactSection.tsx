import React from 'react';
import classNames from 'classnames';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// @material-ui/icons
import { QuestionAnswer, Facebook, Twitter, Send } from '@material-ui/icons';

// core components
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';

import styles from './whiteSectionStyle';

const useStyles = makeStyles(styles);

const getParams = (params: string[][]) =>
  params.map(param => `${param[0]}=${encodeURIComponent(param[1])}`).join('&');

export default function ContactSection() {
  const classes = useStyles();
  const mailto = () => {
    window.location.href = `mailto:?subject=Check this&body=Hi, I found this and thought you might like it https://www.facetsui.com`;
  }

  const twit = () => {
    const shareURL = 'http://twitter.com/share?';
    const params = [
      ['url', 'https://facetsui.com'],
      ['text', 'Facets UI is the easiest, quickest way to design Mobile UI\'s and share them to attract people'],
      ['hashtags', 'facetsui']
    ];

    window.open(shareURL + getParams(params), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
  };

  const fShare = () => {
    const shareURL = 'http://www.facebook.com/sharer.php?s=100&';
    const params = [
      ['u', 'https://facetsui.com']
    ];
    window.open(shareURL + getParams(params), 'facebook-popup', 'height=350,width=600');
  };

  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>We strive to create only top-notch quality!</h2>
          <h4 className={classes.subTitle}>Our Support System follows the same belief.</h4>
          <h5 className={classes.description}>
            We aim to keep all our users satisfied with the quality of our products, therefore,
            we have created extensive documentations to guide you through installing and using our products.
          </h5>
        </GridItem>
      </GridContainer>
      <GridContainer justify="center">
        <QuestionAnswer className={classes.bigIcon} />
      </GridContainer>
      <Typography variant="h2" align="center">Sharing is caring!</Typography>
      <Grid container justify="center" className={classes.group}>
        <Button
          size="large"
          onClick={twit}
          variant="contained"
          className={classNames(classes.share, classes.twitter)}
          startIcon={<Twitter />}
        >Twitter</Button>
        <Button
          onClick={fShare}
          variant="contained"
          className={classNames(classes.share, classes.facebook)}
          startIcon={<Facebook />}
        >Facebook</Button>
        <Button
          onClick={mailto}
          variant="contained"
          className={classNames(classes.share, classes.email)}
          startIcon={<Send />}
        >Email</Button>
      </Grid>
    </div>
  );
}
