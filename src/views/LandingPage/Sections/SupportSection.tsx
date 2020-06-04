import React from 'react';
import classNames from 'classnames';
import { makeStyles, Card, withStyles, Theme, createStyles } from '@material-ui/core';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import styles from './whiteSectionStyle';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { GitHub, LibraryBooks } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import { whiteColor } from 'assets/jss/material-dashboard-react';

const CardComponent = withStyles((theme: Theme) =>
  createStyles({
    root: {
    }
  })
)(Card);

const useStyles = makeStyles(styles);

const SupportSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={10} sm={8} md={6} style={{ position: 'relative' }}>
          <CardComponent>
            <CardHeader
              title="If you have questions, please contact us on Support and Github"
            />
            <CardContent>
              <Grid container justify="center" className={classes.group}>
                <Button
                  variant="outlined"
                  className={classNames(classes.share)}
                  startIcon={<GitHub />}
                >GitHub issues</Button>
                <Button
                  variant="outlined"
                  className={classNames(classes.share)}
                  startIcon={<LibraryBooks />}
                >Docs</Button>
              </Grid>
            </CardContent>
          </CardComponent>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default SupportSection;
