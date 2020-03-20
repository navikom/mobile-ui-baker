import React from "react";
import { observer, useDisposable } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { when } from "mobx";

// @material-ui/icons
import { AddCircleOutline, Public, List } from "@material-ui/icons";

// @material-ui/core
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

// models
import { Campaigns } from "models/Campaign/CampaignsStore";
import { App } from "models/App";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// assets
import useStyles from "assets/jss/material-dashboard-react/views/cardStyle";
import useListStyles from "assets/jss/material-dashboard-react/views/listStyles";

import { lazy } from "utils";

// core components
const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const CustomTabs = lazy(() => import("components/CustomTabs/CustomTabs"));
const Overview = lazy(() => import("views/Campaigns/Overview"));
const Table = lazy(() => import("components/Table/TablePagination"));
const RegularButton = lazy(() => import("components/CustomButtons/Button"));

const Title = observer((props: {onClick: () => void}) => {
  const classes = useStyles();
  const eClasses = useListStyles();
  const store = Campaigns.currentStore;
  return (
    <Grid container className={eClasses.root}>
      <IconButton className={eClasses.button} onClick={props.onClick}>
        <AddCircleOutline/>
      </IconButton>
      <h4 className={classes.cardTitleWhite}>
        {Dictionary.value(store!.title)} {Dictionary.defValue(DictionaryService.keys.campaigns)}:
      </h4>
    </Grid>
  );
});

const CampaignTable = observer((props: {onBtnClick: () => void}) => {
    const eClasses = useListStyles();
    const store = Campaigns.currentStore;
    return (
      <div className={eClasses.root}>
        <Table
          tableProps={{
            tableHeaderColor: "primary",
            tableHead: [
              Dictionary.defValue(DictionaryService.keys.name),
              Dictionary.defValue(DictionaryService.keys.type),
              Dictionary.defValue(DictionaryService.keys.status),
              Dictionary.defValue(DictionaryService.keys.startDate),
              Dictionary.defValue(DictionaryService.keys.delivered),
              Dictionary.defValue(DictionaryService.keys.uniqueOpens),
              Dictionary.defValue(DictionaryService.keys.uniqueClicks),
              Dictionary.defValue(DictionaryService.keys.uniqueConversions),
              Dictionary.defValue(DictionaryService.keys.revenue)
            ],
            tableData: []
          }}
          paginationProps={{
            rowsPerPageOptions: store!.rowsPerPageOptions,
            count: store!.count,
            rowsPerPage: store!.viewRowsPerPage,
            page: store!.page,
            onChangePage: store!.handleChangePageInView,
            onChangeRowsPerPage: store!.handleChangeRowsPerPage
          }}
          onRowClick={(data: string[]) => {
          }}
        />
        <RegularButton color="primary" className={eClasses.buttonAdd} onClick={props.onBtnClick}>
          {Dictionary.defValue(DictionaryService.keys.add)} {Dictionary.defValue(DictionaryService.keys.campaign)}
        </RegularButton>
      </div>
    );
  }
);

function CampaignsList(props: RouteComponentProps) {

  Campaigns.bindCurrentStore(props.match.url);
  useDisposable(() =>
    when(() => App.sessionIsReady, () => Campaigns.fetchItems(props.match.url))
  );

  const newCampaign = () => {
    props.history.push(props.match.url + "/0");
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <CustomTabs
          title={<Title onClick={newCampaign}/>}
          noCardTitle
          headerColor="primary"
          currentIndex={1}
          tabs={[
            {
              tabName: Dictionary.defValue(DictionaryService.keys.overview),
              tabIcon: Public,
              tabContent: <Overview/>
            },
            {
              tabName: Dictionary.defValue(DictionaryService.keys.campaignList),
              tabIcon: List,
              tabContent: <CampaignTable onBtnClick={newCampaign}/>
            }
          ]}
        />
      </GridItem>

    </GridContainer>
  );
}

export default CampaignsList;
