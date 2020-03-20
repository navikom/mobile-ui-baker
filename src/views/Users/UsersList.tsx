import React from "react";
import { observer, useDisposable } from "mobx-react-lite";
import { when } from "mobx";
import { RouteComponentProps } from "react-router";

// utils
import { lazy } from "utils";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// models
import { Users } from "models/User/UsersStore";
import { App } from "models/App";
import { USERS_LIST_ROUTE } from "models/Constants";

// assets
import useStyle from "assets/jss/material-dashboard-react/components/listStyle";

// core components
const Table = lazy(() => import("components/Table/TablePagination"));
const Card = lazy(() => import("components/Card/Card.tsx"));
const CardHeader = lazy(() => import("components/Card/CardHeader.tsx"));
const CardBody = lazy(() => import("components/Card/CardBody.tsx"));

export default observer((props: RouteComponentProps) => {
  useDisposable(() => when(() => App.sessionIsReady, () => Users.fetchItems()));

  const classes = useStyle();

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>
          {Dictionary.defValue(DictionaryService.keys.users)}
        </h4>
        <p className={classes.cardCategoryWhite}>
          {Dictionary.defValue(DictionaryService.keys.usersDashboard)}
        </p>
      </CardHeader>
      <CardBody>
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
            tableData: Users.userTableData
          }}
          paginationProps={{
            rowsPerPageOptions: Users.rowsPerPageOptions,
            count: Users.count,
            rowsPerPage: Users.viewRowsPerPage,
            page: Users.viewPage,
            onChangePage: Users.handleChangePageInView,
            onChangeRowsPerPage: Users.handleChangeRowsPerPage
          }}
          onRowClick={(data: string[]) =>
            props.history.push(USERS_LIST_ROUTE + "/" + data[0])
          }
        />
      </CardBody>
    </Card>
  );
});
