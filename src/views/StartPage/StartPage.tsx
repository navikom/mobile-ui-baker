import React from "react";
import { RouteComponentProps } from "react-router";
// @material-ui/core components
import { WithStyles } from "@material-ui/core";

import Slide from "@material-ui/core/Slide";
import Fade from "@material-ui/core/Fade";
import withStyles from "@material-ui/core/styles/withStyles";

import styles from "assets/jss/material-dashboard-react/views/singlePageStyle";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import Button from "components/CustomButtons/Button";
import Grid from "@material-ui/core/Grid";
import * as Constants from "models/Constants";

interface StartPageProps
  extends RouteComponentProps,
    WithStyles<typeof styles> {}
class StartPage extends React.Component<StartPageProps> {
  render() {
    const { classes, history } = this.props;
    return (
      <div>
        <Grid container justify="center">
          <Grid item xs={6} sm={6} md={4}>
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
              <Fade in={true} mountOnEnter unmountOnExit>
                <h1
                  className={`${classes.cardTitleWhite} ${classes.titleWhite}`}
                >
                  {Dictionary.defValue(DictionaryService.keys.mobileUiEditor)}
                </h1>
              </Fade>
            </Slide>
            <Grid container justify="center" className={classes.button}>
              <Fade in={true} mountOnEnter>
                <Button
                  onClick={() => history.push(Constants.ROUTE_PROJECTS)}
                  size="lg"
                  color="primary">
                  {Dictionary.defValue(DictionaryService.keys.getStarted)}
                </Button>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(StartPage);
