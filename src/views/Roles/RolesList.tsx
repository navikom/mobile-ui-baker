import React from "react";
import { observer } from "mobx-react-lite";

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// @material-ui/icons
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AddAlert from "@material-ui/icons/AddAlert";
import { Clear } from "@material-ui/icons";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// models
import { Roles } from "models/Role/RolesStore";

// core components
import { lazy } from "utils";
import useStyles from "assets/jss/material-dashboard-react/views/cardStyle";
import CardFooter from "components/Card/CardFooter";
import CustomInput from "components/CustomInput/CustomInput";
import ProgressButton from "components/CustomButtons/ProgressButton";
import Snackbar from "components/Snackbar/Snackbar";

const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const Card = lazy(() => import("components/Card/Card"));
const CardHeader = lazy(() => import("components/Card/CardHeader.tsx"));
const CardBody = lazy(() => import("components/Card/CardBody.tsx"));
const Table = lazy(() => import("components/Table/Table"));

export default observer(() => {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>
              {Dictionary.defValue(DictionaryService.keys.roles)}
            </h4>
            <p className={classes.cardCategoryWhite}>
              {Dictionary.defValue(DictionaryService.keys.rolesList)}
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={[
                "ID",
                Dictionary.defValue(DictionaryService.keys.title),
                Dictionary.defValue(DictionaryService.keys.createdAt),
                Dictionary.defValue(DictionaryService.keys.updatedAt),
                Dictionary.defValue(DictionaryService.keys.deletedAt),
                ""
              ]}
              tableData={Roles.tableData}
              onRowClick={(e: any, i: number) => Roles.setCurrentRow(e[1], i)}
            />
          </CardBody>
          <CardFooter>
            <Grid container item direction="row" className={classes.center}>
              <Grid item lg={1} xs={3}>
                <Typography variant="subtitle2">
                  {Dictionary.defValue(DictionaryService.keys.newRole)}:
                </Typography>
              </Grid>
              <Grid item lg={3} xs={3} className={classes.form}>
                <CustomInput
                  error={Roles.errors.name !== undefined}
                  helperText={Roles.errors.name}
                  formControlProps={{
                    margin: "none"
                  }}
                  inputProps={{
                    onFocus: () => Roles.setCurrentRow("", -1),
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      Roles.onInput({ name: e.target.value }),
                    value: Roles.name
                  }}
                  labelText={Dictionary.defValue(DictionaryService.keys.title)}
                />
              </Grid>
              <Grid item lg={1} xs={3}>
                <ProgressButton
                  onClick={() => Roles.addRole()}
                  disabled={Roles.isDisabled}
                  variant="contained"
                  loading={Roles.fetching}
                  color="primary"
                  text={Dictionary.defValue(DictionaryService.keys.add)}
                  startIcon={<CloudUploadIcon />}
                />
              </Grid>
            </Grid>
          </CardFooter>
        </Card>
        <Snackbar
          place="br"
          color="info"
          icon={AddAlert}
          message={Dictionary.defValue(
            DictionaryService.keys.dataSavedSuccessfully,
            "Role"
          )}
          open={Roles.successRequest}
          closeNotification={() => Roles.setSuccessRequest(false)}
          close
        />
        <Snackbar
          place="br"
          color="danger"
          icon={Clear}
          message={Dictionary.defValue(DictionaryService.keys.dataSaveError, [
            "Role",
            Roles.error || ""
          ])}
          open={Roles.hasError}
          closeNotification={() => Roles.setError(null)}
          close
        />
      </GridItem>
    </GridContainer>
  );
});
