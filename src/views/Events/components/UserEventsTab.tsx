import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core components
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

// @material-ui/icons
import { Lens } from "@material-ui/icons";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// interfaces
import { IEvent } from "interfaces/IEvent";
import { IUsersEvents } from "interfaces/IUsersEvents";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

import ProgressButton from "components/CustomButtons/ProgressButton";
import { ExpansionDataItems } from "components/ExpansionPanel/ExpansionDataItems";

const useInfoStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.typography.pxToRem(20)
    }
  })
);

type InfoItemType = {
  title: string;
  data: string[][];
}

function InfoItem(props: InfoItemType) {
  const classes = useInfoStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={12} md={12}>
        <Chip label={props.title} />
      </Grid>
      {props.data.map((prop: (string | {[key: string]: string})[], key: number) => (
        <ExpansionDataItems key={key} title={prop[0]} data={prop[1]} />
      ))}
    </Grid>
  );
}

type EventInfoType = {
  data: IEvent;
}

function EventInfo(props: EventInfoType) {
  return (
    <Grid container>
      <InfoItem title={Dictionary.defValue(DictionaryService.keys.device)} data={props.data.device.plainData} />
      <InfoItem title={Dictionary.defValue(DictionaryService.keys.region)} data={props.data.region.plainData} />
      {props.data.app && (
        <InfoItem title={Dictionary.defValue(DictionaryService.keys.application)} data={props.data.app.plainData} />
      )}
      {props.data.hasCustom && (
        <InfoItem
          title={Dictionary.defValue(DictionaryService.keys.custom)}
          data={Object.keys(props.data.info).map(k => [
            k,
            props.data.info && props.data.info[k] ? JSON.stringify(props.data.info[k]) : ""
          ])}
        />
      )}
    </Grid>
  );
}

const ExpansionPanel = withStyles({
  root: {
    boxShadow: "none",
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative"
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    leftSpace: {
      minWidth: theme.typography.pxToRem(150)
    },
    date: {
      fontWeight: 600,
      opacity: 0.3
    },
    titleContent: {
      marginLeft: theme.typography.pxToRem(15),
      fontWeight: 600
    },
    icon: {
      color: "#efefef"
    },
    overflow: {
      overflow: "hidden"
    },
    flex: {
      boxSizing: "border-box"
    },
    content: {
      paddingLeft: theme.typography.pxToRem(20),
      marginLeft: theme.typography.pxToRem(20)
    },
    line: {
      position: "absolute",
      borderLeft: "1px solid #efefef",
      top: theme.typography.pxToRem(25),
      left: "11.58rem",
      height: "95%"
    }
  })
);

function UserEventsTab(props: { events: IUsersEvents }) {
  const classes = useStyles();

  const isMobile = window.outerWidth < 1000;

  const leftSpace = classNames({
    [classes.leftSpace]: !isMobile,
    [classes.date]: true
  });

  const leftContentSpace = classNames({
    [classes.leftSpace]: !isMobile
  });

  const content = classNames({
    [classes.content]: !isMobile
  });

  const onClick = () => {
    props.events.tryGetNext();
  };

  const line = classNames({
    [classes.line]: props.events.size > 0
  });
  return (
    <div className={classes.root}>
      {props.events.items.map((event: IEvent, key: number) => (
        <ExpansionPanel square key={key} className={classes.overflow}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Box display="flex">
              <Box className={leftSpace}>
                {Dictionary.timeDateString(event.createdAt)}
              </Box>
              <Box className={classes.icon}>
                <Lens />
              </Box>
              <Box className={classes.titleContent}>{event.title}</Box>
            </Box>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Box className={leftContentSpace} />
            <Box className={content}>
              <EventInfo data={event} />
            </Box>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
      {!isMobile && <div className={line} />}
      {props.events.size > 0
        ? !props.events.allFetched && (
            <ProgressButton
              onClick={onClick}
              loading={props.events.fetching}
              text="Loading more"
            />
          )
        : Dictionary.defValue(DictionaryService.keys.thereIsNoEventsYet)}
    </div>
  );
}

export default observer(UserEventsTab);
