import React from "react";

// @material-ui/core components
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";

// @material-ui/icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// interfaces
import { IUsersApps } from "interfaces/IUsersApps";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import { ExpansionDataItems } from "components/ExpansionPanel/ExpansionDataItems";
import ExpansionPanelDetails from "components/ExpansionPanel/ExpansionPanelDetails";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    }
  })
);

function UserAppsTab(props: {apps: IUsersApps[]}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.apps.length ? (
        props.apps.map((uApp: IUsersApps, key: number) => (
          <ExpansionPanel key={key}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Chip
                label={
                  <Typography className={classes.heading}>
                    {uApp.app.title}
                  </Typography>
                }
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                {uApp.plainData.map((data, key) => (
                  <ExpansionDataItems
                    key={key}
                    title={data[0]}
                    data={data[1]}
                  />
                ))}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))
      ) : (
        <Typography variant="h5" gutterBottom>
          {Dictionary.defValue(
            DictionaryService.keys.cannotDetectForThatUser,
            Dictionary.defValue(DictionaryService.keys.apps)
          )}
        </Typography>
      )}
    </div>
  );
}

export default UserAppsTab;
