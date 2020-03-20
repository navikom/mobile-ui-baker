import React from "react";
import {
  Accessibility,
  AccessTime,
  Check,
  DateRange,
  Face,
  HowToReg,
  InfoOutlined,
  People
} from "@material-ui/icons";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { CustomChartLine } from "components/Charts/CustomChartLine";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";

import style from "assets/jss/material-dashboard-react/views/dashboardStyle";
import { makeStyles } from "@material-ui/core";
import CardFooter from "components/Card/CardFooter";
import CardBody from "components/Card/CardBody";
const useStyles = makeStyles(() => style);

function Overview() {
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <People />
              </CardIcon>
              <p className={classes.cardCategory}>
                {Dictionary.defValue(DictionaryService.keys.users)}
                <InfoOutlined />
              </p>
              <h3 className={classes.cardTitle}>2000</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Face />
                {Dictionary.defValue(DictionaryService.keys.totalPeople)}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <HowToReg />
              </CardIcon>
              <p className={classes.cardCategory}>
                {Dictionary.defValue(DictionaryService.keys.knownUsers)}
                <InfoOutlined />
              </p>
              <h3 className={classes.cardTitle}>900</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Check />
                40%
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>
                {Dictionary.defValue(DictionaryService.keys.monthlyActiveUsers)}
                <InfoOutlined />
              </p>
              <h3 className={classes.cardTitle}>1200</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 1 Month
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <CardHeader>
              <CustomChartLine />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Email Subscriptions</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default Overview;
