import React from "react";
import { when } from "mobx";
import { observer, useDisposable } from "mobx-react-lite";

// @material-ui/core components
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import {
  People,
  Public,
  BarChart,
  DateRange,
  Accessibility,
  Face,
  HowToReg,
  Check,
  InfoOutlined,
  AccessTime,
  ArrowUpward
} from "@material-ui/icons";

// utils
import { lazy } from "utils";

// models
import { EVENTS_USERS_LIST_ROUTE } from "models/Constants";
import { App } from "models/App";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { RouteComponentProps } from "react-router";
import { Events } from "models/Event/EventsStore";

import style from "assets/jss/material-dashboard-react/views/dashboardStyle";

// core components
import { CustomChartBar } from "components/Charts/CustomChartBar";
import { CustomChartLine } from "components/Charts/CustomChartLine";

const Table = lazy(() => import("components/Table/TablePagination"));
const CustomTabs = lazy(() => import("components/CustomTabs/CustomTabs"));
const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const Card = lazy(() => import("components/Card/Card"));
const CardHeader = lazy(() => import("components/Card/CardHeader"));
const CardBody = lazy(() => import("components/Card/CardBody"));
const CardFooter = lazy(() => import("components/Card/CardFooter"));
const CardIcon = lazy(() => import("components/Card/CardIcon"));

interface UsersTableProps {
  handleClick(id: string): void;
}

interface UsersListProps
  extends RouteComponentProps,
    WithStyles<typeof style> {}

const UsersTable = observer((props: UsersTableProps) => {
  return (
    <Table
      tableProps={{
        tableHeaderColor: "primary",
        tableHead: [
          Dictionary.defValue(DictionaryService.keys.userId),
          Dictionary.defValue(DictionaryService.keys.date),
          Dictionary.defValue(DictionaryService.keys.action),
          Dictionary.defValue(DictionaryService.keys.email),
          Dictionary.defValue(DictionaryService.keys.status),
          Dictionary.defValue(DictionaryService.keys.activity)
        ],
        tableData: Events.eventTableData
      }}
      paginationProps={{
        rowsPerPageOptions: Events.rowsPerPageOptions,
        count: Events.count,
        rowsPerPage: Events.viewRowsPerPage,
        page: Events.viewPage,
        onChangePage: Events.handleChangePageInView,
        onChangeRowsPerPage: Events.handleChangeRowsPerPage
      }}
      onRowClick={(data: string[]) => props.handleClick(data[0])}
    />
  );
});

const EventsList = (props: UsersListProps) => {
  useDisposable(() =>
    when(() => App.sessionIsReady, () => Events.fetchItems())
  );

  const { classes } = props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <CustomTabs
          title={`${Dictionary.defValue(
            DictionaryService.keys.eventsDashboard
          )}:`}
          headerColor="primary"
          tabs={[
            {
              tabName: Dictionary.defValue(DictionaryService.keys.overview),
              tabIcon: Public,
              tabContent: (
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
                            {Dictionary.defValue(
                              DictionaryService.keys.totalPeople
                            )}
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
                            {Dictionary.defValue(
                              DictionaryService.keys.knownUsers
                            )}
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
                            {Dictionary.defValue(
                              DictionaryService.keys.monthlyActiveUsers
                            )}
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
                          <h4 className={classes.cardTitle}>
                            Email Subscriptions
                          </h4>
                          <p className={classes.cardCategory}>
                            Last Campaign Performance
                          </p>
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
              )
            },
            {
              tabName: Dictionary.defValue(DictionaryService.keys.analyze),
              tabIcon: BarChart,
              tabContent: (
                <div>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <Card chart>
                        <CardHeader>
                          <CustomChartBar />
                        </CardHeader>
                        <CardBody>
                          <h4 className={classes.cardTitle}>
                            Email Subscriptions
                          </h4>
                          <p className={classes.cardCategory}>
                            Last Campaign Performance
                          </p>
                        </CardBody>
                        <CardFooter chart>
                          <div className={classes.stats}>
                            <AccessTime /> campaign sent 2 days ago
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
                          <h4 className={classes.cardTitle}>
                            {Dictionary.defValue(
                              DictionaryService.keys.activity
                            )}
                          </h4>
                          <p className={classes.cardCategory}>
                            <span className={classes.successText}>
                              <ArrowUpward
                                className={classes.upArrowCardCategory}
                              />{" "}
                              55%
                            </span>{" "}
                            {Dictionary.defValue(
                              DictionaryService.keys.inTodayActivity,
                              Dictionary.defValue(
                                DictionaryService.keys.increase
                              )
                            )}
                            .
                          </p>
                        </CardBody>
                        <CardFooter chart>
                          <div className={classes.stats}>
                            <AccessTime />{" "}
                            {Dictionary.defValue(
                              DictionaryService.keys.updatedMinutesAgo,
                              "4"
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    </GridItem>
                  </GridContainer>
                </div>
              )
            },
            {
              tabName: Dictionary.defValue(DictionaryService.keys.list),
              tabIcon: People,
              tabContent: (
                <UsersTable
                  handleClick={(userId: string) =>
                    props.history.push(EVENTS_USERS_LIST_ROUTE + "/" + userId)
                  }
                />
              )
            }
          ]}
        />
      </GridItem>
    </GridContainer>
  );
};

export default withStyles(style)(EventsList);
