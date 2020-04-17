import React from "react";
import { observer, useDisposable } from "mobx-react-lite";
import { when } from "mobx";
import { RouteComponentProps } from "react-router";

// utils
import { lazy } from "utils";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// models
import { App } from "models/App";
import { ROUTE_PROJECTS_LIST } from "models/Constants";
import { OwnProjects } from "models/Project/OwnProjectsStore";

// assets
import useStyle from "assets/jss/material-dashboard-react/components/listStyle";
import Typography from "@material-ui/core/Typography";

// core components
const Table = lazy(() => import("components/Table/TablePagination"));
const Card = lazy(() => import("components/Card/Card.tsx"));
const CardHeader = lazy(() => import("components/Card/CardHeader.tsx"));
const CardBody = lazy(() => import("components/Card/CardBody.tsx"));

const ProjectsList = observer((props: RouteComponentProps) => {
  useDisposable(() => when(() => App.sessionIsReady, () => OwnProjects.fetchItems()));

  const classes = useStyle();

  if (OwnProjects.count === 0) {
    return (
      <Typography
        variant="subtitle1"
        color="inherit"
        align="center"
        className={classes.title}
      >
        {Dictionary.defValue(DictionaryService.keys.noProjects)}.
      </Typography>
    );
  }

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>
          {Dictionary.defValue(DictionaryService.keys.projects)}
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
              Dictionary.defValue(DictionaryService.keys.id),
              Dictionary.defValue(DictionaryService.keys.date),
              Dictionary.defValue(DictionaryService.keys.title),
              Dictionary.defValue(DictionaryService.keys.access),
            ],
            tableData: OwnProjects.projectTableData
          }}
          paginationProps={{
            rowsPerPageOptions: OwnProjects.rowsPerPageOptions,
            count: OwnProjects.count,
            rowsPerPage: OwnProjects.viewRowsPerPage,
            page: OwnProjects.viewPage,
            onChangePage: OwnProjects.handleChangePageInView,
            onChangeRowsPerPage: OwnProjects.handleChangeRowsPerPage
          }}
          onRowClick={(data: string[]) =>
            props.history.push(ROUTE_PROJECTS_LIST + "/" + data[0])
          }
        />
      </CardBody>
    </Card>
  );
});

export default ProjectsList;
