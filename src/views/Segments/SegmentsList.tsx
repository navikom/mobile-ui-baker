import React, { FC } from 'react';
import { observer, useDisposable } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { when } from "mobx";

// @material-ui/icons
import { AddCircleOutline, Public, List } from "@material-ui/icons";

// @material-ui/core
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

// models
import { App } from "models/App";
import { Segments } from "models/Segment/SegmentsStore";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

import { lazy } from "utils";
import useStyles from "assets/jss/material-dashboard-react/views/cardStyle";
import useListStyles from "assets/jss/material-dashboard-react/views/listStyles";

// view stores
import SegmentViewStore from "views/Segments/store/SegmentViewStore";

// core components
const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const CustomTabs = lazy(() => import("components/CustomTabs/CustomTabs"));
const Table = lazy(() => import("components/Table/TablePagination"));
const RegularButton = lazy(() => import("components/CustomButtons/Button"));
const Overview = lazy(() => import("views/Campaigns/Overview"));

const Title: FC<{ onClick: () => void }> = (props) => {
  const classes = useStyles();
  const eClasses = useListStyles();
  return (
    <Grid container className={eClasses.root}>
      <IconButton className={eClasses.button} onClick={props.onClick}>
        <AddCircleOutline />
      </IconButton>
      <h4 className={classes.cardTitleWhite}>
        {Dictionary.defValue(DictionaryService.keys.segments)}:
      </h4>
    </Grid>
  );
};

const SegmentsTable: FC<{ onBtnClick: () => void }> = observer((props) => {
  const eClasses = useListStyles();
  return (
    <div className={eClasses.root}>
      <Table
        tableProps={{
          tableHeaderColor: "primary",
          tableHead: [
            Dictionary.defValue(DictionaryService.keys.id),
            Dictionary.defValue(DictionaryService.keys.name),
            Dictionary.defValue(DictionaryService.keys.campaigns),
            Dictionary.defValue(DictionaryService.keys.createdAt),
            Dictionary.defValue(DictionaryService.keys.updatedAt)
          ],
          tableData: Segments.plainData
        }}
        paginationProps={{
          rowsPerPageOptions: Segments.rowsPerPageOptions,
          count: Segments.count,
          rowsPerPage: Segments.viewRowsPerPage,
          page: Segments.page,
          onChangePage: Segments.handleChangePageInView,
          onChangeRowsPerPage: Segments.handleChangeRowsPerPage
        }}
        onRowClick={(data: string[]) => {}}
      />
      <RegularButton
        color="primary"
        className={eClasses.buttonAdd}
        onClick={props.onBtnClick}
      >
        {Dictionary.defValue(DictionaryService.keys.add)}{" "}
        {Dictionary.defValue(DictionaryService.keys.segment)}
      </RegularButton>
    </div>
  );
});

function SegmentsList(props: RouteComponentProps) {
  useDisposable(() =>
    when(
      () => App.sessionIsReady,
      () => {
        Segments.fetchItems();
      }
    )
  );

  const newSegment = () => {
    SegmentViewStore.setSegment(0);
    props.history.push(props.match.url + "/0");
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <CustomTabs
          title={<Title onClick={newSegment} />}
          noCardTitle
          headerColor="primary"
          currentIndex={1}
          tabs={[
            {
              tabName: Dictionary.defValue(DictionaryService.keys.overview),
              tabIcon: Public,
              tabContent: <Overview />
            },
            {
              tabName: Dictionary.defValue(DictionaryService.keys.segmentsList),
              tabIcon: List,
              tabContent: <SegmentsTable onBtnClick={newSegment} />
            }
          ]}
        />
      </GridItem>
    </GridContainer>
  );
}

export default SegmentsList;
