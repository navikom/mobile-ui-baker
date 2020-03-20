import React, { useEffect } from "react";
import { when } from "mobx";
import { observer, useDisposable, useObserver } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";

// @material-ui/core components
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

// @material-ui/icons
import { Clear } from "@material-ui/icons";
import AddAlert from "@material-ui/icons/AddAlert";

// models
import { APP_LIST_ROUTE } from "models/Constants";
import { Apps } from "models/App/AppsStore";
import { App } from "models/App";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import { lazy } from "utils";
import useStyles from "assets/jss/material-dashboard-react/views/cardStyle";
import CardFooter from "components/Card/CardFooter";

import ProgressButton from "components/CustomButtons/ProgressButton";
import CustomInput from "components/CustomInput/CustomInput";
import Snackbar from "components/Snackbar/Snackbar";

const Table = lazy(() => import("components/Table/TablePagination"));
const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const Card = lazy(() => import("components/Card/Card"));
const CardHeader = lazy(() => import("components/Card/CardHeader.tsx"));
const CardBody = lazy(() => import("components/Card/CardBody.tsx"));

const AppTable = observer((props: { handleClick(id: string): void }) => {
  return (
    <Table
      tableProps={{
        tableHeaderColor: "primary",
        tableHead: [
          Dictionary.defValue(DictionaryService.keys.id),
          Dictionary.defValue(DictionaryService.keys.title),
          Dictionary.defValue(DictionaryService.keys.createdAt),
          Dictionary.defValue(DictionaryService.keys.description)
        ],
        tableData: Apps.appTableData
      }}
      paginationProps={{
        rowsPerPageOptions: Apps.rowsPerPageOptions,
        count: Apps.count,
        rowsPerPage: Apps.viewRowsPerPage,
        page: Apps.viewPage,
        onChangePage: Apps.handleChangePageInView,
        onChangeRowsPerPage: Apps.handleChangeRowsPerPage
      }}
      onRowClick={(data: string[]) => props.handleClick(data[0])}
    />
  );
});

type AppsProps = RouteComponentProps

function AppList(props: AppsProps) {
  const classes = useStyles();

  const dispose = useDisposable(() =>
    when(() => App.sessionIsReady, () => Apps.fetchItems())
  );

  useEffect(() => {
    return () => {
      dispose();
    };
  });

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              {Dictionary.defValue(DictionaryService.keys.applicationsList)}
            </h4>
            <p className={classes.cardCategoryWhite}>
              {Dictionary.defValue(
                DictionaryService.keys.availableApplications
              )}
            </p>
          </CardHeader>
          <CardBody>
            <AppTable
              handleClick={(appId: string) =>
                props.history.push(`${APP_LIST_ROUTE}/${appId}/overview`)
              }
            />
          </CardBody>
          <CardFooter>
            {useObserver(() => {
              return (
                <Grid container item direction="row" className={classes.center}>
                  <Grid item lg={1} xs={3}>
                    <Typography variant="subtitle2">
                      {Dictionary.defValue(DictionaryService.keys.newApp)}:
                    </Typography>
                  </Grid>
                  <Grid item lg={3} xs={3} className={classes.form}>
                    <CustomInput
                      formControlProps={{
                        margin: "none"
                      }}
                      inputProps={{
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                          Apps.onInput({ title: e.target.value }),
                        defaultValue: Apps.title
                      }}
                      labelText={Dictionary.defValue(
                        DictionaryService.keys.title
                      )}
                    />
                  </Grid>
                  <Grid item lg={1} xs={3}>
                    <ProgressButton
                      onClick={() => Apps.addApp()}
                      disabled={Apps.isDisabled}
                      variant="contained"
                      loading={Apps.fetching}
                      color="primary"
                      text={Dictionary.defValue(DictionaryService.keys.add)}
                      startIcon={<CloudUploadIcon />}
                    />
                  </Grid>
                </Grid>
              );
            })}
          </CardFooter>
        </Card>
      </GridItem>
      {useObserver(() => {
        return (
          <div>
            <Snackbar
              place="br"
              color="info"
              icon={AddAlert}
              message={Dictionary.defValue(
                DictionaryService.keys.dataSavedSuccessfully,
                Apps.title
              )}
              open={Apps.successRequest}
              closeNotification={() => Apps.setSuccessRequest(false)}
              close
            />
            <Snackbar
              place="br"
              color="danger"
              icon={Clear}
              message={Dictionary.defValue(
                DictionaryService.keys.dataSaveError,
                [Apps.title, Apps.error || ""]
              )}
              open={Apps.hasError}
              closeNotification={() => Apps.setError(null)}
              close
            />
          </div>
        );
      })}
    </GridContainer>
  );
}

export default AppList;
