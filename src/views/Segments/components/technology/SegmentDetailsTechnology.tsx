import React, { useState } from "react";
import classNames from "classnames";

// @material-ui/core
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";

// @material-ui/icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// components
import DeviceComponent from "views/Segments/components/technology/DeviceComponent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    heading: {
      opacity: 0.5,
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    box: {
      boxShadow: "none",
      border: "1px solid rgba(0,0,0,.1)"
    },
    forbidBorderBottom: {
      borderBottom: "none"
    }
  })
);

const SegmentDetailsTechnology = () => {
  const classes = useStyles();
  const [opened, setOpened] = useState([false, false]);
  const onChange = (index: number) => (
    event: React.ChangeEvent<{}>,
    expanded: boolean
  ) => {
    const array = opened.slice();
    array[index] = expanded;
    setOpened(array);
  };
  const topBox = classNames({
    [classes.box]: true,
    [classes.forbidBorderBottom]: !opened.find((e: boolean) => e)
  });
  return (
    <div className={classes.root}>
      <ExpansionPanel className={topBox} onChange={onChange(0)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header-1"
        >
          <Typography className={classes.heading}>ANDROID</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <DeviceComponent device="android" />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel className={classes.box} onChange={onChange(1)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header-2"
        >
          <Typography className={classes.heading}>IOS</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <DeviceComponent device="ios" />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default SegmentDetailsTechnology;
