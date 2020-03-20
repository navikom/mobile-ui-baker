import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

// @material-ui/icons
import { PeopleAlt } from "@material-ui/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import BootstrapInput from "components/CustomInput/BootstrapInput";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";
import ProgressButton from "components/CustomButtons/ProgressButton";
import SegmentDetailsUser from "views/Segments/components/userTab/SegmentDetailsUser";
import SegmentDetailsBehavior from "views/Segments/components/behavior/SegmentDetailsBehavior";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";

import {
  grayColor,
  infoColor,
} from "assets/jss/material-dashboard-react";
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

import SegmentDetailsTechnology from "views/Segments/components/technology/SegmentDetailsTechnology";

import "react-circular-progressbar/dist/styles.css";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.typography.pxToRem(20)
    },
    title: {
      opacity: 0.5,
      marginTop: theme.typography.pxToRem(10)
    },
    label: {
      width: theme.typography.pxToRem(200),
      marginRight: theme.typography.pxToRem(30)
    },
    titleWrapper: {
      display: "flex",
      alignItems: "center"
    },
    heading: {
      opacity: 0.5,
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    },
    cardTitle: {
      opacity: 0.5,
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: 300,
      fontFamily: "'Josefin Sans', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    },
    stats: {
      color: grayColor[2],
      display: "inline-flex",
      fontSize: "12px",
      lineHeight: "22px",
      "& svg": {
        top: "4px",
        width: "16px",
        height: "16px",
        position: "relative",
        marginRight: "3px",
        marginLeft: "3px"
      },
      "& .fab,& .fas,& .far,& .fal,& .material-icons": {
        top: "10px",
        fontSize: "6px",
        position: "relative",
        marginRight: "3px",
        marginLeft: "3px"
      }
    },
    cardCategory: {
      color: grayColor[2],
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      paddingTop: "10px",
      marginBottom: "0",
      "& svg": {
        top: "8px",
        width: "17px!important",
        height: "17px!important",
        position: "relative",
        opacity: 0.5
      }
    }
  })
);

export default observer(() => {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    extraClasses.label
  );
  const percentage = 90;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardBody>
            <Grid container item direction="row">
              <Grid
                item
                xs={3}
                sm={2}
                md={2}
                className={extraClasses.titleWrapper}
              >
                <Typography variant="subtitle2" className={centerNote}>
                  {Dictionary.defValue(DictionaryService.keys.name)}:
                </Typography>
              </Grid>
              <Grid item xs={6} sm={8} md={7}>
                <BootstrapInput fullWidth />
              </Grid>
              <Grid item xs={3} sm={2} md={3} className={classes.textToRight}>
                <Button
                  color="primary"
                  onClick={() => SegmentViewStore.clearAll()}
                >
                  {Dictionary.defValue(DictionaryService.keys.resetAll)}
                </Button>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={extraClasses.heading}>
              {Dictionary.defValue(DictionaryService.keys.user)}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SegmentDetailsUser />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={extraClasses.heading}>
              {Dictionary.defValue(DictionaryService.keys.behavior)}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SegmentDetailsBehavior />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={extraClasses.heading}>
              {Dictionary.defValue(DictionaryService.keys.technology)}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SegmentDetailsTechnology />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Card>
          <CardFooter>
            <ProgressButton
              color="primary"
              onClick={() => SegmentViewStore.saveSegment()}
              loading={false}
              text={Dictionary.defValue(DictionaryService.keys.save)}
              startIcon={<CloudUploadIcon />}
            />
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <Card chart>
          <CardHeader>
            <h4 className={extraClasses.cardTitle}>
              {Dictionary.defValue(DictionaryService.keys.segmentDetails)}
            </h4>
            <CircularProgressbar
              className={extraClasses.container}
              value={percentage}
              text={`${percentage}%`}
              strokeWidth={4}
              styles={buildStyles({
                rotation: 0.05,
                pathColor: infoColor[0],
                textColor: infoColor[0]
              })}
            />
          </CardHeader>
          <CardBody>
            <h4 className={extraClasses.cardTitle}>
              {Dictionary.defValue(DictionaryService.keys.users)}
            </h4>
            <p className={extraClasses.cardCategory}>
              {Dictionary.defValue(DictionaryService.keys.total)}: 100
            </p>
          </CardBody>
          <CardFooter chart>
            <div className={extraClasses.stats}>
              <PeopleAlt /> {Dictionary.defValue(DictionaryService.keys.known)}:
              90
            </div>
            <div className={extraClasses.stats}>
              <PeopleAlt />{" "}
              {Dictionary.defValue(DictionaryService.keys.unknown)}: 10
            </div>
            <div className={extraClasses.stats}>
              <PeopleAlt />{" "}
              {Dictionary.defValue(DictionaryService.keys.reachable)}: 50
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
});
