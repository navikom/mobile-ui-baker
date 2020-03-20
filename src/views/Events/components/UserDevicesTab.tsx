import React from "react";

// @material-ui/core components
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";

// @material-ui/icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// interfaces
import { IUsersDevices } from "interfaces/IUsersDevices";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import Chip from "@material-ui/core/Chip";
import { ExpansionDataItems } from "components/ExpansionPanel/ExpansionDataItems";
import ExpansionPanelDetails from "components/ExpansionPanel/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";

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

function UserDevicesTab(props: {devices: IUsersDevices[]}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.devices.length ? (
        props.devices.map((device: IUsersDevices, key: number) => (
          <ExpansionPanel key={key}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Chip
                label={
                  <Typography className={classes.heading}>
                    Device {key + 1}
                  </Typography>
                }
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container>
                {device.plainData.map((data, key) => (
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
            Dictionary.defValue(DictionaryService.keys.devices)
          )}
        </Typography>
      )}
    </div>
  );
}

export default UserDevicesTab;
